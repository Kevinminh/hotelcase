ALTER TABLE "user_audit_logs" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "user_audit_logs" ADD COLUMN "changes" jsonb;