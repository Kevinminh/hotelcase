import { getCurrentUser } from "@/server/actions/auth"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAvatar } from "@/components/global/user-avatar"
import { db } from "@/server/db/config"
import { eq } from "drizzle-orm"
import { users } from "@/server/db/schemas"
import { ActionTooltip } from "./action-tooltip"
import { SignOutButton } from "./sign-out-button"

export async function UserButton() {
	const { user } = await getCurrentUser()

	if (!user) {
		return (
			<Link href="/sign-in" className={cn(buttonVariants({ variant: "link" }))}>
				<span>Sign in</span>
			</Link>
		)
	}

	const userRole = await db.query.users.findFirst({
		where: eq(users.id, user.id),
		with: {
			role: true,
		},
	})

	return (
		<>
			<Link href="/manage-rooms" className={cn(buttonVariants({ variant: "link" }))}>
				<span>Manage rooms</span>
			</Link>
			<ActionTooltip label={`Role: ${userRole?.role?.name}`}>
				<Link href="/bookings" className={cn(buttonVariants({ variant: "link", className: "gap-x-4" }))}>
					<span>Bookings</span>
					<UserAvatar user={user} />
				</Link>
			</ActionTooltip>
			<SignOutButton />
		</>
	)
}
