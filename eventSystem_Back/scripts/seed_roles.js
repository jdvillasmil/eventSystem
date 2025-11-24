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

const roles = [
    { name: 'Mesero', base_cost: 50 },
    { name: 'Bartender', base_cost: 60 },
    { name: 'Protocolo', base_cost: 45 },
    { name: 'DJ', base_cost: 100 },
    { name: 'Conserje', base_cost: 40 },
    { name: 'Seguridad', base_cost: 55 },
    { name: 'Animador', base_cost: 80 },
    { name: 'Fotógrafo', base_cost: 90 }
];

async function seedRoles() {
    try {
        console.log('Seeding roles...');

        for (const role of roles) {
            // Check if role exists to avoid duplicates
            const checkRes = await pool.query('SELECT id FROM roles WHERE name = $1', [role.name]);

            if (checkRes.rows.length === 0) {
                await pool.query('INSERT INTO roles (name, base_cost) VALUES ($1, $2)', [role.name, role.base_cost]);
                console.log(`Inserted role: ${role.name}`);
            } else {
                console.log(`Role already exists: ${role.name}`);
            }
        }

        console.log('Roles seeding completed successfully.');
    } catch (err) {
        console.error('Error seeding roles:', err);
    } finally {
        await pool.end();
    }
}

seedRoles();
