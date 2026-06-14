import { auth } from '@clerk/nextjs/server';
import { db } from '../../../db';
import { chatMessages } from '../../../db/schema/chat';
import { eq, asc, and } from 'drizzle-orm';

export async function GET(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const threadId = url.searchParams.get('threadId');

    try {
        const history = await db.select()
            .from(chatMessages)
            .where(
                threadId 
                    ? and(eq(chatMessages.userId, userId), eq(chatMessages.threadId, threadId))
                    : eq(chatMessages.userId, userId)
            )
            .orderBy(asc(chatMessages.createdAt));
            
        return Response.json({ messages: history });
    } catch (error) {
        console.error('Failed to fetch chat history:', error);
        return Response.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await db.delete(chatMessages).where(eq(chatMessages.userId, userId));
        return Response.json({ success: true });
    } catch (error) {
        console.error('Failed to clear chat history:', error);
        return Response.json({ error: 'Failed to clear history' }, { status: 500 });
    }
}
