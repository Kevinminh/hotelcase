"use client"

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { PropsWithChildren } from "react"
import { NuqsProvider } from "./nuqs-provider"

export function Providers({ children }: PropsWithChildren) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<SessionProvider>
				<NuqsProvider>{children}</NuqsProvider>
			</SessionProvider>
		</ThemeProvider>
	)
}
