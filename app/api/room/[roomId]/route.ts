/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { roomAuditLogs, rooms } from "@/server/db/schemas/room"
import { db, dbClient } from "@/server/db/config"
import { deleteRoomSchema } from "@/lib/schema"
import { getCurrentUser } from "@/server/actions/auth"
import { hasPermission } from "@/server/actions/permission"
import { PERMISSIONS } from "@/server/db/seeding/roles"
import { userAuditLogs } from "@/server/db/schemas/user"

type RouteProps = {
	params: Promise<{ roomId: string }>
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
	try {
		const { roomId } = await params

		// 1. Validate
		const validateId = deleteRoomSchema.pick({ roomId: true }).safeParse({ roomId })

		if (!validateId.success) {
			return new NextResponse(JSON.stringify({ error: validateId.error.message }), { status: 400 })
		}

		const { user } = await getCurrentUser()

		if (!user) {
			await dbClient.transaction(async (tx) => {
				await tx.insert(userAuditLogs).values({
					action: "Failed to delete room",
					description: "Unauthorized user tried to delete room",
					changes: {
						before: {
							roomId: roomId,
						},
						after: {
							roomId: roomId,
						},
					},
					metadata: {
						ip: req.headers.get("x-forwarded-for") || "unknown",
						userAgent: req.headers.get("user-agent") || "unknown",
					},
				})
			})
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
		}

		const hasDeletePermission = await hasPermission(PERMISSIONS.DELETE_ROOM)

		if (!hasDeletePermission) {
			await dbClient.transaction(async (tx) => {
				await tx.insert(userAuditLogs).values({
					action: "Failed to delete room",
					description: "User tried to delete room but doesn't have permission",
					changes: {
						before: {
							roomId: roomId,
						},
						after: {
							roomId: roomId,
						},
					},
					metadata: {
						ip: req.headers.get("x-forwarded-for") || "unknown",
						userAgent: req.headers.get("user-agent") || "unknown",
					},
				})
			})
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
		}

		const room = await db.query.rooms.findFirst({
			where: eq(rooms.id, roomId),
		})

		if (!room) {
			await dbClient.transaction(async (tx) => {
				await tx.insert(userAuditLogs).values({
					action: "Failed to delete room",
					description: "Room not found",
					changes: {
						before: {
							roomId: roomId,
						},
						after: {
							roomId: roomId,
						},
					},
					metadata: {
						ip: req.headers.get("x-forwarded-for") || "unknown",
						userAgent: req.headers.get("user-agent") || "unknown",
					},
				})
			})
			return new NextResponse(JSON.stringify({ error: "Room not found" }), { status: 404 })
		}

		await dbClient.transaction(async (tx) => {
			await tx.delete(rooms).where(eq(rooms.id, roomId))
			await tx.insert(roomAuditLogs).values({
				action: "Delete room",
				description: "Room deleted",
				price: "0",
				changes: {
					before: {
						roomId: room.id,
					},
				},
				metadata: {
					ip: req.headers.get("x-forwarded-for") || "unknown",
					userAgent: req.headers.get("user-agent") || "unknown",
				},
			})
		})

		return new NextResponse(JSON.stringify({ message: "Room deleted successfully" }), { status: 200 })
	} catch (error: any) {
		return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
	}
}
