"use client"
import { RoomType } from "@/server/db/schemas/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { createBookingSchema, CreateBookingSchemaType } from "@/lib/schema"
import { Button } from "../ui/button"
import { useDateRangePicker } from "@/hooks/use-date-range-picker"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import React from "react"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

type RoomBookingFormProps = {
	room: Pick<
		RoomType,
		"id" | "price" | "number" | "category" | "guestCapacity" | "bedCount" | "bathroomCount" | "description"
	>
	userId: string | null
}

export function RoomBookingForm({ room, userId }: RoomBookingFormProps) {
	const pathName = usePathname()
	const router = useRouter()
	const { range, setRange } = useDateRangePicker()

	const currentPathWithParams = `${pathName}?dateRange=${range.from.toISOString()}|${range.to.toISOString()}`

	const form = useForm<CreateBookingSchemaType>({
		resolver: zodResolver(createBookingSchema),
		defaultValues: {
			roomId: room.id,
			customerId: userId,
			startDate: new Date(),
			endDate: addDays(new Date(), 1),
			price: Number(room.price),
		},
	})

	// Keep form in sync with URL state
	useEffect(() => {
		// Only update form if we have a complete range
		if (range.from.getTime() !== range.to.getTime()) {
			form.setValue("startDate", range.from, { shouldValidate: true })
			form.setValue("endDate", range.to, { shouldValidate: true })

			// Calculate and update total price
			const numberOfNights = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
			const roomTotal = numberOfNights * Number(room.price)
			const totalPrice = roomTotal + 70 // Add cleaning fee
			form.setValue("price", totalPrice, { shouldValidate: true })
		}
	}, [form, range.from, range.to, room.price])

	const { mutate: handleBook, isPending } = useMutation({
		mutationFn: async (data: CreateBookingSchemaType) => {
			const response = await fetch(`/api/room/${data.roomId}/book`, {
				method: "POST",
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error)
			}

			return response.json()
		},
		onSuccess: () => {
			toast.success("Room booked successfully")
			const initialStartDate = new Date()
			const initialEndDate = addDays(initialStartDate, 1)
			form.reset({
				roomId: room.id,
				customerId: userId,
				startDate: initialStartDate,
				endDate: initialEndDate,
				price: Number(room.price) * 2 + 70, // 2 days + cleaning fee
			})

			router.refresh()
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to book room")
			router.refresh()
		},
	})

	const onSubmit = React.useCallback(
		(data: CreateBookingSchemaType) => {
			handleBook(data)
		},
		[handleBook]
	)

	const handleLogin = async (type: "google") => {
		await signIn(type, {
			redirect: true,
			redirectTo: currentPathWithParams,
		})
	}

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
							render={({ field: startDateField }) => (
								<FormField
									control={form.control}
									name="endDate"
									render={({ field: endDateField }) => (
										<FormItem className="flex flex-col w-full">
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															id="date"
															variant={"outline"}
															className={cn(
																"w-full justify-start text-left font-normal",
																!startDateField.value && "text-muted-foreground"
															)}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{startDateField.value ? (
																endDateField.value ? (
																	<>
																		{format(startDateField.value, "LLL dd, y")} -{" "}
																		{format(endDateField.value, "LLL dd, y")}
																	</>
																) : (
																	format(startDateField.value, "LLL dd, y")
																)
															) : (
																<span>Pick a date range</span>
															)}
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														initialFocus
														mode="range"
														defaultMonth={startDateField.value}
														selected={{
															from: startDateField.value,
															to: endDateField.value,
														}}
														onSelect={(newDate) => {
															if (newDate?.from) {
																startDateField.onChange(newDate.from)
																setRange(newDate)
															}
															if (newDate?.to) {
																endDateField.onChange(newDate.to)
															}
														}}
														numberOfMonths={2}
														disabled={(date) => date < new Date()}
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						/>
						{!userId ? (
							<Button type="button" onClick={() => handleLogin("google")} className="w-full">
								Login to Book
							</Button>
						) : (
							<Button type="submit" className="w-full" disabled={isPending || form.formState.isSubmitting}>
								Book now
							</Button>
						)}

						<div className="flex items-center justify-between w-full">
							<span>
								{Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} nights × $
								{Number(room.price)}
							</span>
							<span>
								$
								{(Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1) *
									Number(room.price)}
							</span>
						</div>

						<div className="flex items-center justify-between w-full">
							<span>Cleaning fee</span>
							<span>$ 70</span>
						</div>

						<Separator />
					</CardContent>

					<CardFooter className="flex justify-between font-medium px-10">
						<span>Total sum</span>
						<div>
							${" "}
							{(Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1) *
								Number(room.price) +
								70}
						</div>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
