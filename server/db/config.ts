import * as schema from "@/server/db/schemas"
import { neon, Pool } from "@neondatabase/serverless"
import { config } from "dotenv"
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http"
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless"

config({ path: ".env.local" }) // or .env.local

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzleHttp(sql, { schema })

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
export const dbClient = drizzleServerless(pool)
