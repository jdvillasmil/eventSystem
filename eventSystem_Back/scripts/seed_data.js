import "dotenv/config.js";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log("🌱 Seeding database with realistic data...");

        // 1. Clear existing data (optional, but good for clean state)
        // await client.query("TRUNCATE events, registrations, reservations CASCADE"); 

        // 2. Ensure Locations exist
        // We already seeded some in setup_db, but let's make sure we have specific ones
        const locRes = await client.query(`
      INSERT INTO locations (name, capacity, address) VALUES 
      ('Gran Salón de Eventos', 1000, 'Av. Principal 123'),
      ('Auditorio Tech', 200, 'Edificio de Ciencias, Piso 2'),
      ('Jardín Central', 500, 'Zona Verde Norte')
      ON CONFLICT DO NOTHING RETURNING id;
    `);

        // Get IDs (either new or existing) - simplifying by querying
        const { rows: locations } = await client.query("SELECT * FROM locations");
        const mainHall = locations.find(l => l.name.includes('Gran')) || locations[0];
        const techAuditorium = locations.find(l => l.name.includes('Tech')) || locations[1];

        // 3. Create Realistic Events
        const eventsData = [
            {
                title: "Conferencia de Inteligencia Artificial",
                description: "Un evento sobre el futuro de la IA generativa.",
                date: "2025-11-25 09:00:00",
                location_id: techAuditorium.id,
                capacity: 150,
                created_by: 1
            },
            {
                title: "Concierto de Rock en Vivo",
                description: "Bandas locales e internacionales.",
                date: "2025-12-10 20:00:00",
                location_id: mainHall.id,
                capacity: 800,
                created_by: 1
            },
            {
                title: "Workshop de React y Node.js",
                description: "Aprende a construir aplicaciones web completas.",
                date: "2025-11-30 14:00:00",
                location_id: techAuditorium.id,
                capacity: 50,
                created_by: 1
            }
        ];

        for (const evt of eventsData) {
            const res = await client.query(
                `INSERT INTO events (title, description, date, location_id, capacity, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [evt.title, evt.description, evt.date, evt.location_id, evt.capacity, evt.created_by]
            );
            console.log(`✅ Created event: ${evt.title}`);

            // Add some registrations to this event
            const eventId = res.rows[0].id;
            await client.query(
                `INSERT INTO registrations (event_id, user_id, guest_name, guest_email) VALUES 
         ($1, NULL, 'Juan Perez', 'juan@test.com'),
         ($1, NULL, 'Maria Rodriguez', 'maria@test.com')`,
                [eventId]
            );
        }

        console.log("✅ Database seeded successfully!");

    } catch (err) {
        console.error("❌ Error seeding database:", err);
    } finally {
        client.release();
        await pool.end();
        console.log("👋 Done.");
    }
}

seed();
