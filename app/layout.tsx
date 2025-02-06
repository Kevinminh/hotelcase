import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/global/navbar"
import { Providers } from "@/components/global/providers"
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Hotel Case",
	description: "Hotel Case",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					async
					data-website-id="-9TB9tXVJlGc2b3ECGo_Y353"
					data-domain="hotelcase.vercel.app"
					src="https://datah.co/js/script.js"
				></script>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					<Navbar />
					{children}
					<Toaster richColors />
				</Providers>
			</body>
		</html>
	)
}
