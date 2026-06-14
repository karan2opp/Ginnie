// src/app/api/agent/route.ts
import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, run, tool } from '@openai/agents';
import { corsair } from '../../../corsair';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../db';
import { chatMessages } from '../../../db/schema/chat';
import crypto from 'crypto';

// Build agent outside handler so it's reused
const provider = new OpenAIAgentsProvider();
const tools = await provider.build({ corsair, tool });

const agent = new Agent({
    name: 'email-calendar-agent',
    model: 'gpt-4o-mini',           // cheaper than gpt-4.1
    instructions: `
    You are an email and calendar assistant.
    You have access to the user's Gmail and Google Calendar via Corsair.
    Use list_operations to discover available APIs.
    Use get_schema to understand required arguments.
    Use run_script to execute them.
    Always confirm what action you took at the end.
  `,
    tools,
});

export async function POST(req: Request) {
    // protect route
    const { userId } = await auth();
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, threadId } = await req.json();
    if (!message) {
        return Response.json({ error: 'No message provided' }, { status: 400 });
    }

    try {
        const enhancedMessage = `[System Info] The user's tenant ID is: "${userId}". 
IMPORTANT: When writing scripts for Corsair, you MUST use \`corsair.withTenant("${userId}")\` before accessing .gmail or .googlecalendar. 

To send an email, use the EXACT script template below in your run_script tool (just replace To, Subject, and Body):
\`\`\`javascript
const rawEmail = \`To: TARGET_EMAIL\\r\\nSubject: YOUR_SUBJECT\\r\\n\\r\\nYOUR_BODY\`;
const encodedEmail = Buffer.from(rawEmail).toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
const res = await corsair.withTenant("${userId}").gmail.api.messages.send({
  userId: "me",
  raw: encodedEmail
});
return res;
\`\`\`

For Google Calendar, use the following methods on \`corsair.withTenant("${userId}").googlecalendar.api\`:
- \`events.getMany({ calendarId: 'primary', timeMin: "...", timeMax: "...", singleEvents: true })\`
- \`events.create({ calendarId: 'primary', event: { summary: "...", start: { dateTime: "..." }, end: { dateTime: "..." } } })\`
- \`events.update({ calendarId: 'primary', id: "EVENT_ID", event: { summary: "...", start: { ... }, end: { ... } } })\`
- \`events.delete({ calendarId: 'primary', id: "EVENT_ID" })\`
Note: Do NOT use \`requestBody\`. Put event data inside the \`event\` property.
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

        const result = await run(agent, enhancedMessage);

        // Insert agent message
        await db.insert(chatMessages).values({
            id: crypto.randomUUID(),
            threadId: actualThreadId,
            userId: userId,
            role: 'agent',
            content: result.finalOutput || 'No response',
        });

        return Response.json({ reply: result.finalOutput, threadId: actualThreadId });
    } catch (error) {
        console.error('Agent error:', error);
        return Response.json({ error: 'Agent failed' }, { status: 500 });
    }
}