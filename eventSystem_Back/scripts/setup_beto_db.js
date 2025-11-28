import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setup() {
    const client = await pool.connect();
    try {
        console.log("Starting database setup for Beto's modules...");

        // 1. Roles (Renny's module, but needed for Staffing)
        console.log("Creating table: roles");
        await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        base_cost DECIMAL(10, 2) NOT NULL DEFAULT 0
      );
    `);

        // Insert some default roles if empty
        const { rows: roleRows } = await client.query("SELECT COUNT(*) FROM roles");
        if (parseInt(roleRows[0].count) === 0) {
            console.log("Seeding default roles...");
            await client.query(`
        INSERT INTO roles (name, base_cost) VALUES
        ('Mesero', 50.00),
        ('Seguridad', 60.00),
        ('Bartender', 70.00),
        ('DJ', 150.00),
        ('Animador', 80.00)
      `);
        }

        // 2. Staffing (Beto)
        console.log("Creating table: staffing");
        await client.query(`
      CREATE TABLE IF NOT EXISTS staffing (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        person_name VARCHAR(100) NOT NULL,
        role_id INTEGER NOT NULL REFERENCES roles(id),
        agreed_cost DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 3. Payments (Beto)
        console.log("Creating table: payments");
        await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        staffing_id INTEGER NOT NULL REFERENCES staffing(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED'))
      );
    `);

        console.log("Database setup completed successfully!");
    } catch (err) {
        console.error("Error setting up database:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

setup();
