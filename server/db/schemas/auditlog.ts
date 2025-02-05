import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const auditlogs = pgTable("auditlogs", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	action: text("action").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})
