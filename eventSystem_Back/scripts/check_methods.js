import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkMethods() {
    try {
        const res = await pool.query("SELECT m.id, m.resource, m.action FROM methods m WHERE m.resource = 'Registrations' ORDER BY m.action");
        console.log("Methods for Registrations:");
        res.rows.forEach(row => console.log(`${row.id}: ${row.resource}.${row.action}`));
    } catch (err) {
        console.error("Error checking methods:", err);
    } finally {
        pool.end();
    }
}

checkMethods();
