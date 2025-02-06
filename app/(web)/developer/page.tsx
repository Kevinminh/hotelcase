import { getCurrentUser } from "@/server/actions/auth"
import { hasPermission } from "@/server/actions/permission"
import { PERMISSIONS } from "@/server/db/seeding/roles"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { PageWrapper } from "@/components/global/page-wrapper"
import { CreateApiForm } from "@/components/developer/create-api-form"
import { Separator } from "@/components/ui/separator"

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

	return (
		<PageWrapper className="gap-y-4 flex flex-col mx-auto max-w-2xl">
			<div className="max-w-2xl ">
				<h1 className="text-2xl font-bold">My API keys</h1>
			</div>
			<Separator />
			<CreateApiForm />
		</PageWrapper>
	)
}
