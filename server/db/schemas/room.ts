import { RoomCategoryType } from "@/types/types"
import { relations } from "drizzle-orm"
import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { users } from "./user"

export const rooms = pgTable("rooms", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	number: text("number").notNull(),
	category: text("category").notNull().$type<RoomCategoryType>().default("single_bed"),
	image: text("image"),
	price: numeric("price").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})

export const roomAuditLogs = pgTable("room_audit_logs", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	roomId: text("room_id").references(() => rooms.id),
	action: text("action").notNull(),
	description: text("description"),
	userId: text("user_id").references(() => users.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})

export const roomAuditLogsRelations = relations(roomAuditLogs, ({ one }) => ({
	room: one(rooms, {
		fields: [roomAuditLogs.roomId],
		references: [rooms.id],
	}),
	user: one(users, {
		fields: [roomAuditLogs.userId],
		references: [users.id],
	}),
}))
