import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'add_ticket_sales_columns.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log("Running migration...");
        await pool.query(sql);
        console.log("Migration completed successfully.");
    } catch (err) {
        console.error("Error running migration:", err);
    } finally {
        pool.end();
    }
}

runMigration();
