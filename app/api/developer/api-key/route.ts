/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/server/actions/auth"
import { hasPermission } from "@/server/actions/permission"
import { PERMISSIONS } from "@/server/db/seeding/roles"
import { db } from "@/server/db/config"
import { apiKeys } from "@/server/db/schemas/api"
import { addDays } from "date-fns"
import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "@/lib/upstash"
import { RATE_LIMIT_10 } from "@/lib/constants"
import { RATE_LIMIT_1_MINUTE } from "@/lib/constants"
import { createApiSchema } from "@/lib/schema"
import { generateApiKey } from "@/lib/utils"

const ENCRYPTION_KEY = process.env.API_KEY_SECRET as string
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
	throw new Error("API_KEY_SECRET must be exactly 32 characters long")
}

const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(RATE_LIMIT_10, RATE_LIMIT_1_MINUTE),
})

export async function POST(req: NextRequest) {
	try {
		// 1. Validate request body
		const body = await req.json()
		const validatedData = createApiSchema.safeParse(body)

		if (!validatedData.success) {
			return new NextResponse(JSON.stringify({ error: validatedData.error.message }), { status: 400 })
		}

		// 2. Get current user and check permissions
		const { user } = await getCurrentUser()

		if (!user) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
		}

		const hasApiPermission = await hasPermission(PERMISSIONS.VIEW_DEVELOPER)
		if (!hasApiPermission) {
			return new NextResponse(JSON.stringify({ error: "Insufficient permissions" }), { status: 403 })
		}

		// 3. Rate limit
		const identifier = `ratelimit:create-api-key:${user.id}`
		const { success } = await ratelimit.limit(identifier)

		if (!success) {
			return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 })
		}

		// 4. Generate API key and its hash
		const apiKey = generateApiKey(ENCRYPTION_KEY)

		// 5. Calculate expiration date if provided
		const expiresAt = validatedData.data.expiresIn ? addDays(new Date(), parseInt(validatedData.data.expiresIn)) : null

		// 6. Store the API key in the database
		await db.insert(apiKeys).values({
			key: apiKey,
			userId: user.id,
			expiresAt: expiresAt,
		})

		// 7. Return the key (will only be shown once)
		return new NextResponse(
			JSON.stringify({
				key: apiKey,
				expiresAt: expiresAt,
			}),
			{ status: 201 }
		)
	} catch (error: any) {
		console.error("Error creating API key:", error)
		return new NextResponse(JSON.stringify({ error: "Failed to create API key" }), { status: 500 })
	}
}
