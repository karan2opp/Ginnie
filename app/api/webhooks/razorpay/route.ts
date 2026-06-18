import crypto from 'crypto';
import { db } from '@/db';
import { orders } from '@/db/schema/orders';
import { users } from '@/db/schema/user';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    // 1. Update order status
    await db.update(orders)
      .set({ 
        status: 'paid', 
        razorpayPaymentId: razorpay_payment_id, 
        razorpaySignature: razorpay_signature,
        updatedAt: new Date()
      })
      .where(eq(orders.id, razorpay_order_id));

    // 2. Fetch the order to get userId and plan
    const orderData = await db.select().from(orders).where(eq(orders.id, razorpay_order_id)).limit(1).then(res => res[0]);
    
    if (orderData && orderData.status === 'paid') {
      // 3. Upgrade user plan
      await db.update(users)
        .set({ 
          plan: orderData.plan,
          updatedAt: new Date(),
          // Optional: set planExpiresAt here if it's a monthly subscription (e.g., +30 days)
        })
        .where(eq(users.id, orderData.userId));
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to process successful payment:", error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
