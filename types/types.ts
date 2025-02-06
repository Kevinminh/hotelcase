import { BookingType, RoomType } from "@/server/db/schemas/types"

export const RoleTypes = {
	OWNER: "owner",
	MANAGER: "manager",
	USER: "user",
} as const

export type RoleTypesType = (typeof RoleTypes)[keyof typeof RoleTypes]

export const RoomCategory = {
	SINGLE_BED: "single_bed",
	DOUBLE_BED: "double_bed",
} as const

export type RoomCategoryType = (typeof RoomCategory)[keyof typeof RoomCategory]

export type BookingWithRoomType = BookingType & {
	room: RoomType | null
}

export type sendReceiptType = {
	email: string
	purchaseId: string
	amount: number
	productName: string
	desc: string
	purchaseDate: Date
	last4: string
	brand: string
	paymentType: string
	licenseUrl: string
}

export type RoomAuditLogActionType =
	| "Failed to book"
	| "Failed to cancel"
	| "Failed to create"
	| "Failed to update"
	| "Failed to delete"
	| "Book successfully"
	| "Cancel successfully"
	| "Cancel booking"
	| "Create successfully"
	| "Update successfully"
	| "Delete successfully"
