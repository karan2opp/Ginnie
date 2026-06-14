"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsairEvents = exports.corsairEntities = exports.corsairAccounts = exports.corsairIntegrations = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.corsairIntegrations = (0, pg_core_1.pgTable)('corsair_integrations', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
    name: (0, pg_core_1.text)('name').notNull(),
    config: (0, pg_core_1.jsonb)('config').notNull().default({}),
    dek: (0, pg_core_1.text)('dek'),
});
exports.corsairAccounts = (0, pg_core_1.pgTable)('corsair_accounts', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
    tenantId: (0, pg_core_1.text)('tenant_id').notNull(),
    integrationId: (0, pg_core_1.text)('integration_id').notNull().references(function () { return exports.corsairIntegrations.id; }),
    config: (0, pg_core_1.jsonb)('config').notNull().default({}),
    dek: (0, pg_core_1.text)('dek'),
});
exports.corsairEntities = (0, pg_core_1.pgTable)('corsair_entities', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
    accountId: (0, pg_core_1.text)('account_id').notNull().references(function () { return exports.corsairAccounts.id; }),
    entityId: (0, pg_core_1.text)('entity_id').notNull(),
    entityType: (0, pg_core_1.text)('entity_type').notNull(),
    version: (0, pg_core_1.text)('version').notNull(),
    data: (0, pg_core_1.jsonb)('data').notNull().default({}),
});
exports.corsairEvents = (0, pg_core_1.pgTable)('corsair_events', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
    accountId: (0, pg_core_1.text)('account_id').notNull().references(function () { return exports.corsairAccounts.id; }),
    eventType: (0, pg_core_1.text)('event_type').notNull(),
    payload: (0, pg_core_1.jsonb)('payload').notNull().default({}),
    status: (0, pg_core_1.text)('status'),
});
__exportStar(require("./user"), exports);
__exportStar(require("./calendar"), exports);
__exportStar(require("./connection"), exports);
__exportStar(require("./corsair"), exports);
