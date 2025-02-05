"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { signIn } from "next-auth/react"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const onClick = async (type: "google") => {
		setIsLoading(true)
		await signIn(type, {
			redirect: true,
			redirectTo: "/",
		})
		setIsLoading(false)
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>Login to your account to continue</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="m@example.com" disabled />
							</div>
							<Button type="submit" className="w-full" disabled>
								Login
							</Button>
							<Separator />

							<Button variant="outline" className="w-full" onClick={() => onClick("google")} disabled={isLoading}>
								Login with Google
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
