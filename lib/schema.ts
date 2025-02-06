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
	expiresIn: z.string().regex(/^\d+$/, "Must be a number").optional(),
})

export const externalCreateBookingSchema = z.object({
	roomId: z.string(),
	customerId: z.string().nullable(),
	startDate: z.date(),
	endDate: z.date(),
	price: z.number(),
	apiKey: z.string().min(32).max(200),
})

export const deleteRoomSchema = z.object({
	roomId: z.string(),
})
