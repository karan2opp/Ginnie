import "dotenv/config";
import { pool } from "./db/index.js";
pool.query("SELECT id, tenant_id, integration_id, config FROM corsair_accounts LIMIT 5").then(res => {
  console.log(res.rows);
  process.exit(0);
});
