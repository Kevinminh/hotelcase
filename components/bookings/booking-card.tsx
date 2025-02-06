import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { format } from "date-fns"
import Image from "next/image"
import { BookingWithRoomType } from "@/types/types"

export function BookingCard({ booking }: { booking: BookingWithRoomType }) {
	if (!booking) {
		return null
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your next trip</CardTitle>
				<CardDescription>
					{booking.room?.number} - {format(booking.startDate, "MMM d, yyyy")} to{" "}
					{format(booking.endDate, "MMM d, yyyy")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Image
					src={booking.room?.image ?? ""}
					alt={`Room ${booking.roomId}`}
					width={900}
					height={600}
					className="rounded-md h-64 object-cover"
				/>
			</CardContent>
		</Card>
	)
}
