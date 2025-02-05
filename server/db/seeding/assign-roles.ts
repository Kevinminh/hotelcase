import { db } from "../config"
import { eq } from "drizzle-orm"
import { users } from "../schemas/user"
import { roles } from "../schemas/permission"
export async function assignRoles() {
	const dbUsers = await db.select().from(users)

	const [ownerRole] = await db.select().from(roles).where(eq(roles.name, "owner")).limit(1)

	for (const user of dbUsers) {
		await db
			.update(users)
			.set({
				roleId: ownerRole.id,
			})
			.where(eq(users.id, user.id))
	}
}
