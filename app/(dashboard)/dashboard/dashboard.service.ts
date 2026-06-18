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

  // 4. Fetch Today's Agenda
  let todaysAgenda: any[] = [];
  try {
    const calendarApi = corsair.withTenant(userId).googlecalendar.api;
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const agendaRes = await calendarApi.events.getMany({
      calendarId: "primary",
      timeMin: startOfToday.toISOString(),
      timeMax: endOfToday.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    }).catch(() => ({ items: [] }));

    todaysAgenda = (agendaRes.items || []).map((event: any) => ({
      id: event.id,
      title: event.summary || "No Title",
      startTime: event.start?.dateTime || event.start?.date,
      endTime: event.end?.dateTime || event.end?.date,
      meetLink: event.hangoutLink || null,
    }));
  } catch (err) {
    console.error("Error fetching agenda:", err);
  }

  // 5. Fetch Recent AI Activity
  let recentActivity: any[] = [];
  try {
    // get latest 3 user messages (which represent tasks/chats)
    const recentRes = await db
      .select()
      .from(chatMessages)
      .where(and(eq(chatMessages.userId, userId), eq(chatMessages.role, "user")))
      .orderBy(chatMessages.createdAt) // Since we don't have a desc method imported, we will fetch last few and reverse
      .limit(20);
      
    // Reverse and take top 3
    recentActivity = recentRes.reverse().slice(0, 3).map(msg => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
    }));
  } catch (err) {
    console.error("Error fetching recent activity:", err);
  }

  return { isConnected, stats, todaysAgenda, recentActivity };
}
