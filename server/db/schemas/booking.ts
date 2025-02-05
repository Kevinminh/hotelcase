import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, numeric } from "drizzle-orm/pg-core"
import { rooms } from "./room"
import { users } from "./user"

export const bookings = pgTable("bookings", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	roomId: text("room_id").references(() => rooms.id, { onDelete: "cascade" }),
	customerId: text("customer_id").references(() => users.id, { onDelete: "cascade" }),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	price: numeric("price").notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
})

export const bookingsRelations = relations(bookings, ({ one }) => ({
	room: one(rooms, {
		fields: [bookings.roomId],
		references: [rooms.id],
	}),
	customer: one(users, {
		fields: [bookings.customerId],
		references: [users.id],
	}),
}))

export const bookingAuditLogs = pgTable("booking_audit_logs", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	bookingId: text("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
	action: text("action").notNull(),

	description: text("description"),
	userId: text("user_id").references(() => users.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})

export const bookingAuditLogsRelations = relations(bookingAuditLogs, ({ one }) => ({
	booking: one(bookings, {
		fields: [bookingAuditLogs.bookingId],
		references: [bookings.id],
	}),
	user: one(users, {
		fields: [bookingAuditLogs.userId],
		references: [users.id],
	}),
}))
