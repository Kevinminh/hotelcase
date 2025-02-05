"use client"

import { SessionProvider } from "next-auth/react"
import { PropsWithChildren } from "react"
import { NuqsProvider } from "./nuqs-provider"
import { QueryProvider } from "./query-provider"
import { Toaster } from "sonner"

export function Providers({ children }: PropsWithChildren) {
	return (
		<QueryProvider>
			<SessionProvider>
				<Toaster />
				<NuqsProvider>{children}</NuqsProvider>
			</SessionProvider>
		</QueryProvider>
	)
}
