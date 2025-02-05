import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "./ui/button"

import { UserButton } from "./user-button"

export default async function Navbar() {
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
							<UserButton />
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}
