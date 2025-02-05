import { PageWrapper } from "@/components/global/page-wrapper"
import { getCurrentUser } from "@/server/actions/auth"
import { hasPermission } from "@/server/actions/permission"
import { db } from "@/server/db/config"
import { bookings } from "@/server/db/schemas"
import { PERMISSIONS } from "@/server/db/seeding/roles"
import { redirect } from "next/navigation"
import React from "react"

export default async function ManageRoomsPage() {
	const { user } = await getCurrentUser()

	if (!user) {
		redirect("/sign-in")
	}

	const permission = await hasPermission(PERMISSIONS.EDIT_HOTEL)

	if (!permission) {
		return <PageWrapper>You do not have permission to manage rooms</PageWrapper>
	}

	const allBookings = await db.select().from(bookings)

	const totalRevenue = allBookings.reduce((acc, booking) => acc + Number(booking.price), 0)

	return (
		<PageWrapper>
			<div>
				You have permission to view this page
				<span className="font-bold"> {PERMISSIONS.VIEW_HOTEL}</span>
			</div>
			<div>
				You have permission to manage rooms: <span className="font-bold">{PERMISSIONS.EDIT_HOTEL}</span>
			</div>
			<div className="text-3xl text-green-500 mt-2">
				Total revenue: <span className="font-bold">$ {totalRevenue}</span>
			</div>
		</PageWrapper>
	)
}
