import { permissions } from "./permission"
import { userAuditLogs, users } from "./user"
import { roomAuditLogs, rooms } from "./room"
import { bookings } from "./booking"

export type PermissionType = typeof permissions.$inferSelect

export type BookingType = typeof bookings.$inferSelect

export type UserType = typeof users.$inferSelect

export type RoomType = typeof rooms.$inferSelect

export type RoomAuditLogType = typeof roomAuditLogs.$inferSelect

export type UserAuditLogType = typeof userAuditLogs.$inferSelect
