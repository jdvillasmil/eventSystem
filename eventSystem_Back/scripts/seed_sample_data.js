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

async function seedSampleData() {
    try {
        console.log('Seeding sample incomes and expenses...');

        // Get first event ID
        const eventsRes = await pool.query('SELECT id FROM events ORDER BY id LIMIT 1');
        if (eventsRes.rows.length === 0) {
            console.log('No events found. Please create an event first.');
            return;
        }

        const eventId = eventsRes.rows[0].id;
        console.log(`Using event ID: ${eventId}`);

        // Add sample incomes
        const incomes = [
            { description: 'Venta de boletos', amount: 5000, source: 'Tickets' },
            { description: 'Patrocinio Empresa A', amount: 3000, source: 'Sponsorship' },
            { description: 'Barra de bebidas', amount: 2500, source: 'Bar Sales' }
        ];

        for (const income of incomes) {
            await pool.query(
                'INSERT INTO incomes (event_id, description, amount, source) VALUES ($1, $2, $3, $4)',
                [eventId, income.description, income.amount, income.source]
            );
            console.log(`✅ Added income: ${income.description} - $${income.amount}`);
        }

        // Add sample expenses
        const expenses = [
            { description: 'Alquiler de local', amount: 1500, category: 'Venue' },
            { description: 'Decoración', amount: 800, category: 'Decoration' },
            { description: 'Equipo de sonido', amount: 1200, category: 'Equipment' },
            { description: 'Catering', amount: 2000, category: 'Food' }
        ];

        for (const expense of expenses) {
            await pool.query(
                'INSERT INTO expenses (event_id, description, amount, category) VALUES ($1, $2, $3, $4)',
                [eventId, expense.description, expense.amount, expense.category]
            );
            console.log(`✅ Added expense: ${expense.description} - $${expense.amount}`);
        }

        console.log('\n📊 Sample data seeded successfully!');
        console.log('Total Income: $10,500');
        console.log('Total Expenses: $5,500');
        console.log('You can now test the Reports page with real data.');
    } catch (err) {
        console.error('❌ Error seeding data:', err);
    } finally {
        await pool.end();
    }
}

seedSampleData();
