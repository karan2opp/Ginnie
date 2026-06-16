import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const emails = pgTable("emails", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  subject: text("subject"),
  snippet: text("snippet"),
  from: text("from"),
  date: timestamp("date"),
  priority: text("priority").default("normal"), // "urgent" | "primary" | "normal"
  category: text("category").default("primary"),
  manualPriority: boolean("manual_priority").default(false),
});
