import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChatClient } from "./ChatClient";

export default async function ChatPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const userName = user?.firstName || "";

  return <ChatClient userName={userName} />;
}
