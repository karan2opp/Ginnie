import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema/emails";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const prioritySchema = z.object({
  priority: z.enum(["urgent", "primary", "normal"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { priority } = prioritySchema.parse(body);

    const { id } = await params;

    await db.update(emails)
      .set({ 
        priority, 
        manualPriority: true 
      })
      .where(
        and(
          eq(emails.id, id),
          eq(emails.userId, userId)
        )
      );

    return NextResponse.json({ success: true, priority });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }
    console.error("[EMAIL_PRIORITY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
