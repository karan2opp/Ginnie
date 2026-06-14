import { corsair } from "../../../corsair";
import { parseGoogleEvents } from "@/lib/calendar-utils";

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

    return { isConnected: true, eventsByDate };
  } catch (error: any) {
    if (error.message && error.message.includes("Account not found for tenant")) {
      return { isConnected: false, eventsByDate: {} };
    }
    console.error("Error fetching calendar events:", error);
    return { isConnected: false, eventsByDate: {} };
  }
}
