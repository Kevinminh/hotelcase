import { RoomCategoryType } from "@/types/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Get the name of the room category
 * @param category - The category of the room
 * @returns The name of the room category
 */
export const getRoomCategoryName = (category: RoomCategoryType) => {
	switch (category) {
		case "single_bed":
			return "Single Bed"
		case "double_bed":
			return "Double Bed"

		default:
			return "Unknown"
	}
}
