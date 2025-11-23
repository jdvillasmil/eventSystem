import "dotenv/config.js";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function test() {
    try {
        // Check if methods exist
        const methods = await pool.query("SELECT * FROM methods WHERE resource = 'reservations'");
        console.log("Reservations methods in DB:", methods.rows);

        // Check if locations exist
        const locations = await pool.query("SELECT * FROM locations");
        console.log("\nLocations in DB:", locations.rows);

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await pool.end();
    }
}

test();
