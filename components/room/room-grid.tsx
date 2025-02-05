import { db } from "@/server/db/config"
import { rooms } from "@/server/db/schemas"
import { RoomGridItem, RoomGridItemSkeleton } from "@/components/room/room-grid-item"
export async function RoomGrid() {
	const dbRooms = await db.select().from(rooms)

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{dbRooms.map((room) => (
				<RoomGridItem key={room.id} room={room} />
			))}
		</div>
	)
}

export async function RoomGridSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 9 }).map((_, index) => (
				<RoomGridItemSkeleton key={index} />
			))}
		</div>
	)
}
