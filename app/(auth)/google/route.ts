import { getGoogleAuthUrl } from "@/lib/google";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/callback/google`;

  const url = getGoogleAuthUrl(redirectUri);
  return redirect(url);
}
