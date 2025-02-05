/* eslint-disable no-console */
import { initializeRBAC } from "./seeding/roles"

async function seed() {
	try {
		console.log("🌱 Starting database seed...")
		console.log("📊 Initializing RBAC...")
		await initializeRBAC()
		console.log("✅ Database seeded successfully")
		process.exit(0)
	} catch (error) {
		console.error("❌ Error seeding database:", error)
		process.exit(1)
	}
}

void seed()

export { seed }
