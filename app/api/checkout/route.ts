import { auth } from '@clerk/nextjs/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { db } from '@/db';
import { orders } from '@/db/schema/orders';
import { users } from '@/db/schema/user';
import { eq } from 'drizzle-orm';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await req.json();

  if (!['pro', 'elite'].includes(plan)) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const amount = plan === 'pro' ? 50000 : 100000; // 500 INR or 1000 INR in paise

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${crypto.randomUUID().substring(0, 10)}`,
    });

    // Save order in database
    await db.insert(orders).values({
      id: order.id,
      userId: userId,
      amount: order.amount as number,
      currency: order.currency,
      status: 'pending',
      plan: plan,
    });

    // We also need user details for Razorpay checkout prefill
    const userRow = await db.select().from(users).where(eq(users.id, userId)).limit(1).then(res => res[0]);

    return Response.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      user: {
        name: userRow?.name || '',
        email: userRow?.email || ''
      }
    });
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
