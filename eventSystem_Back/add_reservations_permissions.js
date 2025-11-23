import "dotenv/config.js";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addReservationsPermissions() {
    const client = await pool.connect();
    try {
        console.log("🔌 Adding Reservations methods and permissions...");

        const methods = [
            { resource: 'reservations', action: 'list' },
            { resource: 'reservations', action: 'create' },
            { resource: 'reservations', action: 'cancel' },
            { resource: 'reservations', action: 'getLocations' }
        ];

        for (const method of methods) {
            // Check if method exists
            const existing = await client.query(
                "SELECT id FROM methods WHERE resource = $1 AND action = $2",
                [method.resource, method.action]
            );

            let methodId;
            if (existing.rows.length > 0) {
                methodId = existing.rows[0].id;
                console.log(`✅ Method ${method.resource}.${method.action} already exists (ID: ${methodId})`);
            } else {
                // Insert method
                const result = await client.query(
                    "INSERT INTO methods (resource, action) VALUES ($1, $2) RETURNING id",
                    [method.resource, method.action]
                );
                methodId = result.rows[0].id;
                console.log(`✨ Created method ${method.resource}.${method.action} (ID: ${methodId})`);
            }

            // Grant permission to admin profile (profile_id = 1)
            const permExists = await client.query(
                "SELECT * FROM profile_method_permissions WHERE profile_id = 1 AND method_id = $1",
                [methodId]
            );

            if (permExists.rows.length === 0) {
                await client.query(
                    "INSERT INTO profile_method_permissions (profile_id, method_id, allowed) VALUES (1, $1, TRUE)",
                    [methodId]
                );
                console.log(`   🔓 Permission granted to admin`);
            } else {
                console.log(`   ✓ Permission already granted`);
            }
        }

        console.log("\n🎉 Done! Reservations methods and permissions are ready.");
    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

addReservationsPermissions();
