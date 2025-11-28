import { executeQuery } from "../data/DataBase.js";
import fs from 'fs';
import path from 'path';

const logToFile = (message) => {
    try {
        const logPath = path.join(process.cwd(), 'backend_debug.log');
        fs.appendFileSync(logPath, new Date().toISOString() + ': ' + message + '\n');
    } catch (e) {
        console.error("Error writing to log file:", e);
    }
};

export const Registrations = {
    async register(ctx, payload) {
        const { event_id, guest_name, guest_email } = payload;
        const user_id = ctx.session?.userId || null;

        if (!event_id) return { ok: false, code: "VALIDATION_ERROR", error: "Event ID is required" };

        const { rows } = await executeQuery("Registrations", "register", [event_id, user_id, guest_name, guest_email]);
        return { ok: true, data: rows[0] };
    },

    async listAttendees(ctx, payload) {
        const { event_id } = payload;
        const { rows } = await executeQuery("Registrations", "listAttendees", [event_id]);
        return { ok: true, data: rows };
    },

    async checkIn(ctx, payload) {
        const { id } = payload;
        const { rows } = await executeQuery("Registrations", "checkIn", [id]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Registration not found" };
        return { ok: true, data: rows[0] };
    },

    async collectPayment(ctx, payload) {
        logToFile(`[Registrations.collectPayment] Payload: ${JSON.stringify(payload)}`);
        const { id, amount, event_id, guest_name } = payload;

        // 1. Update registration status
        logToFile("[Registrations.collectPayment] Updating registration status...");
        const { rows: regRows } = await executeQuery("Registrations", "collectPayment", [id, amount]);
        if (regRows.length === 0) {
            logToFile(`[Registrations.collectPayment] Registration not found for id: ${id}`);
            return { ok: false, code: "NOT_FOUND", error: "Registration not found" };
        }
        logToFile(`[Registrations.collectPayment] Registration updated: ${JSON.stringify(regRows[0])}`);

        // 2. Record income
        let targetEventId = event_id;
        let targetDesc = `Ticket sale for ${guest_name}`;

        logToFile(`[Registrations.collectPayment] Recording income for event: ${targetEventId}`);
        try {
            await executeQuery("Registrations", "recordIncome", [targetEventId, targetDesc, amount]);
            logToFile("[Registrations.collectPayment] Income recorded successfully");
        } catch (error) {
            logToFile(`[Registrations.collectPayment] Error recording income: ${error.message}`);
            throw error; // Re-throw to be caught by global handler
        }

        return { ok: true, data: regRows[0] };
    },

    async cancel(ctx, payload) {
        const { id } = payload;
        const { rows } = await executeQuery("Registrations", "cancel", [id]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Registration not found" };
        return { ok: true, data: rows[0] };
    }
};
