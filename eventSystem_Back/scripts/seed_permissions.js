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
    // Roles
    { resource: 'Roles', action: 'list' },
    { resource: 'Roles', action: 'get' },
    // Staffing
    { resource: 'Staffing', action: 'listByEvent' },
    { resource: 'Staffing', action: 'assign' },
    { resource: 'Staffing', action: 'remove' },
    // Payments
    { resource: 'Payments', action: 'listByEvent' },
    { resource: 'Payments', action: 'create' },
    { resource: 'Payments', action: 'pay' },
    // Reports
    { resource: 'Reports', action: 'eventSummary' },
    { resource: 'Reports', action: 'financialReport' },
    // Reservations (if missing)
    { resource: 'Reservations', action: 'list' },
    { resource: 'Reservations', action: 'create' },
    { resource: 'Reservations', action: 'cancel' },
    { resource: 'Reservations', action: 'getLocations' },
    // Registrations (if missing)
    { resource: 'Registrations', action: 'register' },
    { resource: 'Registrations', action: 'listAttendees' },
    { resource: 'Registrations', action: 'checkIn' },
    { resource: 'Registrations', action: 'cancel' },
    // Events (if missing)
    { resource: 'Events', action: 'list' },
    { resource: 'Events', action: 'get' },
    { resource: 'Events', action: 'create' },
    { resource: 'Events', action: 'update' },
    { resource: 'Events', action: 'delete' }
];

async function seedPermissions() {
    try {
        console.log('Seeding permissions...');

        // 1. Get Admin Profile ID (assuming it's 1, but let's check)
        // In this system, we usually assume profile_id 1 is Admin.
        const adminProfileId = 1;

        for (const method of newMethods) {
            // 2. Insert method if not exists
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
                console.log(`Inserted method: ${method.resource}.${method.action} (ID: ${methodId})`);
            }

            // 3. Grant permission to Admin
            const permRes = await pool.query(
                'SELECT * FROM profile_method_permissions WHERE profile_id = $1 AND method_id = $2',
                [adminProfileId, methodId]
            );

            if (permRes.rows.length === 0) {
                await pool.query(
                    'INSERT INTO profile_method_permissions (profile_id, method_id, allowed) VALUES ($1, $2, TRUE)',
                    [adminProfileId, methodId]
                );
                console.log(`Granted permission for ${method.resource}.${method.action} to Profile ${adminProfileId}`);
            } else {
                console.log(`Permission already exists for ${method.resource}.${method.action}`);
            }
        }

        console.log('Permissions seeding completed successfully.');
    } catch (err) {
        console.error('Error seeding permissions:', err);
    } finally {
        await pool.end();
    }
}

seedPermissions();
