import { corsair } from "./corsair";
import * as dotenv from "dotenv";
import crypto from "crypto";
dotenv.config({ path: ".env.local" });

async function main() {
    // We need a userId to test with. I will try to fetch the first user from the DB or let the user supply it.
    // Or we can just read corsairAccounts.
    const { db } = await import("./db");
    const { corsairAccounts } = await import("./db/schema/schema");
    const accounts = await db.select().from(corsairAccounts).limit(1);
    
    if (accounts.length === 0) {
        console.log("No accounts found");
        return;
    }
    const tenantId = accounts[0].tenantId;
    console.log("Using tenantId:", tenantId);

    const calendarApi = corsair.withTenant(tenantId).googlecalendar.api;

    try {
        const res = await calendarApi.events.create({
            calendarId: "primary",
            sendUpdates: "all",
            conferenceDataVersion: 1,
            event: {
                summary: "Test Meeting from Script",
                start: { dateTime: new Date(Date.now() + 3600000).toISOString() },
                end: { dateTime: new Date(Date.now() + 7200000).toISOString() },
                attendees: [{ email: "test-receiver@example.com" }], // Replace with an actual test email
                conferenceData: {
                    createRequest: {
                        requestId: crypto.randomUUID(),
                    }
                }
            }
        });
        console.log("Event created successfully:");
        console.log(res);
    } catch (e: any) {
        console.error("Failed to create event:", e.message);
    }
}
main();
