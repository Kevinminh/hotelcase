/* eslint-disable no-console */

import { seedRooms } from "./seeding/rooms"

async function seed() {
	try {
		console.log("🌱 Starting database seed...")
		console.log("📊 Seeding rooms...")
		await seedRooms()
		console.log("✅ Database seeded successfully")
		process.exit(0)
	} catch (error) {
		console.error("❌ Error seeding database:", error)
		process.exit(1)
	}
}

void seed()

export { seed }
