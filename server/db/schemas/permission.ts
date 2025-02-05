import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core"

import { RoleTypesType } from "@/types/types"

// Define all possible permissions
export const permissions = pgTable("permissions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull().unique(), // e.g., "create:comments"
	description: text("description"),
})

// Define roles
export const roles = pgTable("roles", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull().unique().$type<RoleTypesType>().default("user"), // e.g., "admin"
	description: text("description"),
})

// Link roles to permissions (many-to-many)
export const rolePermissions = pgTable(
	"role_permissions",
	{
		roleId: text("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		permissionId: text("permission_id")
			.notNull()
			.references(() => permissions.id, { onDelete: "cascade" }),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
	})
)

// Relations
export const rolesRelations = relations(roles, ({ many }) => ({
	permissions: many(rolePermissions),
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
