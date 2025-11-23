import { executeQuery } from "../data/DataBase.js";

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

    async cancel(ctx, payload) {
        const { id } = payload;
        const { rows } = await executeQuery("Registrations", "cancel", [id]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Registration not found" };
        return { ok: true, data: rows[0] };
    }
};
