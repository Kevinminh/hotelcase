import { z } from "zod"

export const createBookingSchema = z.object({
	roomId: z.string(),
	customerId: z.string().nullable(),
	startDate: z.date(),
	endDate: z.date(),
})

export type CreateBookingSchemaType = z.infer<typeof createBookingSchema>
