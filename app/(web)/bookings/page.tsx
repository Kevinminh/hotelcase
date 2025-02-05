import { PageWrapper } from "@/components/global/page-wrapper"
import { getCurrentUser } from "@/server/actions/auth"
import { db } from "@/server/db/config"
import { eq } from "drizzle-orm"
import { bookings, userAuditLogs } from "@/server/db/schemas"
import { redirect } from "next/navigation"
import React from "react"
import { UserAuditLog } from "@/components/bookings/user-audit-log"
import { BookingList } from "@/components/bookings/booking-list"

export default async function BookingsPage() {
	const { user } = await getCurrentUser()

	if (!user) {
		return redirect("/sign-in")
	}

	const [dbBookings, dbUserAuditLogs] = await Promise.all([
		db.query.bookings.findMany({
			where: eq(bookings.customerId, user.id),
			with: {
				room: true,
			},
		}),
		db.query.userAuditLogs.findMany({
			where: eq(userAuditLogs.userId, user.id),
		}),
	])

	return (
		<PageWrapper>
			<div className="flex flex-col gap-y-4">
				<BookingList bookings={dbBookings} userId={user.id} />

				<UserAuditLog userAuditLogs={dbUserAuditLogs} />
			</div>
		</PageWrapper>
	)
}
