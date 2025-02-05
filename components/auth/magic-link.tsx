import { Body, Container, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components"

type MagicLinkMailProps = {
	email: string
	magicLinkMail: string
}

export function MagicLinkMail({ email, magicLinkMail }: MagicLinkMailProps) {
	return (
		<Html>
			<Head />
			<Preview>Hotelcase magic login link</Preview>
			<Tailwind>
				<Body className="m-auto bg-white font-sans">
					<Container className="w–[465px] mx-auto my-[40px] p-[20px]">
						<Heading className="mx-0 my-[30px] p-0 text-left text-[24px] font-normal text-black">
							<strong>🪄 Your magic link</strong>
						</Heading>
						<Text className="text-[14px] leading-[24px]">
							<Link href={magicLinkMail} className="h-9 rounded-md bg-black px-4 py-2 text-white">
								👉 Click here to sign in 👈
							</Link>
						</Text>
						<Text className="text-[14px] leading-[24px]">Or, copy and paste this temporary login link:</Text>
						<Section className="rounded-md border-border bg-[#d2d2d2] px-6 py-4">
							<Text className="text-[14px]">{magicLinkMail}</Text>
						</Section>

						<Text className="text-[14px] leading-[24px] text-muted">
							This mail is for {email}. If you din&apos;t try to login, you can safely ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
