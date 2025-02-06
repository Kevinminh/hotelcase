import { z } from "zod"

export const createBookingSchema = z.object({
	roomId: z.string(),
	customerId: z.string().nullable(),
	startDate: z.date(),
	endDate: z.date(),
	price: z.number(),
})

export type CreateBookingSchemaType = z.infer<typeof createBookingSchema>

export const cancelBookingSchema = z.object({
	bookingId: z.string(),
	customerId: z.string(),
})

export type CancelBookingSchemaType = z.infer<typeof cancelBookingSchema>

export const createApiSchema = z.object({
	name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
	expiresIn: z.string().regex(/^\d+$/, "Must be a number").optional(),
})
