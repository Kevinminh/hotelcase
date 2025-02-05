import { getCurrentUser } from "@/server/actions/auth"
import { redirect } from "next/navigation"
import React from "react"

export default async function BookingsPage() {
	const { user } = await getCurrentUser()

	if (!user) {
		return redirect("/sign-in")
	}

	return <div>BookingsPage</div>
}
