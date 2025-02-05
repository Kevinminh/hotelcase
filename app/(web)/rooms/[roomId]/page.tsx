import { RoomDetails } from "@/components/room/room-details"
import { db } from "@/server/db/config"
import { rooms } from "@/server/db/schemas"
import { eq } from "drizzle-orm"

type RoomPageProps = {
	params: Promise<{ roomId: string }>
}

export default async function RoomPage({ params }: RoomPageProps) {
	const { roomId } = await params

	const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1)

	if (!room) {
		return <div className="h-screen flex items-center justify-center text-2xl font-bold">Room not found</div>
	}

	return (
		<main className="size-full flex-1 py-10">
			<div className="max-w-7xl mx-auto px-4">
				<RoomDetails room={room} />
			</div>
		</main>
	)
}
