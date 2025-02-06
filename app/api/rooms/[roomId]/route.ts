/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/server/db/config"
import { rooms } from "@/server/db/schemas"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

// Optional: White list specific domains / IPs
// const allowedDomains = ["127.0.0.1", "localhost"]

// Optional: Set up a rate limiter so users can't make too many requests
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per windowMs
// })

export async function GET(request: Request, { params }: { params: { roomId: string } }) {
	try {
		const { roomId } = params

		const validateRoomId = z.string().uuid()

		if (!validateRoomId.safeParse(roomId).success) {
			return new NextResponse(JSON.stringify({ error: "Invalid room ID" }), {
				status: 400,
			})
		}

		const room = await db.query.rooms.findFirst({
			where: eq(rooms.id, roomId),
		})

		if (!room) {
			return new NextResponse(JSON.stringify({ error: "Room not found" }), {
				status: 404,
			})
		}

		return new NextResponse(JSON.stringify(room), {
			status: 200,
		})
	} catch (error: any) {
		return new NextResponse(JSON.stringify({ error: error.message }), {
			status: 500,
		})
	}
}

const ENCRYPTION_KEY = process.env.API_KEY_SECRET as string
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
	throw new Error("API_KEY_SECRET must be exactly 32 characters long")
}

export async function POST(request: Request, { params }: { params: { roomId: string } }) {
	try {
		const { roomId } = params

		// const body = await request.json()
		// const { apiKey } = body

		// const decryptedKey = verifyApiKey(apiKey, ENCRYPTION_KEY)

		// if (!decryptedKey) {
		// 	return new NextResponse(JSON.stringify({ error: "Invalid API key" }), { status: 401 })
		// }

		const room = await db.query.rooms.findFirst({
			where: eq(rooms.id, roomId),
		})

		if (!room) {
			return new NextResponse(JSON.stringify({ error: "Room not found" }), { status: 404 })
		}

		return new NextResponse(JSON.stringify(room), { status: 200 })
	} catch (error: any) {
		return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
	}
}
