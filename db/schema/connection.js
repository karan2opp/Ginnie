"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connections = void 0;
// src/db/schema/connections.ts
var pg_core_1 = require("drizzle-orm/pg-core");
var user_1 = require("./user");
exports.connections = (0, pg_core_1.pgTable)("connections", {
    id: (0, pg_core_1.text)("id").primaryKey().default("gen_random_uuid()"),
    userId: (0, pg_core_1.text)("user_id").notNull().references(function () { return user_1.users.id; }, { onDelete: "cascade" }),
    googleEmail: (0, pg_core_1.text)("google_email").notNull(), // which google account
    accessToken: (0, pg_core_1.text)("access_token").notNull(), // for Gmail + Calendar both
    refreshToken: (0, pg_core_1.text)("refresh_token").notNull(), // to refresh access token
    accessTokenExpiry: (0, pg_core_1.timestamp)("access_token_expiry").notNull(),
    gmailConnected: (0, pg_core_1.boolean)("gmail_connected").default(false),
    calendarConnected: (0, pg_core_1.boolean)("calendar_connected").default(false),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
