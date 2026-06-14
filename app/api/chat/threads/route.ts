import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../db';
import { sql } from 'drizzle-orm';

export async function GET(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Group by thread_id, get the earliest message as title, order by earliest message DESC
        const result = await db.execute(sql`
            SELECT thread_id as "threadId", 
                   min(created_at) as "createdAt", 
                   (array_agg(content ORDER BY created_at ASC))[1] as title
            FROM chat_messages
            WHERE user_id = ${userId}
            GROUP BY thread_id
            ORDER BY "createdAt" DESC
        `);

        return Response.json({ threads: result.rows || result });
    } catch (error) {
        console.error('Failed to fetch chat threads:', error);
        return Response.json({ error: 'Failed to fetch threads' }, { status: 500 });
    }
}
