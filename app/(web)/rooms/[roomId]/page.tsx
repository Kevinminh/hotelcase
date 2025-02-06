import { PageWrapper } from "@/components/global/page-wrapper"
import { RoomDetails } from "@/components/room/room-details"
import { getRoomCategoryName } from "@/lib/utils"
import { getCurrentUser } from "@/server/actions/auth"
import { hasPermission } from "@/server/actions/permission"
import { db } from "@/server/db/config"
import { bookings, roomAuditLogs, rooms } from "@/server/db/schemas"
import { PERMISSIONS } from "@/server/db/seeding/roles"
import { desc, eq } from "drizzle-orm"

type RoomPageProps = {
	params: Promise<{ roomId: string }>
}

export async function generateMetadata({ params }: RoomPageProps) {
	const { roomId } = await params

	const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1)

	if (!room) {
		return {
			title: "Room not found",
			description: "The room you are looking for does not exist.",
		}
	}

	return {
		title: `${room.number} - ${getRoomCategoryName(room.category)}`,
		description: room.description,
		openGraph: {
			images: [room.image],
		},
	}
}

export default async function RoomPage({ params }: RoomPageProps) {
	const { roomId } = await params

	const { user } = await getCurrentUser()

	const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1)

	if (!room) {
		return <div className="h-screen flex items-center justify-center text-2xl font-bold">Room not found</div>
	}

	const [dbRoomAuditLogs, roomBookings, canViewAuditLog] = await Promise.all([
		db
			.select()
			.from(roomAuditLogs)
			.where(eq(roomAuditLogs.roomId, roomId))
			.orderBy(desc(roomAuditLogs.createdAt))
			.limit(100),
		db.select().from(bookings).where(eq(bookings.roomId, roomId)),
		hasPermission(PERMISSIONS.VIEW_AUDIT_LOG),
	])

	return (
		<PageWrapper>
			<RoomDetails
				room={room}
				userId={user?.id ?? null}
				roomAuditLogs={dbRoomAuditLogs}
				roomBookings={roomBookings}
				canViewAuditLog={canViewAuditLog}
			/>
		</PageWrapper>
	)
}
