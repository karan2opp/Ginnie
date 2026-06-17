import "dotenv/config";
import { db } from "./db/index";
import { connections } from "./db/schema";
import { eq } from "drizzle-orm";

async function run() {
  try {
    const res = await db.query.connections.findFirst({
        where: eq(connections.userId, "user_3F3vwlTVZ7C0FDuzxRQRAQI1ULF"),
    });
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
