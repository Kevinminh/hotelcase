import { RoomType } from "@/server/db/schemas/types"
import Image from "next/image"
import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { buttonVariants } from "../ui/button"
import { cn, getRoomCategoryName } from "@/lib/utils"
import Link from "next/link"

type RoomGridItemProps = {
	room: RoomType
}

export function RoomGridItem({ room }: RoomGridItemProps) {
	return (
		<Card className="justify-between flex flex-col">
			<CardHeader>
				<CardTitle>Room {room.number}</CardTitle>
				<CardDescription>{getRoomCategoryName(room.category)}</CardDescription>
			</CardHeader>
			<CardContent>
				<Image src={room.image} alt={room.number} width={500} height={500} className="rounded-md" />
			</CardContent>
			<CardFooter className="justify-between">
				<div className="text-sm font-semibold">
					{room.price}$ <span className="text-muted-foreground font-normal">per night</span>
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
			<Skeleton className="h-[200px] w-full" />
		</Card>
	)
}
