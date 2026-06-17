import { getOAuthClient, exchangeCodeForTokens } from "@/lib/google";
import { auth } from "@clerk/nextjs/server";
import { db, pool } from "@/db";
import { connections, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { google } from "googleapis";
import { corsair } from "../../../../corsair";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // Get code from Google redirect
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return redirect("/connect?error=no_code");

  let success = false;
  try {
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/callback/google`;

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // Get user's Google email
    const oauth2Client = getOAuthClient(redirectUri);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Ensure the user exists in our local DB before inserting the connection
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!existingUser) {
      await db.insert(users).values({
        id: userId,
        email: data.email!,
        name: data.name,
        imageUrl: data.picture,
      });
    } else {
      await db.update(users).set({
        email: data.email!,
        name: data.name,
        imageUrl: data.picture,
        updatedAt: new Date()
      }).where(eq(users.id, userId));
    }

    const existing = await db.query.connections.findFirst({
      where: eq(connections.userId, userId)
    });

    if (existing) {
      await db.update(connections).set({
        googleEmail:        data.email!,
        accessToken:        tokens.access_token!,
        refreshToken:       tokens.refresh_token!,
        accessTokenExpiry:  new Date(tokens.expiry_date!),
        gmailConnected:     true,
        calendarConnected:  true,
        isActive:           true,
        updatedAt:         new Date(),
      }).where(eq(connections.userId, userId));
    } else {
      await db.insert(connections).values({
        id: crypto.randomUUID(),
        userId,
        googleEmail:        data.email!,
        accessToken:        tokens.access_token!,
        refreshToken:       tokens.refresh_token!,
        accessTokenExpiry:  new Date(tokens.expiry_date!),
        gmailConnected:     true,
        calendarConnected:  true,
        isActive:           true,
      });
    }

    // Ensure integration definitions exist (Self-healing for fresh production databases)
    await pool.query(`
      INSERT INTO corsair_integrations (id, name, config, created_at, updated_at) 
      SELECT gen_random_uuid(), 'gmail', '{}', NOW(), NOW() 
      WHERE NOT EXISTS (SELECT 1 FROM corsair_integrations WHERE name = 'gmail')
    `);
    await pool.query(`
      INSERT INTO corsair_integrations (id, name, config, created_at, updated_at) 
      SELECT gen_random_uuid(), 'googlecalendar', '{}', NOW(), NOW() 
      WHERE NOT EXISTS (SELECT 1 FROM corsair_integrations WHERE name = 'googlecalendar')
    `);

    // Sync tokens with Corsair for integrations manually
    const gmailRes = await pool.query(`SELECT id FROM corsair_integrations WHERE name = 'gmail'`);
    if (gmailRes.rows[0]) {
       const existingAccount = await pool.query(`SELECT id FROM corsair_accounts WHERE tenant_id = $1 AND integration_id = $2`, [userId, gmailRes.rows[0].id]);
       if (existingAccount.rowCount === 0) {
          await pool.query(`INSERT INTO corsair_accounts (id, tenant_id, integration_id, config, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, '{}', NOW(), NOW())`, [userId, gmailRes.rows[0].id]);
       }
       const gmailKeys = corsair.withTenant(userId).gmail.keys;
       await gmailKeys.issue_new_dek();
       await gmailKeys.set_access_token(tokens.access_token!);
       if (tokens.refresh_token) {
           await gmailKeys.set_refresh_token(tokens.refresh_token);
       }
       if (tokens.expiry_date) {
         await gmailKeys.set_expires_at(String(Math.floor(tokens.expiry_date / 1000)));
       }
    }

    const calRes = await pool.query(`SELECT id FROM corsair_integrations WHERE name = 'googlecalendar'`);
    if (calRes.rows[0]) {
       const existingAccount = await pool.query(`SELECT id FROM corsair_accounts WHERE tenant_id = $1 AND integration_id = $2`, [userId, calRes.rows[0].id]);
       if (existingAccount.rowCount === 0) {
          await pool.query(`INSERT INTO corsair_accounts (id, tenant_id, integration_id, config, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, '{}', NOW(), NOW())`, [userId, calRes.rows[0].id]);
       }
       const calendarKeys = corsair.withTenant(userId).googlecalendar.keys;
       await calendarKeys.issue_new_dek();
       await calendarKeys.set_access_token(tokens.access_token!);
       if (tokens.refresh_token) {
           await calendarKeys.set_refresh_token(tokens.refresh_token);
       }
       if (tokens.expiry_date) {
         await calendarKeys.set_expires_at(String(Math.floor(tokens.expiry_date / 1000)));
       }
    }

    success = true;
  } catch (error: any) {
    console.error("Google OAuth error:", error);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { status: 500 });
  }

  if (success) {
    return redirect("/chat");
  } else {
    return redirect("/connect?error=oauth_failed");
  }
}
