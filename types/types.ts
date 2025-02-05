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
