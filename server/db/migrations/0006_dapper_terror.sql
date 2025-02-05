ALTER TABLE "booking_audit_logs" DROP CONSTRAINT "booking_audit_logs_booking_id_bookings_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_audit_logs" ADD CONSTRAINT "booking_audit_logs_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
