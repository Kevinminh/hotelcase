import { permissions } from "./permission"
import { users } from "./user"
import { rooms } from "./room"
export type PermissionType = typeof permissions.$inferSelect

export type UserType = typeof users.$inferSelect

export type RoomType = typeof rooms.$inferSelect
