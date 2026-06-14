import { db } from "@/db";
import { connections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedClient } from "@/lib/google";

export async function getGoogleClient(userId: string) {
  const connection = await db.query.connections.findFirst({
    where: eq(connections.userId, userId),
  });

  if (!connection) return null;

  return getAuthenticatedClient(
    connection.accessToken,
    connection.refreshToken,
  );
}
