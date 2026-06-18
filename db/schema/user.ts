// src/db/schema/users.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    plan: text("plan", { enum: ['free', 'pro', 'elite'] }).default('free').notNull(),
    planExpiresAt: timestamp("plan_expires_at"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;