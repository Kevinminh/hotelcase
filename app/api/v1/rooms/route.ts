/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/server/db/config"
import { rooms } from "@/server/db/schemas"
import { NextResponse } from "next/server"

// Optional: White list specific domains / IPs
// const allowedDomains = ["127.0.0.1", "localhost"]

// Optional: Set up a rate limiter so users can't make too many requests
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per windowMs
// })

export async function GET() {
	try {
		const allRooms = await db.select().from(rooms)

		return new NextResponse(JSON.stringify(allRooms), {
			status: 200,
		})
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify({
				error: error.message,
			}),
			{
				status: 500,
			}
		)
	}
}
