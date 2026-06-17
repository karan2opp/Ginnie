import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { connections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ChatClient } from "./ChatClient";

export default async function ChatPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const connection = await db.query.connections.findFirst({
    where: eq(connections.userId, userId),
  });

  if (!connection?.isActive) {
    redirect("/connect");
  }

  const user = await currentUser();
  const userName = user?.firstName || "";

  return <ChatClient userName={userName} />;
}
