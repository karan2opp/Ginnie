// src/db/schema/connections.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./user";

export const connections = pgTable("connections", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    googleEmail: text("google_email").notNull(),   // which google account
    accessToken: text("access_token").notNull(),   // for Gmail + Calendar both
    refreshToken: text("refresh_token").notNull(),  // to refresh access token
    accessTokenExpiry: timestamp("access_token_expiry").notNull(),
    gmailConnected: boolean("gmail_connected").default(false),
    calendarConnected: boolean("calendar_connected").default(false),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Connection = typeof connections.$inferSelect;
export type NewConnection = typeof connections.$inferInsert;