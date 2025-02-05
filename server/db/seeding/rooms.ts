import { rooms } from "@/server/db/schemas/room"
import fs from "fs"
import path from "path"
import { db } from "../config"
import { RoomType } from "../schemas/types"

export async function seedRooms() {
	try {
		const roomsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "server/data/rooms.json"), "utf-8"))

		await db.insert(rooms).values(
			roomsData.map((room: RoomType) => ({
				id: room.id,
				number: room.number,
				category: room.category,
				image: room.image,
				price: room.price,
				createdAt: new Date(room.createdAt),
				updatedAt: room.updatedAt ? new Date(room.updatedAt) : new Date(),
			}))
		)

		console.log("✅ Rooms seeded successfully")
	} catch (error) {
		console.error("❌ Error seeding rooms:", error)
		throw error
	}
}
