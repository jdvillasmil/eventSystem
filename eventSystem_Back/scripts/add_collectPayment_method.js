import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function addCollectPaymentMethod() {
    try {
        // 1. Insert the method
        const insertMethod = await pool.query(
            "INSERT INTO methods (resource, action) VALUES ($1, $2) RETURNING id",
            ['registrations', 'collectPayment']
        );
        const methodId = insertMethod.rows[0].id;
        console.log(`✓ Method 'Registrations.collectPayment' added with ID: ${methodId}`);

        // 2. Grant permission to admin profile (profile_id = 1)
        await pool.query(
            "INSERT INTO profile_method_permissions (profile_id, method_id, allowed) VALUES ($1, $2, $3)",
            [1, methodId, true]
        );
        console.log(`✓ Permission granted to admin profile (ID: 1)`);

        console.log("\n✅ collectPayment method successfully registered!");
    } catch (err) {
        console.error("❌ Error adding method:", err);
    } finally {
        pool.end();
    }
}

addCollectPaymentMethod();
