import { RoomAuditLogType } from "@/server/db/schemas/types"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"

type RoomAuditLogProps = {
	roomAuditLogs: RoomAuditLogType[]
}

export function RoomAuditLog({ roomAuditLogs }: RoomAuditLogProps) {
	return (
		<div className="flex flex-col gap-y-2">
			<h2 className="text-lg font-semibold">Audit Logs</h2>
			{roomAuditLogs.length ? (
				<ScrollArea className="max-h-80 flex-1">
					<div className="flex flex-col gap-y-2 h-full">
						{roomAuditLogs.map((log) => (
							<div key={log.id} className="rounded-md border p-4 flex flex-col gap-y-2">
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
