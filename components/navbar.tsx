import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { getCurrentUser } from "@/server/actions/auth"

export default async function Navbar() {
	const { user } = await getCurrentUser()

	return (
		<header className="w-full py-4">
			<div className="max-w-7xl mx-auto flex items-center justify-between px-4">
				<Link href="/" className="text- font-bold">
					<span>HotelCase</span>
				</Link>

				<nav>
					<ul className="flex items-center gap-x-2">
						<li>
							<Link href="/" className={cn(buttonVariants({ variant: "link" }))}>
								<span>Home</span>
							</Link>
						</li>
						<li>
							<Link href="/rooms" className={cn(buttonVariants({ variant: "link" }))}>
								<span>Rooms</span>
							</Link>
						</li>
						<li>
							<Link href={user ? "/bookings" : "/sign-in"} className={cn(buttonVariants({ variant: "link" }))}>
								<span>{user ? "My bookings" : "Sign in"}</span>
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}
