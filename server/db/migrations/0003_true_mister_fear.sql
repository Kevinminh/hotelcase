ALTER TABLE "rooms" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "guest_capacity" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "bed_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "bathroom_count" integer NOT NULL;