import { executeQuery } from "../data/DataBase.js";

export const Payments = {
    async listByEvent(ctx, event_id) {
        const { rows } = await executeQuery("Payments", "listByEvent", [event_id]);
        return { ok: true, data: rows };
    },

    async create(ctx, payload) {
        const { staffing_id, amount } = payload;

        if (!staffing_id || !amount) {
            return { ok: false, code: "VALIDATION_ERROR", error: "Missing required fields" };
        }

        const { rows } = await executeQuery("Payments", "create", [staffing_id, amount]);
        return { ok: true, data: rows[0] };
    },

    async pay(ctx, payload) {
        const { id } = payload;
        const { rows } = await executeQuery("Payments", "pay", [id]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Payment not found" };
        return { ok: true, data: rows[0] };
    }
};
