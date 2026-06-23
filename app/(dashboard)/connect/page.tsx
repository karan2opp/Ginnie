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
         const existingAccount = await pool.query(`SELECT id, dek FROM corsair_accounts WHERE tenant_id = $1 AND integration_id = $2`, [userId, gmailRes.rows[0].id]);
         let needsDek = false;
         if (existingAccount.rowCount === 0) {
            await pool.query(`INSERT INTO corsair_accounts (id, tenant_id, integration_id, config, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, '{}', NOW(), NOW())`, [userId, gmailRes.rows[0].id]);
            needsDek = true;
         } else if (!existingAccount.rows[0].dek) {
            needsDek = true;
         }
         const gmailKeys = corsair.withTenant(userId!).gmail.keys;
         if (needsDek) {
           await gmailKeys.issue_new_dek();
         }
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
         const existingAccount = await pool.query(`SELECT id, dek FROM corsair_accounts WHERE tenant_id = $1 AND integration_id = $2`, [userId, calRes.rows[0].id]);
         let needsDek = false;
         if (existingAccount.rowCount === 0) {
            await pool.query(`INSERT INTO corsair_accounts (id, tenant_id, integration_id, config, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, '{}', NOW(), NOW())`, [userId, calRes.rows[0].id]);
            needsDek = true;
         } else if (!existingAccount.rows[0].dek) {
            needsDek = true;
         }
         const calendarKeys = corsair.withTenant(userId!).googlecalendar.keys;
         if (needsDek) {
           await calendarKeys.issue_new_dek();
         }
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
    <div className="flex min-h-screen items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22c55e]/10 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
      
      <div className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-zinc-800/80 p-8 shadow-black shadow-2xl relative z-10">

        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 flex items-center justify-center border border-[#22c55e]/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            <svg className="h-6 w-6 text-[#22c55e]" viewBox="0 0 24 24">
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
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center tracking-tight">
          Connect your Google account
        </h1>
        <p className="mt-2 text-zinc-400 text-center text-sm leading-relaxed">
          We need access to your Gmail and Calendar to get started.
        </p>

        <div className="mt-8 space-y-4">
          {/* What we access */}
          <div className="rounded-xl border border-zinc-800/80 bg-neutral-900/30 p-5">
            <p className="text-sm font-semibold text-white mb-3">
              We will access:
            </p>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-full bg-[#22c55e]/20 p-0.5">
                  <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Read and send Gmail emails</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-full bg-[#22c55e]/20 p-0.5">
                  <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>View and create Calendar events</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-full bg-[#22c55e]/20 p-0.5">
                  <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Send calendar invites</span>
              </li>
            </ul>
          </div>

          {/* Connect button */}
          <a
            href="/google"
            className="group flex w-full items-center justify-center gap-3 rounded-lg bg-[#22c55e] px-4 py-3.5 text-black font-semibold hover:bg-[#16a34a] transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transform hover:-translate-y-0.5"
          >
            Connect Google Account
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <p className="text-center text-xs text-zinc-500 mt-4">
            You can disconnect anytime from settings
          </p>
        </div>

      </div>
    </div>
  );
}
