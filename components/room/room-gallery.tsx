import { RoomType } from "@/server/db/schemas/types"
import Image from "next/image"

type RoomGalleryProps = {
	room: Pick<RoomType, "id" | "image">
}

export function RoomGallery({ room }: RoomGalleryProps) {
	return (
		<div>
			<Image
				src={room.image}
				alt={"Room image"}
				width={1920}
				height={270}
				className="rounded-md w-full h-[32rem] object-cover"
			/>
		</div>
	)
}
