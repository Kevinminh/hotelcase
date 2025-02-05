import { db } from "@/server/db/config"
import { eq } from "drizzle-orm"

import { RoleTypesType } from "@/types/types"
import { PermissionType } from "@/server/db/schemas/types"
import { permissions, rolePermissions, roles } from "../schemas/permission"

type DefaultPermissionsType = {
	name: PermissionType["name"]
	description: string
}

type DefaultRolesType = {
	name: RoleTypesType
	description: string
	permissions: PermissionType["name"][]
}

export const PERMISSIONS = {
	VIEW_HOTEL: "view:hotel",
	BOOK_HOTEL: "book:hotel",
	CREATE_HOTEL: "create:hotel",
	EDIT_HOTEL: "edit:hotel",
	DELETE_HOTEL: "delete:hotel",
	DELETE_USER: "delete:user",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const defaultPermissions: DefaultPermissionsType[] = [
	{ name: PERMISSIONS.VIEW_HOTEL, description: "Can view hotel" },
	{ name: PERMISSIONS.BOOK_HOTEL, description: "Can book hotel" },
	{ name: PERMISSIONS.CREATE_HOTEL, description: "Can create hotel" },
	{ name: PERMISSIONS.EDIT_HOTEL, description: "Can edit hotel" },
	{ name: PERMISSIONS.DELETE_HOTEL, description: "Can delete hotel" },
	{ name: PERMISSIONS.DELETE_USER, description: "Can delete user" },
]

export const defaultRoles: DefaultRolesType[] = [
	{
		name: "owner",
		description: "Hotel owner",
		permissions: ["*"],
	},
	{
		name: "manager",
		description: "Hotel manager",
		permissions: ["view:members", "create:members", "update:members", "delete:members"],
	},
	{
		name: "user",
		description: "Regular user",
		permissions: ["view:members"],
	},
]

export async function initializeRBAC() {
	try {
		// Insert permissions one by one to handle conflicts
		for (const permission of defaultPermissions) {
			await db
				.insert(permissions)
				.values({
					id: crypto.randomUUID(),
					...permission,
				})
				.onConflictDoUpdate({
					target: permissions.name,
					set: {
						description: permission.description,
					},
				})
		}

		// Get all inserted permissions
		const insertedPermissions = await db.select().from(permissions)
		const permissionsMap = new Map(insertedPermissions.map((p) => [p.name, p.id]))

		// Insert roles one by one
		for (const role of defaultRoles) {
			const [insertedRole] = await db
				.insert(roles)
				.values({
					id: crypto.randomUUID(),
					name: role.name,
					description: role.description,
				})
				.onConflictDoUpdate({
					target: roles.name,
					set: {
						description: role.description,
					},
				})
				.returning()

			if (insertedRole) {
				// Delete existing role permissions
				await db.delete(rolePermissions).where(eq(rolePermissions.roleId, insertedRole.id))

				// If role has all permissions
				if (role.permissions.includes("*")) {
					// Insert all permissions for this role
					await db.insert(rolePermissions).values(
						insertedPermissions.map((permission) => ({
							roleId: insertedRole.id,
							permissionId: permission.id,
						}))
					)
				} else {
					// Insert specific permissions for the role
					const rolePermissionValues = role.permissions
						.map((permissionName) => {
							const permissionId = permissionsMap.get(permissionName)
							if (permissionId) {
								return {
									roleId: insertedRole.id,
									permissionId,
								}
							}
							return null
						})
						.filter((v): v is { roleId: string; permissionId: string } => v !== null)

					if (rolePermissionValues.length > 0) {
						await db.insert(rolePermissions).values(rolePermissionValues)
					}
				}
			}
		}

		// eslint-disable-next-line no-console
		console.log("RBAC initialization completed successfully")
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Error initializing RBAC:", error)
		throw error
	}
}
