import "dotenv/config";
import { db } from "./db/index.js";
import { users } from "./db/schema/user.js";

async function run() {
  try {
    const all = await db.select().from(users);
    console.log("Users:", JSON.stringify(all, null, 2));
  } catch(e) {
    console.error("Error:", e);
  }
  process.exit(0);
}

run();
