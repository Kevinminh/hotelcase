import { RoomType } from "@/server/db/schemas/types"
import { RoomBookingForm } from "./room-booking-form"
import { RoomGallery } from "./room-gallery"
import { RoomInfo } from "./room-info"

type RoomDetailsProps = {
	room: RoomType
}

export function RoomDetails({ room }: RoomDetailsProps) {
	return (
		<div>
			<RoomGallery room={room} />
			<div className="grid grid-cols-1 md:grid-cols-[55%_1fr] gap-x-10 py-8">
				<RoomInfo room={room} />
				<RoomBookingForm room={room} />
			</div>
		</div>
	)
}
