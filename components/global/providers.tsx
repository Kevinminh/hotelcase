"use client"

import { SessionProvider } from "next-auth/react"
import { PropsWithChildren } from "react"
import { NuqsProvider } from "./nuqs-provider"
import { QueryProvider } from "./query-provider"

export function Providers({ children }: PropsWithChildren) {
	return (
		<QueryProvider>
			<SessionProvider>
				<NuqsProvider>{children}</NuqsProvider>
			</SessionProvider>
		</QueryProvider>
	)
}
