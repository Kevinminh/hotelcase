import { cn } from "@/lib/utils"

export function PageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<main className={cn("size-full py-10 ")}>
			<div className={cn("max-w-7xl mx-auto px-4", className)}>{children}</div>
		</main>
	)
}
