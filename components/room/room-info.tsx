import { getRoomCategoryName } from "@/lib/utils"
import { RoomAuditLogType, RoomType } from "@/server/db/schemas/types"
import { Separator } from "../ui/separator"
import { RoomAuditLog } from "./room-audit-log"

type RoomInfoProps = {
	room: Pick<RoomType, "id" | "number" | "category" | "guestCapacity" | "bedCount" | "bathroomCount" | "description">
	roomAuditLogs: RoomAuditLogType[]
	canViewAuditLog: boolean
}

export function RoomInfo({ room, roomAuditLogs, canViewAuditLog }: RoomInfoProps) {
	return (
		<div className="flex flex-col gap-y-4">
			<div>
				<h1 className="text-3xl font-semibold">Room {room.number}</h1>
				<ul className="flex text-lg items-center gap-x-4 [&>li:not(:first-child)]:list-disc ml-4">
					<li className="-ml-4">
						<p>{getRoomCategoryName(room.category)}</p>
					</li>
					<li>
						<p>{room.guestCapacity} guests</p>
					</li>
					<li>
						<p>{room.bedCount} beds</p>
					</li>
					<li>
						<p>{room.bathroomCount} bathrooms</p>
					</li>
				</ul>

				<div className="rounded-md border p-4 mt-4">{room.description}</div>
			</div>

			<Separator />

			{canViewAuditLog && <RoomAuditLog roomAuditLogs={roomAuditLogs} />}
		</div>
	)
}
