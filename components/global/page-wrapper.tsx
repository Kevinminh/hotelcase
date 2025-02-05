import { cn } from "@/lib/utils"

export function PageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<main className={cn("size-full py-10 ", className)}>
			<div className="max-w-7xl mx-auto px-4">{children}</div>
		</main>
	)
}
