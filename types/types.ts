export const RoleTypes = {
	OWNER: "owner",
	MANAGER: "manager",
	USER: "user",
} as const

export type RoleTypesType = (typeof RoleTypes)[keyof typeof RoleTypes]
