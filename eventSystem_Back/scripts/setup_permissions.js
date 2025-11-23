import "dotenv/config.js";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const NEW_METHODS = [
    { object: "Events", method: "list" },
    { object: "Events", method: "get" },
    { object: "Events", method: "create" },
    { object: "Events", method: "update" },
    { object: "Events", method: "delete" },
    { object: "Registrations", method: "register" },
    { object: "Registrations", method: "listAttendees" },
    { object: "Registrations", method: "checkIn" },
    { object: "Registrations", method: "cancel" },
    { object: "Reservations", method: "list" },
    { object: "Reservations", method: "create" },
    { object: "Reservations", method: "cancel" },
    { object: "Reservations", method: "getLocations" },
];

async function setupPermissions() {
    const client = await pool.connect();
    try {
        console.log("🔌 Connected to database...");

        // 1. Ensure 'methods' table exists (it should, but just in case)
        // Assuming it exists because Auth works.

        // 2. Insert methods
        for (const item of NEW_METHODS) {
            // Check if exists
            const { rows } = await client.query(
                "SELECT id FROM methods WHERE resource = $1 AND action = $2",
                [item.object, item.method]
            );

            let methodId;
            if (rows.length > 0) {
                methodId = rows[0].id;
                console.log(`🔹 Method ${item.object}.${item.method} already exists (ID: ${methodId})`);
            } else {
                const res = await client.query(
                    "INSERT INTO methods (resource, action) VALUES ($1, $2) RETURNING id",
                    [item.object, item.method]
                );
                methodId = res.rows[0].id;
                console.log(`✅ Inserted method ${item.object}.${item.method} (ID: ${methodId})`);
            }

            // 3. Grant permission to Profile 1 (Admin)
            const { rows: permRows } = await client.query(
                "SELECT * FROM profile_method_permissions WHERE profile_id = 1 AND method_id = $1",
                [methodId]
            );

            if (permRows.length === 0) {
                await client.query(
                    "INSERT INTO profile_method_permissions (profile_id, method_id, allowed) VALUES (1, $1, TRUE)",
                    [methodId]
                );
                console.log(`   🔓 Granted permission to Profile 1`);
            } else {
                console.log(`   🔓 Permission already granted`);
            }
        }

    } catch (err) {
        console.error("❌ Error setting up permissions:", err);
    } finally {
        client.release();
        await pool.end();
        console.log("👋 Done.");
    }
}

setupPermissions();
