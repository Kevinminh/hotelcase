import { getCurrentUser } from "@/server/actions/auth"
import { hasPermission } from "@/server/actions/permission"
import { PERMISSIONS } from "@/server/db/seeding/roles"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { PageWrapper } from "@/components/global/page-wrapper"
import { CreateApiForm } from "@/components/developer/create-api-form"
import { Separator } from "@/components/ui/separator"
import { eq } from "drizzle-orm"
import { db } from "@/server/db/config"
import { apiKeys } from "@/server/db/schemas"
import { CopyButton } from "@/components/global/copy-button"

export const metadata: Metadata = {
	title: "Developer",
	description: "Developer tools",
}

export default async function DeveloperPage() {
	const { user } = await getCurrentUser()

	if (!user) {
		return redirect("/sign-in")
	}

	const permission = await hasPermission(PERMISSIONS.VIEW_DEVELOPER)

	if (!permission) {
		return <PageWrapper>You do not have permission to view this page</PageWrapper>
	}

	const userApiKeys = await db.select().from(apiKeys).where(eq(apiKeys.userId, user.id))

	return (
		<PageWrapper className="gap-y-4 flex flex-col mx-auto max-w-2xl">
			<div className="max-w-2xl space-y-2">
				<h1 className="text-2xl font-bold">My API keys (HASHED VERSION)</h1>

				{userApiKeys.length ? (
					<div className="flex flex-col gap-y-2">
						{userApiKeys.map((key) => (
							<div className=" flex items-center gap-x-2" key={key.id}>
								<CopyButton text={key.key} />
								<span className="text-xs text-muted-foreground truncate max-w-[40ch]">{key.key}</span>
							</div>
						))}
					</div>
				) : null}
			</div>
			<Separator />
			<CreateApiForm />
		</PageWrapper>
	)
}
