ALTER TABLE "room_audit_logs" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "room_audit_logs" ADD COLUMN "changes" jsonb;