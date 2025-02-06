import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

import { UserButton } from "@/components/global/user-button"

export default function Navbar() {
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

						<UserButton />
					</ul>
				</nav>
			</div>
		</header>
	)
}
