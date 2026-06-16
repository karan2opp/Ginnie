import { processWebhook } from 'corsair';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/corsair';

export async function POST(request: NextRequest) {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        headers[key] = value;
    });

    const contentType = request.headers.get('content-type');

    let body: string | Record<string, unknown>;

    if (contentType?.includes('application/json')) {
        body = await request.json();
    } else {
        const text = await request.text();
        body = text && text.trim() ? text : {};
    }

    const tenantId = 'dev'

    const result = await processWebhook(corsair, headers, body, { tenantId });

    console.info('Plugin Processed:', result.plugin, result.action);

    if (result.plugin === 'gmail' && result.action === 'new_message') {
        const payload = result.payload as any;
        const msg = payload?.message || payload;
        
        if (msg && msg.id) {
            const { scoreEmailPriority } = await import('@/lib/llm');
            const { db } = await import('@/db');
            const { emails } = await import('@/db/schema/emails');

            const subject = msg.subject || "No Subject";
            const snippet = msg.snippet || "";
            const from = msg.from || "Unknown";
            
            const priority = await scoreEmailPriority(subject, snippet, from);
            
            try {
                await db.insert(emails).values({
                    id: msg.id,
                    userId: tenantId,
                    subject,
                    snippet,
                    from,
                    priority,
                    date: new Date()
                }).onConflictDoNothing();
            } catch (err) {
                console.error("Failed to insert email from webhook", err);
            }
        }
    }

    // Build response headers (e.g. Asana X-Hook-Secret handshake)
    // any/unknown cast needed since responseHeaders is a newer field not yet in the installed type definitions
    const responseHeaders = result.responseHeaders
    const nextHeaders = new Headers();
    if (responseHeaders) {
        for (const [key, value] of Object.entries(responseHeaders)) {
            nextHeaders.set(key, value);
        }
    }

    // Handle case where no webhook matched
    if (!result.response) {
        return NextResponse.json(
            {
                success: false,
                message: 'No matching webhook handler found',
            },
            { status: 404 },
        );
    }

    if (result.response !== undefined) {
        return NextResponse.json(result.response, { headers: nextHeaders });
    }

    // Webhook processed successfully, but no data to return to sender
    return new NextResponse(null, { status: 200, headers: nextHeaders });
}

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Webhook endpoint is active',
        timestamp: new Date().toISOString(),
    });
}