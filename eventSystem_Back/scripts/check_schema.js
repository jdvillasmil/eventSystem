import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
    try {
        const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'events'");
        console.log("Columns in events table:");
        res.rows.forEach(row => console.log(`${row.column_name} (${row.data_type})`));
    } catch (err) {
        console.error("Error checking schema:", err);
    } finally {
        pool.end();
    }
}

checkSchema();
