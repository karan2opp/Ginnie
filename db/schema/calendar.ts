import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const calendarEvents = pgTable("calendar_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  meetLink: text("meet_link"),
  isUrgent: boolean("is_urgent").default(false),
  emailSent: boolean("email_sent").default(false),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;
