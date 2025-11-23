import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

let QUERIES_CACHE = null;

function loadQueriesOnce() {
  if (QUERIES_CACHE) return QUERIES_CACHE;
  const abs = path.resolve(process.cwd(), "configs/queries.json");
  const raw = fs.readFileSync(abs, "utf8");
  QUERIES_CACHE = JSON.parse(raw);
  return QUERIES_CACHE;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function executeQuery(schema, id, params = []) {
  try {
    const qmap = loadQueriesOnce();
    const entry = qmap?.[schema]?.[id];
    if (!entry?.sql) {
      const err = new Error(`query not found: ${schema}.${id}`);
      err.code = "QUERY_NOT_FOUND";
      throw err;
    }
    const { rows } = await pool.query(entry.sql, params);
    return { rows };
  } catch (err) {
    err.code = err.code || "DB_ERROR";
    throw err;
  }
}

export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const res = await fn(client);
    await client.query("COMMIT");
    return res;
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch (_) {}
    err.code = err.code || "DB_TX_ERROR";
    throw err;
  } finally {
    client.release();
  }
}