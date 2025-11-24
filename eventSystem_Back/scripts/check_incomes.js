import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkIncomes() {
    try {
        // Get Santa Teresa event ID
        const eventRes = await pool.query("SELECT id, title, ticket_price FROM events WHERE title = 'Santa Teresa'");
        if (eventRes.rows.length === 0) {
            console.log("Event 'Santa Teresa' not found");
            return;
        }

        const event = eventRes.rows[0];
        console.log(`\nEvent: ${event.title} (ID: ${event.id})`);
        console.log(`Ticket Price: $${event.ticket_price}`);

        // Check incomes
        console.log("\n--- Incomes for this event ---");
        const incomesRes = await pool.query("SELECT * FROM incomes WHERE event_id = $1 ORDER BY created_at", [event.id]);
        console.log(`Total income records: ${incomesRes.rows.length}`);
        incomesRes.rows.forEach((income, idx) => {
            console.log(`${idx + 1}. ID: ${income.id}, Amount: $${income.amount}, Description: ${income.description}, Source: ${income.source}`);
        });

        const totalIncome = incomesRes.rows.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);
        console.log(`\nTotal Income: $${totalIncome}`);

        // Check registrations
        console.log("\n--- Registrations for this event ---");
        const regsRes = await pool.query("SELECT id, guest_name, payment_status, amount_paid FROM registrations WHERE event_id = $1", [event.id]);
        console.log(`Total registrations: ${regsRes.rows.length}`);
        regsRes.rows.forEach((reg, idx) => {
            console.log(`${idx + 1}. ${reg.guest_name}: ${reg.payment_status}, Amount Paid: $${reg.amount_paid || 0}`);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

checkIncomes();
