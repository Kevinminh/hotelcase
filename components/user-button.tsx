import { getCurrentUser } from "@/server/actions/auth"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"
import { UserAvatar } from "./user-avatar"

export async function UserButton() {
	const { user } = await getCurrentUser()

	if (!user) {
		return (
			<Link href="/sign-in" className={cn(buttonVariants({ variant: "link" }))}>
				<span>Sign in</span>
			</Link>
		)
	}

	return (
		<Link href="/bookings" className={cn(buttonVariants({ variant: "link", className: "gap-x-4" }))}>
			<span>Bookings</span>
			<UserAvatar user={user} />
		</Link>
	)
}
