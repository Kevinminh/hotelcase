/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, dbClient } from "@/server/db/config"
import { and, eq, lte, gte } from "drizzle-orm"
import { bookings, roomAuditLogs, rooms, userAuditLogs } from "@/server/db/schemas"
import { NextRequest, NextResponse } from "next/server"
import { cancelBookingSchema, createBookingSchema } from "@/lib/schema"
import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "@/lib/upstash"
import { RATE_LIMIT_10 } from "@/lib/constants"
import { RATE_LIMIT_1_MINUTE } from "@/lib/constants"
import { getCurrentUser } from "@/server/actions/auth"
import { format } from "date-fns"
// import { hasPermission } from "@/server/actions/permission"
// import { PERMISSIONS } from "@/server/db/seeding/roles"
import { resend } from "@/lib/resend"
import { ReceiptMail } from "@/components/bookings/receipt-mail"

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

		// Convert string dates to Date objects before validation - this is to avoid the error:
		// "Invalid date" when the date is not in the correct format
		const body = {
			...rawBody,
			startDate: new Date(rawBody.startDate),
			endDate: new Date(rawBody.endDate),
		}

		const validateBody = createBookingSchema.safeParse(body)

		if (!validateBody.success) {
			return new NextResponse(JSON.stringify({ error: validateBody.error.message }), { status: 400 })
		}

		const { customerId, startDate, endDate, price } = validateBody.data

		// 2. Get user session
		const { user } = await getCurrentUser()

		if (!user) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
		}

		// 3. Validate the customer
		if (customerId !== user.id) {
			await dbClient.transaction(async (tx) => {
				await tx.insert(roomAuditLogs).values({
					roomId: roomId,
					action: "Failed to book",
					description: `User ${user.email} tried to book for another user`,
					price: price.toString(),
				})
				await tx.insert(userAuditLogs).values({
					userId: user.id,
					action: "Failed to book",
					description: `User ${user.email} tried to book for another user`,
				})
			})
		}

		// // 4. Check if user has permission to book
		// const userHasPermission = await hasPermission(PERMISSIONS.BOOK_HOTEL)

		// if (!userHasPermission) {
		// 	await dbClient.transaction(async (tx) => {
		// 		await tx.insert(roomAuditLogs).values({
		// 			roomId: roomId,
		// 			action: "Failed to book",
		// 			description: `User ${user.email} does not have permission to book`,
		// 			price: price.toString(),
		// 		})
		// 		await tx.insert(userAuditLogs).values({
		// 			userId: user.id,
		// 			action: "Failed to book",
		// 			description: `User ${user.email} does not have permission to book`,
		// 		})
		// 	})
		// 	return new NextResponse(JSON.stringify({ error: "You do not have permission to book" }), { status: 401 })
		// }

		// 4. Rate limit
		const identifier = `ratelimit:create-booking:${user.id}`
		const { success } = await ratelimit.limit(identifier)

		if (!success) {
			await dbClient.transaction(async (tx) => {
				await tx.insert(roomAuditLogs).values({
					roomId: roomId,
					action: "Failed to book",
					description: `User ${user.email} has exceeded the rate limit`,
					price: price.toString(),
				})
				await tx.insert(userAuditLogs).values({
					userId: user.id,
					action: "Failed to book",
					description: `User ${user.email} has exceeded the rate limit`,
				})
			})
			return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 })
		}

		const validatedId = validateId.data

		// 5. Check for existing room
		const [room] = await db.select().from(rooms).where(eq(rooms.id, validatedId.roomId)).limit(1)

		if (!room) {
			await dbClient.transaction(async (tx) => {
				await tx.insert(roomAuditLogs).values({
					roomId: validatedId.roomId,
					action: "Failed to book",
					description: `Room ${validatedId.roomId} not found`,
					price: price.toString(),
				})
				await tx.insert(userAuditLogs).values({
					userId: user.id,
					action: "Failed to book",
					description: `Room ${validatedId.roomId} not found`,
				})
			})
		}

		// 6. Check if the dates are in the past
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const normalizedStartDate = new Date(startDate)
		normalizedStartDate.setHours(0, 0, 0, 0)

		const normalizedEndDate = new Date(endDate)
		normalizedEndDate.setHours(0, 0, 0, 0)

		if (normalizedStartDate < today || normalizedEndDate < today) {
			await dbClient.transaction(async (tx) => {
				await tx.insert(roomAuditLogs).values({
					roomId: room.id,
					action: "Failed to book",
					description: `Room ${room.number} is not available for the selected dates: ${format(normalizedStartDate, "yyyy-MM-dd")} to ${format(normalizedEndDate, "yyyy-MM-dd")}`,
					price: price.toString(),
				})
				await tx.insert(userAuditLogs).values({
					userId: user.id,
					action: "Failed to book",
					description: `Room ${room.number} is not available for the selected dates: ${format(normalizedStartDate, "yyyy-MM-dd")} to ${format(normalizedEndDate, "yyyy-MM-dd")}`,
				})
			})

			return new NextResponse(JSON.stringify({ error: "Dates cannot be in the past" }), { status: 400 })
		}

		// 7. Check for existing booking (start and end date)
		const [existingBooking] = await db
			.select()
			.from(bookings)
			.where(and(eq(bookings.roomId, room.id), lte(bookings.startDate, endDate), gte(bookings.endDate, startDate)))

		if (existingBooking) {
			await dbClient.insert(roomAuditLogs).values({
				roomId: room.id,
				action: "Failed to book",
				description: `Room ${room.number} is not available for the selected dates: ${format(new Date(startDate), "yyyy-MM-dd")} to ${format(new Date(endDate), "yyyy-MM-dd")}, by user ${user.email}`,
				price: price.toString(),
			})
			return new NextResponse(JSON.stringify({ error: "Room is not available for the selected dates" }), {
				status: 400,
			})
		}

		// Transaction
		await dbClient.transaction(async (tx) => {
			// 7. Create booking
			const newBooking = await tx
				.insert(bookings)
				.values({
					roomId: room.id,
					customerId: user.id,
					startDate,
					endDate,
					price: price.toString(),
				})
				.returning({
					id: bookings.id,
				})

			// 8. Create audit log
			await tx.insert(roomAuditLogs).values({
				roomId: room.id,
				action: "Book successfully",
				description: `Booked room ${room.number} from ${format(new Date(startDate), "yyyy-MM-dd")} to ${format(
					new Date(endDate),
					"yyyy-MM-dd"
				)}, by user ${user.email} (be careful with exposing this information)`,
				price: price.toString(),
			})

			// 9. Create user audit log
			await tx.insert(userAuditLogs).values({
				userId: user.id,
				action: "Book successfully",
				description: `Booked room ${room.number} from ${format(new Date(startDate), "yyyy-MM-dd")} to ${format(
					new Date(endDate),
					"yyyy-MM-dd"
				)}`,
			})
			// 10. Send email
			await resend.emails.send({
				from: process.env.RESEND_EMAIL as string,
				to: user.email,
				subject: `Booking Confirmation | HotelCase`,
				react: ReceiptMail({
					email: user.email,
					purchaseId: newBooking[0].id,
					licenseUrl: `https://hotelcase.vercel.app/bookings/${newBooking[0].id}`,
					amount: price,
					productName: room.number,
					desc: `HotelCase: ${room.number}`,
					brand: "Free",
					last4: "N/A",
					paymentType: "Free",
					purchaseDate: new Date(),
				}),
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

export async function DELETE(req: NextRequest, { params }: RouteProps) {
	try {
		const { roomId } = await params

		// 1. Validate
		const validateId = cancelBookingSchema.pick({ bookingId: true }).safeParse({ bookingId: roomId })

		if (!validateId.success) {
			return new NextResponse(JSON.stringify({ error: validateId.error.message }), { status: 400 })
		}

		const rawBody = await req.json()

		const validateBody = cancelBookingSchema.safeParse(rawBody)

		if (!validateBody.success) {
			return new NextResponse(JSON.stringify({ error: validateBody.error.message }), { status: 400 })
		}

		const { bookingId, customerId } = validateBody.data

		// 2. Get user session
		const { user } = await getCurrentUser()

		if (!user) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
		}

		// 3. Validate the customer
		if (customerId !== user.id) {
			return new NextResponse(JSON.stringify({ error: "Cant cancel others bookings" }), { status: 401 })
		}

		// 4. Rate limit
		const identifier = `ratelimit:delete-booking:${user.id}`
		const { success } = await ratelimit.limit(identifier)

		if (!success) {
			return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 })
		}

		// 5. Check for existing booking
		const [existingBooking] = await db
			.select()
			.from(bookings)
			.where(and(eq(bookings.id, bookingId), eq(bookings.customerId, user.id)))

		if (!existingBooking) {
			return new NextResponse(JSON.stringify({ error: "Booking not found" }), { status: 404 })
		}

		// 6. Transaction
		await dbClient.transaction(async (tx) => {
			// 7. Delete booking
			await tx.delete(bookings).where(eq(bookings.id, bookingId))

			// 8. Create audit log
			await tx.insert(roomAuditLogs).values({
				roomId: existingBooking.roomId,
				action: "Cancel booking",
				description: `Cancelled booking ${existingBooking.id}`,
				price: existingBooking.price.toString(),
			})

			// 9. Create user audit log
			await tx.insert(userAuditLogs).values({
				userId: user.id,
				action: "Cancel",
				description: `Cancelled booking ${existingBooking.id}`,
			})
		})

		return new NextResponse(JSON.stringify({ message: "Booking cancelled successfully" }), { status: 200 })
	} catch (error: any) {
		return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
	}
}
