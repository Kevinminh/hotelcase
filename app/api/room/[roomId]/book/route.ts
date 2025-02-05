/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/server/db/config"
import { eq } from "drizzle-orm"
import { rooms } from "@/server/db/schemas"
import { NextRequest, NextResponse } from "next/server"
import { createBookingSchema } from "@/lib/schema"

type RouteProps = {
	params: Promise<{ roomId: string }>
}

export async function POST(req: NextRequest, { params }: RouteProps) {
	try {
		const { roomId } = await params

		const validateId = createBookingSchema.pick({ roomId: true }).safeParse({ roomId })

		if (!validateId.success) {
			return new NextResponse(JSON.stringify({ error: validateId.error.message }), { status: 400 })
		}

		const validatedId = validateId.data

		const [room] = await db.select().from(rooms).where(eq(rooms.id, validatedId.roomId)).limit(1)

		if (!room) {
			return new NextResponse(JSON.stringify({ error: "Room not found" }), { status: 404 })
		}

		console.log(room)

		return new NextResponse(JSON.stringify({ message: "Room booked successfully" }), {
			status: 200,
		})
	} catch (error: any) {
		return new NextResponse(JSON.stringify({ error: error.message }), {
			status: 500,
		})
	}
}
