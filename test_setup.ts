import "dotenv/config";
import { pool } from "./db/index.js";
import { corsair } from "./corsair.js";
import { setupCorsair } from "corsair";

async function main() {
  await pool.query(`UPDATE corsair_integrations SET dek = NULL`);
  console.log("DEKs set to NULL. Running setupCorsair...");
  try {
    const out = await setupCorsair(corsair, { tenantId: "test_tenant" });
    console.log(out);
  } catch (e) {
    console.error("setupCorsair failed:", e);
  }
  process.exit(0);
}
main();
