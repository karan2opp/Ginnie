import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./user";

export const orders = pgTable("orders", {
    id: text("id").primaryKey(), // We will use razorpay_order_id as primary key
    userId: text("user_id").notNull().references(() => users.id),
    amount: integer("amount").notNull(), // in paise
    currency: text("currency").notNull().default("INR"),
    status: text("status").notNull().default("pending"), // pending, paid, failed
    plan: text("plan", { enum: ['pro', 'elite'] }).notNull(),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
