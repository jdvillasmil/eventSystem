import "dotenv/config.js";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setup() {
    const client = await pool.connect();
    try {
        console.log("🔌 Connected to database...");

        // 1. Locations (Centros/Lugares)
        await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL DEFAULT 0,
        address TEXT
      );
    `);
        console.log("✅ Table 'locations' ready.");

        // 2. Events (Datos del Evento)
        await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        location_id INTEGER REFERENCES locations(id),
        capacity INTEGER NOT NULL DEFAULT 0,
        created_by INTEGER, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Table 'events' ready.");

        // 3. Registrations (Registro de personas)
        await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        user_id INTEGER, -- Nullable if registering guests without account
        guest_name VARCHAR(255),
        guest_email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'REGISTERED', -- REGISTERED, CHECKED_IN, CANCELLED
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Table 'registrations' ready.");

        // 4. Reservations (Reservación del lugar)
        await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        location_id INTEGER REFERENCES locations(id),
        event_id INTEGER REFERENCES events(id),
        date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Table 'reservations' ready.");

        // Seed some data if empty
        const { rows: locs } = await client.query("SELECT count(*) FROM locations");
        if (parseInt(locs[0].count) === 0) {
            await client.query(`
            INSERT INTO locations (name, capacity, address) VALUES 
            ('Main Hall', 500, 'Building A'),
            ('Conference Room B', 50, 'Building B');
        `);
            console.log("🌱 Seeded locations.");
        }

    } catch (err) {
        console.error("❌ Error setting up database:", err);
    } finally {
        client.release();
        await pool.end();
        console.log("👋 Done.");
    }
}

setup();
