"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { createApiSchema } from "@/lib/schema"
import { useRouter } from "next/navigation"

type CreateApiSchemaType = z.infer<typeof createApiSchema>

export function CreateApiForm() {
	const router = useRouter()

	const form = useForm<CreateApiSchemaType>({
		resolver: zodResolver(createApiSchema),
		defaultValues: {
			expiresIn: "30",
		},
	})

	const { mutate: createApiKey, isPending } = useMutation({
		mutationFn: async (data: CreateApiSchemaType) => {
			const response = await fetch("/api/developer/api-key", {
				method: "POST",
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error)
			}

			return response.json()
		},
		onSuccess: (data) => {
			router.refresh()
			toast.success("API key created", {
				description: `Your API key: ${data.key}. Make sure to copy it now, you won't be able to see it again.`,
			})
			form.reset()
		},
		onError: (error: Error) => {
			router.refresh()
			toast.error(error.message || "Failed to create API key")
		},
	})

	function onSubmit(data: CreateApiSchemaType) {
		createApiKey(data)
	}

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Create API Key</CardTitle>
				<CardDescription>
					Create a new API key to access the HotelCase API. The key will be shown only once after creation.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="expiresIn"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expires In (Days)</FormLabel>
									<FormControl>
										<Input type="number" min="1" max="365" placeholder="30" {...field} />
									</FormControl>
									<FormDescription>
										Number of days until this key expires. Leave empty for no expiration.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={isPending}>
							Create API Key
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
