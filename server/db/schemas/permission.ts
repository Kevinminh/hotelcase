import { relations } from "drizzle-orm"
import { pgTable, text } from "drizzle-orm/pg-core"
import { RoleTypesType } from "@/types/types"

import { users } from "./user"
export const permissions = pgTable("permissions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull().unique(),
	description: text("description"),
})

export const roles = pgTable("roles", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull().unique().$type<RoleTypesType>().default("user"),
	description: text("description"),
})

export const rolePermissions = pgTable("role_permissions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	roleId: text("role_id")
		.notNull()
		.references(() => roles.id, { onDelete: "cascade" }),
	permissionId: text("permission_id")
		.notNull()
		.references(() => permissions.id, { onDelete: "cascade" }),
})

export const rolesRelations = relations(roles, ({ many }) => ({
	permissions: many(rolePermissions),
	users: many(users),
}))

export const permissionsRelations = relations(permissions, ({ many }) => ({
	roles: many(rolePermissions),
}))

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id],
	}),
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id],
	}),
}))
