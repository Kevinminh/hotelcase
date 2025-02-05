"use client"
import { RoomType } from "@/server/db/schemas/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { DateRangePicker } from "../global/date-range-picker"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { createBookingSchema, CreateBookingSchemaType } from "@/lib/schema"
import { Button } from "../ui/button"
import { useDateRangePicker } from "@/hooks/use-date-range-picker"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type RoomBookingFormProps = {
	room: Pick<
		RoomType,
		"id" | "price" | "number" | "category" | "guestCapacity" | "bedCount" | "bathroomCount" | "description"
	>
	userId: string | null
}

export function RoomBookingForm({ room, userId }: RoomBookingFormProps) {
	const { range, setRange } = useDateRangePicker()

	const form = useForm<CreateBookingSchemaType>({
		resolver: zodResolver(createBookingSchema),
		defaultValues: {
			roomId: room.id,
			customerId: userId,
			startDate: range.from,
			endDate: range.to,
		},
	})

	// Keep form in sync with URL state
	useEffect(() => {
		form.setValue("startDate", range.from)
		form.setValue("endDate", range.to)
	}, [form, range])

	const { mutate: handleBook, isPending } = useMutation({
		mutationFn: (data: CreateBookingSchemaType) => {
			return fetch(`/api/room/${data.roomId}/book`, {
				method: "POST",
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			toast.success("Room booked successfully")
		},
		onError: () => {
			toast.error("Failed to book room")
		},
	})

	const onSubmit = (data: CreateBookingSchemaType) => {
		handleBook(data)
	}

	const totalPrice =
		Number(room.price) * Math.max(Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)), 1)

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-medium">
							$ {room.price} <span className="text-base text-muted-foreground">per night</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-y-4 items-center justify-center px-10">
						<FormField
							control={form.control}
							name="startDate"
							render={() => (
								<FormItem className="flex flex-col w-full">
									<FormControl>
										<DateRangePicker className="w-full" value={range} onChange={setRange} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isPending || form.formState.isSubmitting}>
							Book now
						</Button>
						<Separator />
					</CardContent>

					<CardFooter className="flex justify-between font-medium">
						<span>Total sum</span>
						<div>$ {totalPrice.toFixed(2)}</div>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
