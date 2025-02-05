import { PageWrapper } from "@/components/global/page-wrapper"
import { RoomDetails } from "@/components/room/room-details"
import { getCurrentUser } from "@/server/actions/auth"
import { db } from "@/server/db/config"
import { roomAuditLogs, rooms } from "@/server/db/schemas"
import { desc, eq } from "drizzle-orm"

type RoomPageProps = {
	params: Promise<{ roomId: string }>
}

export default async function RoomPage({ params }: RoomPageProps) {
	const { roomId } = await params

	const { user } = await getCurrentUser()

	const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1)

	if (!room) {
		return <div className="h-screen flex items-center justify-center text-2xl font-bold">Room not found</div>
	}

	const dbRoomAuditLogs = await db
		.select()
		.from(roomAuditLogs)
		.where(eq(roomAuditLogs.roomId, roomId))
		.orderBy(desc(roomAuditLogs.createdAt))

	return (
		<PageWrapper>
			<RoomDetails room={room} userId={user?.id ?? null} roomAuditLogs={dbRoomAuditLogs} />
		</PageWrapper>
	)
}
