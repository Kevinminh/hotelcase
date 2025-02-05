"use server"

import { db } from "@/server/db/config"
import { users } from "@/server/db/schemas"
import { Permission } from "@/server/db/seeding/roles"
import { getCurrentUser } from "./auth"

/**
 * Check if a user has a specific permission
 * @param userId - The ID of the user to check
 * @param requiredPermission - The permission to check for
 * @returns True if the user has the permission, false otherwise
 */
export async function hasPermission(requiredPermission: Permission): Promise<boolean> {
	try {
		const { user } = await getCurrentUser()

		if (!user) return false

		// Get user's role and its associated permissions
		const result = await db.query.roles.findFirst({
			where: (roles, { eq }) =>
				eq(roles.id, db.select({ roleId: users.roleId }).from(users).where(eq(users.id, user.id)).limit(1)),
			with: {
				permissions: {
					with: {
						permission: true,
					},
				},
			},
		})

		if (!result) return false

		// Check if role has any permissions
		const userPermissions = result.permissions.map((rp) => rp.permission.name)

		// If user has wildcard permission (*), they have access to everything
		if (userPermissions.includes("*")) return true

		// Check if user has the specific permission
		return userPermissions.includes(requiredPermission)
	} catch (error) {
		console.error("Error checking permission:", error)
		return false
	}
}

// Usage example:
// const canViewHotel = await hasPermission(userId, PERMISSIONS.VIEW_HOTEL)
