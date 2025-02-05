"use client"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"

import { useState } from "react"

export function SignOutButton() {
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleSignOut = () => {
		setIsLoading(true)
		signOut({})
	}

	return (
		<Button variant={"link"} onClick={handleSignOut} disabled={isLoading}>
			Sign out
		</Button>
	)
}
