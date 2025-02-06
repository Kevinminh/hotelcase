import { RoomAuditLogType } from "@/server/db/schemas/types"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"

type RoomAuditLogProps = {
	roomAuditLogs: RoomAuditLogType[]
}

export function RoomAuditLog({ roomAuditLogs }: RoomAuditLogProps) {
	return (
		<div className="flex flex-col gap-y-2">
			<h2 className="text-lg font-semibold">Audit Logs (For managers)</h2>
			{roomAuditLogs.length ? (
				<ScrollArea className="max-h-80 flex-1">
					<div className="flex flex-col gap-y-2 h-full">
						{roomAuditLogs.map((log) => (
							<div
								key={log.id}
								className={cn("rounded-md border p-4 flex flex-col gap-y-2", {
									"bg-red-500/5 text-red-600": log.action === "Failed to book",
									"bg-green-500/5 text-green-600": log.action === "Book successfully",
									"bg-blue-500/5 text-blue-600": log.action === "Cancel booking",
									"bg-yellow-500/5 text-yellow-600": log.action === "Failed to cancel",
								})}
							>
								<span className="text-sm ">{log.description}</span>

								<div className="flex items-center gap-x-2">
									<span className="text-sm text-muted-foreground">{log.createdAt.toLocaleString()}</span>
									<Separator orientation="vertical" className="h-4" />
									<span className="text-sm font-medium text-muted-foreground">Action: {log.action}</span>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			) : (
				<div>No logs...</div>
			)}
		</div>
	)
}
