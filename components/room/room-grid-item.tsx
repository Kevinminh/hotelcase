import { RoomType } from "@/server/db/schemas/types"
import Image from "next/image"
import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardFooter } from "../ui/card"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

type RoomGridItemProps = {
	room: RoomType
}

export function RoomGridItem({ room }: RoomGridItemProps) {
	return (
		<Card className="justify-between flex flex-col">
			<CardContent className="pt-5 space-y-4">
				<Image src={room.image} alt={room.number} width={500} height={500} className="rounded-md h-56 object-cover" />
				<div className="grid">
					<h5 className="font-semibold">Room {room.number}</h5>
					<span className="text-muted-foreground text-sm">{room.description}</span>
				</div>
			</CardContent>
			<CardFooter className="justify-between">
				<div className="font-semibold">
					$ {room.price} <span className="text-muted-foreground font-normal text-sm">per night</span>
				</div>

				<Link className={cn(buttonVariants({ variant: "default" }))} href={`/rooms/${room.id}`}>
					Book Now
				</Link>
			</CardFooter>
		</Card>
	)
}

export function RoomGridItemSkeleton() {
	return (
		<Card>
			<Skeleton className="h-72 w-full" />
		</Card>
	)
}
