import { RoomAuditLogType, RoomType } from "@/server/db/schemas/types"
import { RoomBookingForm } from "./room-booking-form"
import { RoomGallery } from "./room-gallery"
import { RoomInfo } from "./room-info"

type RoomDetailsProps = {
	room: RoomType
	userId: string | null
	roomAuditLogs: RoomAuditLogType[]
}

export function RoomDetails({ room, userId, roomAuditLogs }: RoomDetailsProps) {
	return (
		<div>
			<RoomGallery room={room} />
			<div className="grid grid-cols-1 md:grid-cols-[55%_1fr] gap-x-28 py-8">
				<RoomInfo room={room} roomAuditLogs={roomAuditLogs} />
				<RoomBookingForm room={room} userId={userId} />
			</div>
		</div>
	)
}
