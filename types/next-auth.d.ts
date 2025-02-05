import { UserType } from "@/server/db/config/database"

declare module "next-auth" {
	interface Session {
		user: UserType
	}
}
