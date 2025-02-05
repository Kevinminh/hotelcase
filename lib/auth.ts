import { ReactElement } from "react"
import { db } from "@/server/db/config"
import { accounts, users, verificationTokens } from "@/server/db/schemas"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

import { resend } from "@/lib/resend"
import { MagicLinkMail } from "@/components/magic-link"

export const { auth, handlers, signIn } = NextAuth({
	adapter: DrizzleAdapter(db, {
		accountsTable: accounts,
		usersTable: users,
		verificationTokensTable: verificationTokens,
	}),
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		error: "/error",
	},
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),

		Resend({
			from: process.env.RESEND_EMAIL,
			sendVerificationRequest: async ({ identifier, url }) => {
				const [user] = await db.select().from(users).where(eq(users.email, identifier)).limit(1)

				const email = process.env.RESEND_EMAIL as string
				const isUserVerified = user?.emailVerified

				// TODO
				if (isUserVerified) {
					const result = await resend.emails.send({
						from: email,
						to: identifier,
						subject: `Magic Login Link from Hotelcase!`,
						react: MagicLinkMail({
							email: identifier,
							magicLinkMail: url,
						}) as ReactElement,
					})

					if (result.error) {
						throw new Error(result.error?.message)
					}
				}
				// TODO
				const result = await resend.emails.send({
					from: email,
					to: identifier,
					subject: `Magic Login Link from Hotelcase!`,
					react: MagicLinkMail({
						email: identifier,
						magicLinkMail: url,
					}) as ReactElement,
				})

				if (result.error) {
					throw new Error(result.error?.message)
				}
			},
		}),
	],
})
