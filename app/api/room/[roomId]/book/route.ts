/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, dbClient } from "@/server/db/config"
import { and, eq, lte, gte } from "drizzle-orm"
import { bookings, roomAuditLogs, rooms } from "@/server/db/schemas"
import { NextRequest, NextResponse } from "next/server"
import { createBookingSchema } from "@/lib/schema"
import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "@/lib/upstash"
import { RATE_LIMIT_10 } from "@/lib/constants"
import { RATE_LIMIT_1_MINUTE } from "@/lib/constants"
import { getCurrentUser } from "@/server/actions/auth"

type RouteProps = {
	params: Promise<{ roomId: string }>
}

const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(RATE_LIMIT_10, RATE_LIMIT_1_MINUTE),
})

export async function POST(req: NextRequest, { params }: RouteProps) {
	try {
		const { roomId } = await params

		// 1. Validate request body
		const validateId = createBookingSchema.pick({ roomId: true }).safeParse({ roomId })

		if (!validateId.success) {
			return new NextResponse(JSON.stringify({ error: validateId.error.message }), { status: 400 })
		}

		const rawBody = await req.json()

		// Convert string dates to Date objects before validation
		const body = {
			...rawBody,
			startDate: new Date(rawBody.startDate),
			endDate: new Date(rawBody.endDate),
		}

		const validateBody = createBookingSchema.safeParse(body)

		if (!validateBody.success) {
			return new NextResponse(JSON.stringify({ error: validateBody.error.message }), { status: 400 })
		}

		const { customerId, startDate, endDate } = validateBody.data

		// 2. Get user session
		const { user } = await getCurrentUser()

		if (!user) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
		}

		// 3. Validate the customer
		if (customerId !== user.id) {
			return new NextResponse(JSON.stringify({ error: "Cant book for others" }), { status: 401 })
		}

		// 4. Rate limit
		const identifier = `ratelimit:create-item:${user.id}`
		const { success } = await ratelimit.limit(identifier)

		if (!success) {
			return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 })
		}

		const validatedId = validateId.data

		// 5. Check for existing room
		const [room] = await db.select().from(rooms).where(eq(rooms.id, validatedId.roomId)).limit(1)

		if (!room) {
			return new NextResponse(JSON.stringify({ error: "Room not found" }), { status: 404 })
		}

		// 6. Check for existing booking (start and end date)
		const [existingBooking] = await db
			.select()
			.from(bookings)
			.where(and(eq(bookings.roomId, room.id), lte(bookings.startDate, endDate), gte(bookings.endDate, startDate)))

		if (existingBooking) {
			return new NextResponse(JSON.stringify({ error: "Room is not available for the selected dates" }), {
				status: 400,
			})
		}

		// Transaction
		await dbClient.transaction(async (tx) => {
			// 7. Create booking
			await tx.insert(bookings).values({
				roomId: room.id,
				customerId: user.id,
				startDate,
				endDate,
			})

			// 8. Create audit log
			await tx.insert(roomAuditLogs).values({
				roomId: room.id,
				action: "Book",
				description: `Booked room ${room.id} from ${startDate} to ${endDate}`,
			})
		})

		return new NextResponse(JSON.stringify({ message: "Room booked successfully" }), {
			status: 200,
		})
	} catch (error: any) {
		return new NextResponse(JSON.stringify({ error: error.message }), {
			status: 500,
		})
	}
}
