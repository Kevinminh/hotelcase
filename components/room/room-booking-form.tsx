import { RoomType } from "@/server/db/schemas/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

type RoomBookingFormProps = {
	room: Pick<
		RoomType,
		"id" | "price" | "number" | "category" | "guestCapacity" | "bedCount" | "bathroomCount" | "description"
	>
}

export function RoomBookingForm({ room }: RoomBookingFormProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-medium">
					$ {room.price} <span className="text-base text-muted-foreground">per night</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Separator />
			</CardContent>

			<CardFooter className="flex justify-between">
				<span>Total sum</span>

				<div>$ {room.price}</div>
			</CardFooter>
		</Card>
	)
}
