import { getOAuthClient, exchangeCodeForTokens } from "@/lib/google";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { connections, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { google } from "googleapis";

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
