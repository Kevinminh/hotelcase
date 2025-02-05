"use client"
import { format } from "date-fns"
import { ScrollArea } from "../ui/scroll-area"
import { BookingWithRoomType } from "@/types/types"
import { getRoomCategoryName } from "@/lib/utils"
import { Button } from "../ui/button"
import { EllipsisIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
type BookingListProps = {
	bookings: BookingWithRoomType[]
	userId: string
}

export function BookingList({ bookings, userId }: BookingListProps) {
	const router = useRouter()

	const { mutate: cancelBooking, isPending } = useMutation({
		mutationFn: async (bookingId: string) => {
			const response = await fetch(`/api/room/${bookingId}/book`, {
				method: "DELETE",
				body: JSON.stringify({ bookingId, customerId: userId }),
			})

			if (!response.ok) {
				throw new Error("Failed to cancel booking")
			}

			return response.json()
		},
		onSuccess: () => {
			toast.success("Booking cancelled successfully")
			router.refresh()
		},
		onError: () => {
			toast.error("Failed to cancel booking")
		},
	})

	return (
		<div className="flex flex-col gap-y-2">
			<h1 className="text-2xl font-bold">My bookings</h1>
			{bookings ? (
				<ScrollArea className="h-80">
					<table className="w-full">
						<thead>
							<tr className="bg-muted text-left">
								<th className="py-2 px-4 font-medium">Room Number</th>
								<th className="py-2 px-4 font-medium">Category</th>
								<th className="py-2 px-4 font-medium">ID</th>
								<th className="py-2 px-4 font-medium">Start Date</th>
								<th className="py-2 px-4 font-medium">End Date</th>
								<th className="py-2 px-4 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{bookings.map((booking) => (
								<tr key={booking.id} className="hover:bg-muted/50 transition-colors">
									<td className="py-4 px-4">Room: {booking.room?.number}</td>
									<td className="py-4 px-4">{getRoomCategoryName(booking.room?.category ?? "double_bed")}</td>
									<td className="py-4 px-4 truncate">{booking.roomId}</td>
									<td className="py-4 px-4">{format(new Date(booking.startDate), "yyyy-MM-dd")}</td>
									<td className="py-4 px-4">{format(new Date(booking.endDate), "yyyy-MM-dd")}</td>
									<td className="py-4 px-4">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="icon" variant="ghost">
													<EllipsisIcon className="w-4 h-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													className="text-red-500 focus:text-red-500 cursor-pointer"
													onClick={() => cancelBooking(booking.id)}
													disabled={isPending}
												>
													Cancel reservation
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</ScrollArea>
			) : (
				<div>No bookings...</div>
			)}
		</div>
	)
}
