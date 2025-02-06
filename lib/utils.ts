import { RoomCategoryType } from "@/types/types"
import { clsx, type ClassValue } from "clsx"
import { createHash } from "crypto"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"
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

/**
 * Decrypt an API key
 * @param encryptedKey - The encrypted API key starting with 'hc_'
 * @returns The decrypted API key or null if invalid
 */
export function decryptApiKey(encryptedKey: string, encryptionKey: string): string | null {
	try {
		// Remove the 'hc_' prefix
		if (!encryptedKey.startsWith("hc_")) {
			return null
		}
		const keyWithoutPrefix = encryptedKey.slice(3)

		// Extract IV (first 32 characters / 16 bytes in hex)
		const iv = Buffer.from(keyWithoutPrefix.slice(0, 32), "hex")

		// Get the encrypted data (everything after IV)
		const encryptedData = keyWithoutPrefix.slice(32)

		// Create decipher
		const decipher = createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv)

		// Decrypt
		let decrypted = decipher.update(encryptedData, "hex", "utf8")
		decrypted += decipher.final("utf8")

		return decrypted
	} catch (error) {
		console.error("Error decrypting API key:", error)
		return null
	}
}

/**
 * Generate a secure API key
 * @returns The generated API key
 */
export function generateApiKey(encryptionKey: string): string {
	// Generate a random IV
	const iv = randomBytes(16)

	// Generate the raw key
	const rawKey = randomBytes(32).toString("hex")

	// Create cipher with key and IV
	const cipher = createCipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv)

	// Encrypt the key
	let encryptedKey = cipher.update(rawKey, "utf8", "hex")
	encryptedKey += cipher.final("hex")

	// Combine IV and encrypted key with prefix
	return `hc_${iv.toString("hex")}${encryptedKey}`
}

/**
 * Hash the API key for storage
 * @param key - The API key to hash
 * @returns The hashed API key
 */
export function hashApiKey(key: string): string {
	return createHash("sha256").update(key).digest("hex")
}
