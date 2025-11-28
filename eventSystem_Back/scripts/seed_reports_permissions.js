import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const newMethods = [
    { resource: 'Reports', action: 'eventFinancialDetail' },
    { resource: 'Reports', action: 'eventAttendanceDetail' },
    { resource: 'Reports', action: 'globalSummary' }
];

async function seedReportsPermissions() {
    try {
        console.log('Adding Reports permissions...');

        const adminProfileId = 1;

        for (const method of newMethods) {
            let methodId;
            const methodRes = await pool.query(
                'SELECT id FROM methods WHERE resource = $1 AND action = $2',
                [method.resource, method.action]
            );

            if (methodRes.rows.length > 0) {
                methodId = methodRes.rows[0].id;
                console.log(`Method exists: ${method.resource}.${method.action} (ID: ${methodId})`);
            } else {
                const insertRes = await pool.query(
                    'INSERT INTO methods (resource, action) VALUES ($1, $2) RETURNING id',
                    [method.resource, method.action]
                );
                methodId = insertRes.rows[0].id;
                console.log(`✅ Inserted method: ${method.resource}.${method.action} (ID: ${methodId})`);
            }

            const permRes = await pool.query(
                'SELECT * FROM profile_method_permissions WHERE profile_id = $1 AND method_id = $2',
                [adminProfileId, methodId]
            );

            if (permRes.rows.length === 0) {
                await pool.query(
                    'INSERT INTO profile_method_permissions (profile_id, method_id, allowed) VALUES ($1, $2, TRUE)',
                    [adminProfileId, methodId]
                );
                console.log(`✅ Granted permission for ${method.resource}.${method.action}`);
            } else {
                console.log(`Permission already exists for ${method.resource}.${method.action}`);
            }
        }

        console.log('\n✅ Reports permissions seeded successfully!');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await pool.end();
    }
}

seedReportsPermissions();
