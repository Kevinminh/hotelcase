import { UserAuditLogType } from "@/server/db/schemas/types"
import { ScrollArea } from "../ui/scroll-area"
import { format } from "date-fns"
import { ActionTooltip } from "../global/action-tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

type UserAuditLogProps = {
	userAuditLogs: UserAuditLogType[]
}

export function UserAuditLog({ userAuditLogs }: UserAuditLogProps) {
	return (
		<Card className="flex flex-col gap-y-2">
			<CardHeader>
				<CardTitle>My audit logs</CardTitle>
			</CardHeader>
			<CardContent>
				{userAuditLogs.length ? (
					<ScrollArea className="h-80">
						<div className="flex flex-col  divide-y h-full">
							{userAuditLogs.map((log) => (
								<div key={log.id} className="py-4 px-4 hover:bg-muted/50 transition-colors grid grid-cols-4 gap-x-4">
									<h2>Action: {log.action}</h2>
									<ActionTooltip label={log.description ?? "No description"}>
										<span className="truncate">{log.description}</span>
									</ActionTooltip>
									<ActionTooltip label={log.id}>
										<span className="truncate">{log.id}</span>
									</ActionTooltip>
									<span>{format(new Date(log.createdAt), "yyyy-MM-dd")}</span>
								</div>
							))}
						</div>
					</ScrollArea>
				) : (
					<div>No logs...</div>
				)}
			</CardContent>
		</Card>
	)
}
