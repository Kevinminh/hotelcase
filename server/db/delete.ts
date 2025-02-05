/* eslint-disable no-console */

import { deleteAllData } from "./seeding/db-delete"

async function seed() {
	try {
		console.log("🌱 Starting database seed...")
		console.log("📊 Assigning roles...")
		await deleteAllData()
		console.log("✅ Database seeded successfully")
		process.exit(0)
	} catch (error) {
		console.error("❌ Error seeding database:", error)
		process.exit(1)
	}
}

void seed()

export { seed }
