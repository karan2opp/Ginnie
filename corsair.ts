import "dotenv/config";
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { pool } from './db/index';

const globalForCorsair = globalThis as unknown as {
  corsair: ReturnType<typeof createCorsair> | undefined;
};

export const corsair = globalForCorsair.corsair ?? createCorsair({
    plugins: [gmail(), googlecalendar()],
    database: pool,
    kek: process.env.CORSAIR_KEK!,
    multiTenancy: true,
});

if (process.env.NODE_ENV !== "production") globalForCorsair.corsair = corsair;