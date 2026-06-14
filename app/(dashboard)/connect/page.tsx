import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { connections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { corsair } from "../../../corsair";
import { pool } from "@/db";

export default async function ConnectPage() {
  const { userId } = await auth();

  // If already connected, skip to inbox
  const connection = await db.query.connections.findFirst({
    where: eq(connections.userId, userId!),
  });

  if (connection?.isActive) {
    try {
      const gmailRes = await pool.query(`SELECT id FROM corsair_integrations WHERE name = 'gmail'`);
      if (gmailRes.rows[0]) {
         const existingAccount = await pool.query(`SELECT id FROM corsair_accounts WHERE tenant_id = $1 AND integration_id = $2`, [userId, gmailRes.rows[0].id]);
         if (existingAccount.rowCount === 0) {
            await pool.query(`INSERT INTO corsair_accounts (id, tenant_id, integration_id, config, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, '{}', NOW(), NOW())`, [userId, gmailRes.rows[0].id]);
         }
         const gmailKeys = corsair.withTenant(userId!).gmail.keys;
         await gmailKeys.issue_new_dek();
         await gmailKeys.set_access_token(connection.accessToken!);
         if (connection.refreshToken) {
           await gmailKeys.set_refresh_token(connection.refreshToken);
         }
         if (connection.accessTokenExpiry) {
           await gmailKeys.set_expires_at(String(Math.floor(connection.accessTokenExpiry.getTime() / 1000)));
         }
      }

      const calRes = await pool.query(`SELECT id FROM corsair_integrations WHERE name = 'googlecalendar'`);
      if (calRes.rows[0]) {
         const existingAccount = await pool.query(`SELECT id FROM corsair_accounts WHERE tenant_id = $1 AND integration_id = $2`, [userId, calRes.rows[0].id]);
         if (existingAccount.rowCount === 0) {
            await pool.query(`INSERT INTO corsair_accounts (id, tenant_id, integration_id, config, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, '{}', NOW(), NOW())`, [userId, calRes.rows[0].id]);
         }
         const calendarKeys = corsair.withTenant(userId!).googlecalendar.keys;
         await calendarKeys.issue_new_dek();
         await calendarKeys.set_access_token(connection.accessToken!);
         if (connection.refreshToken) {
           await calendarKeys.set_refresh_token(connection.refreshToken);
         }
         if (connection.accessTokenExpiry) {
           await calendarKeys.set_expires_at(String(Math.floor(connection.accessTokenExpiry.getTime() / 1000)));
         }
      }
    } catch (e) {
      console.error("Failed to self-heal corsair tokens:", e);
    }
    redirect("/chat");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-2xl font-bold text-gray-900">
          Connect your Google account
        </h1>
        <p className="mt-2 text-gray-500">
          We need access to your Gmail and Calendar to get started.
        </p>

        <div className="mt-6 space-y-3">
          {/* What we access */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">
              We will access:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              <li>✅ Read and send Gmail emails</li>
              <li>✅ View and create Calendar events</li>
              <li>✅ Send calendar invites</li>
            </ul>
          </div>

          {/* Connect button */}
          <a
            href="/google"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Connect Google Account
          </a>

          <p className="text-center text-xs text-gray-400">
            You can disconnect anytime from settings
          </p>
        </div>

      </div>
    </div>
  );
}
