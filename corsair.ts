import "dotenv/config";
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { pool } from './db/index';

export const corsair = createCorsair({
    plugins: [gmail(), googlecalendar()],
    database: pool,
    kek: process.env.CORSAIR_KEK!,
    multiTenancy: true,
});

// When multiTenancy is true, you must use .withTenant(tenantId) to access plugins!
// For example:
// corsair.withTenant('user_123').gmail
// Use top-level await to get the actual data from the Promise
// Wrap in async function since top-level await needs ESM