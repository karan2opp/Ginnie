import "dotenv/config";
import { db } from "./db/index.js";
import { connections } from "./db/schema/connection.js";

async function run() {
  try {
    const all = await db.select().from(connections);
    console.log("Connections:", JSON.stringify(all, null, 2));
  } catch(e) {
    console.error("Error:", e);
  }
  process.exit(0);
}

run();
