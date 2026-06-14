import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const chatMessages = pgTable("chat_messages", {
    id: text("id").primaryKey(), // using crypto.randomUUID() for generation
    threadId: text("thread_id").notNull(),
    userId: text("user_id").notNull(),
    role: text("role").notNull(), // 'user' or 'agent'
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
