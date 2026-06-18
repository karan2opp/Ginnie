// src/app/api/agent/route.ts
import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, run, tool } from '@openai/agents';
import { corsair } from '../../../corsair';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../db';
import { chatMessages } from '../../../db/schema/chat';
import crypto from 'crypto';
import { z } from 'zod';

import { users } from '../../../db/schema/user';
import { calendarEvents } from '../../../db/schema/calendar';
import { eq, and, gte, count } from 'drizzle-orm';

export const maxDuration = 60; // Allow longer execution time for agent


const createMeeting = tool({
    name: 'create_meeting_native',
    description: 'Creates a Google Calendar meeting with Meet link and sends invite email.',
    parameters: z.object({
        summary: z.string().describe("Title of the meeting"),
        attendees: z.array(z.string()).describe("List of attendee email addresses"),
        startTime: z.string().describe("Local IST time string (YYYY-MM-DDTHH:MM:SS). NEVER convert to UTC!"),
        endTime: z.string().describe("Local IST time string (YYYY-MM-DDTHH:MM:SS). NEVER convert to UTC!"),
        tenantId: z.string().describe("The user's tenant ID from system info"),
        organizerEmail: z.string().describe("The organizer's email address"),
    }),

    execute: async ({ summary, attendees, startTime, endTime, tenantId, organizerEmail }) => {
        try {
            const calApi = corsair.withTenant(tenantId).googlecalendar.api;
            const gmailApi = corsair.withTenant(tenantId).gmail.api;

            // Explicitly force string to local time (YYYY-MM-DDTHH:MM:SS) regardless of what LLM provides
            const startLocal = startTime.substring(0, 19).replace("Z", "");
            const endLocal = endTime.substring(0, 19).replace("Z", "");

            console.log("=== CREATE MEETING DEBUG ===");
            console.log("tenantId:", tenantId);
            console.log("organizerEmail:", organizerEmail);
            console.log("attendees:", attendees);
            console.log("startLocal:", startLocal);
            console.log("endLocal:", endLocal);

            // Step 1 — create WITHOUT attendees first
            const res = await calApi.events.create({
                calendarId: "primary",
                event: {
                    summary,
                    start: { dateTime: startLocal, timeZone: "Asia/Kolkata" },
                    end: { dateTime: endLocal, timeZone: "Asia/Kolkata" },
                },
            });

            // Step 1.5 — update with meet link
            const finalRes = await calApi.events.update({
                calendarId: "primary",
                id: res.id!,
                conferenceDataVersion: 1,
                sendUpdates: "all",
                event: {
                    summary,
                    start: { dateTime: startLocal, timeZone: "Asia/Kolkata" },
                    end: { dateTime: endLocal, timeZone: "Asia/Kolkata" },
                    attendees: [
                        { email: organizerEmail, organizer: true, responseStatus: "accepted" as const },
                        ...attendees.map(email => ({ email, responseStatus: "needsAction" as const })),
                    ],
                    conferenceData: {
                        createRequest: { requestId: crypto.randomUUID() },
                    },
                } as any,
            });
            const iCalUID = finalRes.iCalUID || crypto.randomUUID();
            const meetLink = finalRes.hangoutLink || finalRes.htmlLink || "";

            // Extract basic datetime strings (YYYYMMDDTHHMMSS) without Z!
            const dtStart = startLocal.replace(/[-:]/g, '');
            const dtEnd = endLocal.replace(/[-:]/g, '');
            const dtStamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

            // Step 2 — send a native text/calendar RSVP email to each attendee
            // Step 2 — send RSVP email
            for (const attendeeEmail of attendees) {

                const boundary = `boundary_${crypto.randomUUID().replace(/-/g, "")}`;

                const icalContent = [
                    `BEGIN:VCALENDAR`,
                    `VERSION:2.0`,
                    `PRODID:-//Ginnie App//EN`,
                    `CALSCALE:GREGORIAN`,
                    `METHOD:REQUEST`,
                    `BEGIN:VTIMEZONE`,
                    `TZID:Asia/Kolkata`,
                    `BEGIN:STANDARD`,
                    `TZOFFSETFROM:+0530`,
                    `TZOFFSETTO:+0530`,
                    `TZNAME:IST`,
                    `DTSTART:19700101T000000`,
                    `END:STANDARD`,
                    `END:VTIMEZONE`,
                    `BEGIN:VEVENT`,
                    `UID:${iCalUID}`,
                    `DTSTAMP:${dtStamp}`,
                    `DTSTART;TZID=Asia/Kolkata:${dtStart}`,
                    `DTEND;TZID=Asia/Kolkata:${dtEnd}`,
                    `SUMMARY:${summary}`,
                    `ORGANIZER;CN="${organizerEmail}":mailto:${organizerEmail}`,
                    `ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN="${attendeeEmail}":mailto:${attendeeEmail}`,
                    `DESCRIPTION:Join Google Meet: ${meetLink}`,
                    `LOCATION:${meetLink}`,
                    `STATUS:CONFIRMED`,
                    `SEQUENCE:0`,
                    `END:VEVENT`,
                    `END:VCALENDAR`,
                ].join("\r\n");

                const plainText = `
You have been invited to a meeting.

📅 ${summary}
🗓  ${startLocal.replace("T", " ")} IST
🔗 Google Meet: ${meetLink}
👤 Organizer: ${organizerEmail}

This invite was sent via Ginnie.
  `.trim();

                // Proper multipart MIME — this is what makes Gmail show Yes/No buttons
                const mimeEmail = [
                    `To: ${attendeeEmail}`,
                    `From: ${organizerEmail}`,
                    `Subject: Invitation: ${summary}`,
                    `MIME-Version: 1.0`,
                    `Content-Type: multipart/mixed; boundary="${boundary}"`,
                    ``,
                    `--${boundary}`,
                    `Content-Type: text/plain; charset="UTF-8"`,
                    ``,
                    plainText,
                    ``,
                    `--${boundary}`,
                    `Content-Type: text/calendar; charset="UTF-8"; method=REQUEST`,
                    `Content-Transfer-Encoding: 7bit`,
                    `Content-Disposition: attachment; filename="invite.ics"`,
                    ``,
                    icalContent,
                    ``,
                    `--${boundary}--`,
                ].join("\r\n");

                const encodedEmail = Buffer.from(mimeEmail)
                    .toString("base64")
                    .replace(/\+/g, "-")
                    .replace(/\//g, "_")
                    .replace(/=+$/, "");

                try {
                    const emailRes = await gmailApi.messages.send({
                        userId: "me",
                        raw: encodedEmail,
                    });
                    console.log("RSVP Email sent:", JSON.stringify(emailRes));
                } catch (emailErr: any) {
                    console.error("RSVP Email send error:", emailErr.message);
                    console.error("Full error:", JSON.stringify(emailErr));
                }
            }

            return {
                status: "success",
                eventId: res.id,
                meetLink,
                message: `Meeting scheduled natively! Official RSVP invite sent to ${attendees.join(", ")}`,
            };

        } catch (e: any) {
            console.error("createMeeting error:", e);
            return { status: "error", message: e.message };
        }
    },
});

let cachedBuiltTools: any = null;

async function getBuiltTools() {
    if (cachedBuiltTools) return cachedBuiltTools;
    const provider = new OpenAIAgentsProvider();
    cachedBuiltTools = await provider.build({ corsair, tool });
    return cachedBuiltTools;
}

async function getAgent() {
    const builtTools = await getBuiltTools();

    return new Agent({
        name: 'ginnie',
        model: 'gpt-4o-mini',
        instructions: `
You are Ginnie, a smart email and calendar assistant.

You have access to the user's Gmail and Google Calendar via Corsair tools.

For scheduling meetings:
1. Use the 'create_meeting_native' tool. Pass the tenantId provided in system info.
2. This tool automatically handles everything (creation, Meet link generation, and sending native RSVP emails).
3. Reply to user confirming: meeting created, official invitations sent, Meet link
4. When confirming the meeting in chat, format it like:
✅ Meeting scheduled!

📅 Thursday, June 19 at 3:00 PM
👥 Attendees: john@gmail.com
⏱ Duration: 1 hour

🔗 Google Meet: [clickable link]

📧 Official Google Calendar invitations (with RSVP options) sent to all attendees.

For urgent meetings:
- If user says "urgent meeting" → set isUrgent: true in DB
- These appear in the urgent widget on dashboard

Always:
- Confirm timezone (assume user's local time if not specified)
- Default meeting duration to 1 hour unless specified
- Always include the Meet link in chat reply
- Format times clearly: "Thursday, June 19 at 3:00 PM"
- Important: If you successfully scheduled a meeting, you MUST include a JSON block at the very end of your response exactly like this, wrapped in triple backticks and the 'json' language identifier.
\`\`\`json
{
  "__EVENT_CREATED__": {
    "title": "Event Summary",
    "startTime": "2026-06-19T21:00:00",
    "endTime": "2026-06-19T22:00:00",
    "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
    "isUrgent": true_or_false
  }
}
\`\`\`
  `,
        tools: [...builtTools, createMeeting],
    });
}

export async function POST(req: Request) {
    // protect route
    const { userId } = await auth();
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, threadId, emailContext } = await req.json();
    if (!message) {
        return Response.json({ error: 'No message provided' }, { status: 400 });
    }

    try {
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1).then(res => res[0]);

        // Rate Limiting Logic
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const usageQuery = await db.select({ count: count() })
            .from(chatMessages)
            .where(
                and(
                    eq(chatMessages.userId, userId),
                    eq(chatMessages.role, 'user'),
                    gte(chatMessages.createdAt, today)
                )
            );
        const messagesToday = usageQuery[0].count;

        const plan = user?.plan || 'free';
        let limit = 30; // Free
        if (plan === 'pro') limit = 150;
        else if (plan === 'elite') limit = Infinity;

        if (messagesToday >= limit) {
            return Response.json({ 
                error: 'Rate limit exceeded', 
                message: `You have reached your daily limit of ${limit} requests on the ${plan.toUpperCase()} plan. Please upgrade to continue.`,
                requiresUpgrade: true
            }, { status: 429 });
        }

        const enhancedMessage = `[System Info] 
The user's tenant ID is: "${userId}".
The user's email is: "${user?.email}".
Today's date is: ${new Date().toISOString().split("T")[0]}.

IMPORTANT: When using create_meeting_native tool:
- Pass tenantId: "${userId}"
- Pass organizerEmail: "${user?.email}"
- Use timeZone: "Asia/Kolkata" for all events
- Today is ${new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
- NEVER use past dates, always use current or future dates
- When user says "tomorrow" use ${new Date(Date.now() + 86400000).toISOString().split("T")[0]}

When writing scripts for Corsair run_script, use this exact email format:
\`\`\`javascript
const rawEmail = \`To: TARGET_EMAIL\\r\\nFrom: ${user?.email}\\r\\nSubject: YOUR_SUBJECT\\r\\n\\r\\nYOUR_BODY\`;
const encodedEmail = Buffer.from(rawEmail).toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
const res = await corsair.withTenant("${userId}").gmail.api.messages.send({
  userId: "me",
  raw: encodedEmail
});
return res;
\`\`\`

For Gmail reading and listing, use:
- \`corsair.withTenant("${userId}").gmail.api.messages.list({ userId: "me", maxResults: 3, q: "your query" })\`
- \`corsair.withTenant("${userId}").gmail.api.messages.get({ userId: "me", id: "MSG_ID", format: "metadata", metadataHeaders: ["Subject", "From", "Date"] })\`
CRITICAL: You MUST use format: "metadata" as shown above. This returns the headers and a short 'snippet' of the body, which is perfectly sufficient for summaries. NEVER use format: "full" or "raw" because real email bodies contain huge base64 attachments that will immediately crash your context window.

To REPLY to an email, you must include the In-Reply-To and References headers, and pass the threadId:
\`\`\`javascript
const rawEmail = \`To: TARGET_EMAIL\\r\\nFrom: ${user?.email}\\r\\nSubject: Re: ORIGINAL_SUBJECT\\r\\nIn-Reply-To: ORIGINAL_MESSAGE_ID\\r\\nReferences: ORIGINAL_MESSAGE_ID\\r\\n\\r\\nYOUR_BODY\`;
const encodedEmail = Buffer.from(rawEmail).toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
const res = await corsair.withTenant("${userId}").gmail.api.messages.send({
  userId: "me",
  requestBody: {
    raw: encodedEmail,
    threadId: "ORIGINAL_THREAD_ID"
  }
});
return res;
\`\`\`

For Google Calendar, use the following methods on \`corsair.withTenant("${userId}").googlecalendar.api\`:
- \`events.getMany({ calendarId: 'primary', timeMin: "...", timeMax: "...", singleEvents: true })\`
- \`events.create({ calendarId: 'primary', conferenceDataVersion: 1, sendUpdates: "all", event: { summary: "...", attendees: [{ email: "target@example.com" }], start: { dateTime: "..." }, end: { dateTime: "..." }, conferenceData: { createRequest: { requestId: "some_unique_string" } } } })\`
- \`events.update({ calendarId: 'primary', id: "EVENT_ID", event: { summary: "...", start: { ... }, end: { ... } } })\`
- \`events.delete({ calendarId: 'primary', id: "EVENT_ID" })\`
Note: Do NOT use \`requestBody\`. Put event data inside the \`event\` property.

${emailContext ? `[Current Context]
The user is currently viewing the following email in the UI:
- Message ID: ${emailContext.id}
- From: ${emailContext.from}
- Subject: ${emailContext.subject}

When asked to reply to an email, use this context automatically. Do NOT ask for the recipient's email address. The target email is: ${emailContext.from.match(/<([^>]+)>/)?.[1] || emailContext.from}. Use the Message ID ${emailContext.id} for the In-Reply-To and References headers.
` : ''}
[User Request]
${message}`;
        const actualThreadId = threadId || crypto.randomUUID();

        // Insert user message
        await db.insert(chatMessages).values({
            id: crypto.randomUUID(),
            threadId: actualThreadId,
            userId: userId,
            role: 'user',
            content: message,
        });

        // Fetch past messages to provide conversational memory
        const pastMsgs = await db.select()
            .from(chatMessages)
            .where(eq(chatMessages.threadId, actualThreadId))
            .orderBy(chatMessages.createdAt);

        // Keep last 3 messages for context and truncate long contents
        const recentMsgs = pastMsgs.slice(-3);
        const historyText = recentMsgs.map(m => {
            const content = m.content || "";
            const truncated = content.length > 1500 ? content.substring(0, 1500) + "...[truncated]" : content;
            return `${m.role === 'user' ? 'User' : 'Assistant'}: ${truncated}`;
        }).join("\n\n");

        const finalPrompt = enhancedMessage.replace("[User Request]", "[Recent Conversation History]\n" + historyText + "\n\n[User Request]");

        const agent = await getAgent();
        const result = await run(agent, finalPrompt);

        let finalOutput = result.finalOutput || 'No response';

        // Parse for __EVENT_CREATED__ JSON block
        const jsonMatch = finalOutput.match(/```json\s*(\{[\s\S]*?"__EVENT_CREATED__"[\s\S]*?\})\s*```/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[1]);
                if (parsed.__EVENT_CREATED__) {
                    const eventData = parsed.__EVENT_CREATED__;
                    await db.insert(calendarEvents).values({
                        id: crypto.randomUUID(),
                        userId: userId,
                        title: eventData.title || "New Meeting",
                        startTime: new Date(eventData.startTime),
                        endTime: new Date(eventData.endTime),
                        meetLink: eventData.meetLink || null,
                        isUrgent: eventData.isUrgent || false,
                        emailSent: true, // Assuming agent sent the email as instructed
                    });
                }
            } catch (e) {
                console.error("Failed to parse agent event json", e);
            }
            // Remove the JSON block from the final output shown to the user
            finalOutput = finalOutput.replace(jsonMatch[0], '').trim();
        }

        // Insert agent message
        await db.insert(chatMessages).values({
            id: crypto.randomUUID(),
            threadId: actualThreadId,
            userId: userId,
            role: 'agent',
            content: finalOutput,
        });

        return Response.json({ reply: finalOutput, threadId: actualThreadId });
    } catch (error: any) {
        console.error('Agent error:', error);
        return Response.json({ error: error.message || 'Agent failed', stack: error.stack }, { status: 500 });
    }
}
