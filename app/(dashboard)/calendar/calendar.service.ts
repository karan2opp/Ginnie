import { corsair } from "../../../corsair";
import { parseGoogleEvents } from "@/lib/calendar-utils";
import { db } from "@/db";
import { calendarEvents } from "@/db/schema/calendar";
import { eq, and, gte, lte } from "drizzle-orm";

export async function fetchCalendarEvents(userId: string, queryTimeMin: string, queryTimeMax: string) {
  try {
    const calendarApi = corsair.withTenant(userId).googlecalendar.api;
    
    const response = await calendarApi.events.getMany({
      calendarId: "primary",
      timeMin: queryTimeMin,
      timeMax: queryTimeMax,
      maxResults: 2500,
      singleEvents: true,
      orderBy: "startTime",
    });

    const eventsByDate = parseGoogleEvents(response.items || []);

    // Fetch local urgent events
    const localEvents = await db
      .select()
      .from(calendarEvents)
      .where(
        and(
          eq(calendarEvents.userId, userId),
          eq(calendarEvents.isUrgent, true),
          gte(calendarEvents.startTime, new Date(queryTimeMin)),
          lte(calendarEvents.endTime, new Date(queryTimeMax))
        )
      );

    const urgentLinks = new Set(localEvents.filter(e => e.meetLink).map(e => e.meetLink));
    const urgentTitles = new Set(localEvents.map(e => e.title));

    // Tag events in eventsByDate
    for (const date in eventsByDate) {
      eventsByDate[date] = eventsByDate[date].map((event: any) => {
        let isUrgent = false;
        // Try matching by meetLink if exists, otherwise by title
        if (event.htmlLink || event.location) {
           // We might not easily have the meet link here depending on parseGoogleEvents. 
           // We can match by summary (title).
           if (urgentTitles.has(event.summary)) {
              isUrgent = true;
           }
        } else if (urgentTitles.has(event.summary)) {
           isUrgent = true;
        }

        return {
          ...event,
          isUrgent
        };
      });
    }

    return { isConnected: true, eventsByDate };
  } catch (error: any) {
    if (error.message && error.message.includes("Account not found for tenant")) {
      return { isConnected: false, eventsByDate: {} };
    }
    console.error("Error fetching calendar events:", error);
    throw error;
  }
}

export async function createCalendarEvent(userId: string, data: { title: string, start: Date, end: Date, description?: string, addMeet?: boolean }) {
  try {
    const calendarApi = corsair.withTenant(userId).googlecalendar.api;

    const eventParams: any = {
      calendarId: "primary",
      requestBody: {
        summary: data.title,
        description: data.description || "",
        start: { dateTime: data.start.toISOString() },
        end: { dateTime: data.end.toISOString() },
      }
    };

    if (data.addMeet) {
      eventParams.conferenceDataVersion = 1;
      eventParams.requestBody.conferenceData = {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      };
    }

    const response = await calendarApi.events.create(eventParams);
    return { success: true, event: response.data };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}
