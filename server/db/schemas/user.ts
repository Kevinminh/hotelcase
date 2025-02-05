import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const onboardingStatusEnum = pgEnum("onboarding_status", ["not_started", "in_progress", "completed"])

export const users = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	lastName: text("last_name"),
	email: text("email").unique().notNull(),
	emailVerified: timestamp("emailVerified").defaultNow(),
	image: text("image"),

	stripeCustomerId: text("stripe_customer_id").unique(),
	stripeSubscriptionId: text("stripe_subscription_id").unique(),
	stripePriceId: text("stripe_price_id"),
	stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").defaultNow(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})
