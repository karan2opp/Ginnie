"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserPlan(userId: string, newPlan: 'free' | 'pro' | 'elite', newExpiration: string | null) {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  if (!email || email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  let expiresAt = null;
  if (newExpiration) {
    expiresAt = new Date(newExpiration);
  }

  await db.update(users)
    .set({ plan: newPlan, planExpiresAt: expiresAt })
    .where(eq(users.id, userId));

  revalidatePath("/admin");
  return { success: true };
}
