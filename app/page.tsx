import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  // If the user is already signed in, redirect them to the connect route
  // to ensure their Google Account is integrated before proceeding to chat.
  if (userId) {
    redirect("/connect");
  }

  // Otherwise, if they are not logged in, redirect to sign-up.
  redirect("/sign-up");
}
