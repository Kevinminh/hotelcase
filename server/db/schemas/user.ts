import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { roles } from "./permission"

export const onboardingStatusEnum = pgEnum("onboarding_status", ["not_started", "in_progress", "completed"])

export const users = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	lastName: text("last_name"),
	email: text("email").unique().notNull(),
	emailVerified: timestamp("emailVerified").defaultNow(),
	image: text("image"),

	roleId: text("role_id").references(() => roles.id, { onDelete: "set null" }),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})

export const userRelations = relations(users, ({ one }) => ({
	role: one(roles, {
		fields: [users.roleId],
		references: [roles.id],
	}),
}))

export const userAuditLogs = pgTable("user_audit_logs", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id").references(() => users.id),
	action: text("action").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})

export const userAuditLogsRelations = relations(userAuditLogs, ({ one }) => ({
	user: one(users, {
		fields: [userAuditLogs.userId],
		references: [users.id],
	}),
}))
