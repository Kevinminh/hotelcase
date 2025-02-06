import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { users } from "./user"
import { relations } from "drizzle-orm"

export const apiKeys = pgTable("api_keys", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: varchar("name", { length: 50 }).notNull(),
	key: text("key").notNull().unique(),
	userId: text("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	expiresAt: timestamp("expires_at"),
	lastUsed: timestamp("last_used"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at"),
})

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
	user: one(users, {
		fields: [apiKeys.userId],
		references: [users.id],
	}),
}))
