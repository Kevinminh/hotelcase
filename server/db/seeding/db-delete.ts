import { db } from "../config"
import { apiKeys, bookings, roomAuditLogs, rooms, userAuditLogs } from "../schemas"
import { users } from "../schemas"
import { roles } from "../schemas"

export async function deleteAllData() {
	try {
		await db.delete(apiKeys)
		await db.delete(users)
		await db.delete(rooms)
		await db.delete(bookings)
		await db.delete(roles)

		await db.delete(userAuditLogs)
		await db.delete(roomAuditLogs)
	} catch (error) {
		console.error("❌ Error deleting data:", error)
		throw error
	}
}
