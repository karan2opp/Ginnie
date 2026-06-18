import { corsair } from "../../../corsair";
import { db } from "@/db";
import { chatMessages } from "@/db/schema/chat";
import { eq, and, gte, count } from "drizzle-orm";
import { users } from "@/db/schema/user";

export async function fetchDashboardStats(userId: string) {
  let isConnected = false;
  let stats = {
    inboxTotal: 0,
    unreadTotal: 0,
    sentTotal: 0,
    draftsTotal: 0,
    meetingsThisWeek: 0,
    totalUsage: 0,
    requestsToday: 0,
    dailyLimit: 30,
    plan: "free",
  };

  try {
    const gmailApi = corsair.withTenant(userId).gmail.api;
    const calendarApi = corsair.withTenant(userId).googlecalendar.api;

    isConnected = true;

    // 1. Fetch Gmail Labels (INBOX, UNREAD, SENT, DRAFT)
    const [inboxRes, unreadRes, sentRes, draftRes] = await Promise.all([
      gmailApi.labels.get({ userId: 'me', id: 'INBOX' }).catch(() => ({ messagesTotal: 0 })),
      gmailApi.labels.get({ userId: 'me', id: 'UNREAD' }).catch(() => ({ messagesTotal: 0 })),
      gmailApi.labels.get({ userId: 'me', id: 'SENT' }).catch(() => ({ messagesTotal: 0 })),
      gmailApi.labels.get({ userId: 'me', id: 'DRAFT' }).catch(() => ({ messagesTotal: 0 })),
    ]);

    stats.inboxTotal = inboxRes.messagesTotal || 0;
    stats.unreadTotal = unreadRes.messagesTotal || 0;
    stats.sentTotal = sentRes.messagesTotal || 0;
    stats.draftsTotal = draftRes.messagesTotal || 0;

    // 2. Fetch Calendar Meetings for this week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const calendarRes = await calendarApi.events.getMany({
      calendarId: "primary",
      timeMin: startOfWeek.toISOString(),
      timeMax: endOfWeek.toISOString(),
      maxResults: 2500,
      singleEvents: true,
    }).catch(() => ({ items: [] }));

    stats.meetingsThisWeek = calendarRes.items?.length || 0;

  } catch (error: any) {
    if (error.message && error.message.includes("Account not found for tenant")) {
      isConnected = false;
    } else {
      console.error("Error fetching dashboard data from Google APIs:", error);
    }
  }

  // 3. Fetch Total Usage and Today's Usage
  try {
    const usageRes = await db
      .select({ count: count() })
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId));
    stats.totalUsage = usageRes[0]?.count || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRes = await db
      .select({ count: count() })
      .from(chatMessages)
      .where(
          and(
              eq(chatMessages.userId, userId),
              eq(chatMessages.role, "user"),
              gte(chatMessages.createdAt, today)
          )
      );
    stats.requestsToday = todayRes[0]?.count || 0;

    const userRes = await db.select({ plan: users.plan }).from(users).where(eq(users.id, userId)).limit(1);
    const plan = userRes[0]?.plan || "free";
    stats.plan = plan;
    stats.dailyLimit = plan === "elite" ? Infinity : (plan === "pro" ? 150 : 30);
  } catch (err) {
    console.error("Error fetching usage from db:", err);
  }

  return { isConnected, stats };
}
