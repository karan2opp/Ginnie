"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsair = void 0;
var corsair_1 = require("corsair");
var gmail_1 = require("@corsair-dev/gmail");
var googlecalendar_1 = require("@corsair-dev/googlecalendar");
var index_1 = require("./db/index");
exports.corsair = (0, corsair_1.createCorsair)({
    plugins: [(0, gmail_1.gmail)(), (0, googlecalendar_1.googlecalendar)()],
    database: index_1.pool,
    kek: process.env.CORSAIR_KEK,
    multiTenancy: true,
});
// When multiTenancy is true, you must use .withTenant(tenantId) to access plugins!
// For example:
// corsair.withTenant('user_123').gmail
console.log(exports.corsair.withTenant('dev').gmail.api.messages.list({}));
