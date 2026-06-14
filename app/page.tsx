import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  // If the user is already signed in, redirect them to a protected route (like /chat)
  // so Clerk doesn't keep bouncing them back here.
  if (userId) {
    redirect("/chat");
  }

  // Otherwise, if they are not logged in, redirect to sign-up.
  redirect("/sign-up");
}
