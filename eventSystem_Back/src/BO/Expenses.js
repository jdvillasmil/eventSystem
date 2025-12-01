import { executeQuery } from "../data/DataBase.js";

export const Expenses = {
    async list(ctx) {
        const { rows } = await executeQuery("Expenses", "list");
        return { ok: true, data: rows };
    },

    async listByEvent(ctx, event_id) {
        const { rows } = await executeQuery("Expenses", "listByEvent", [event_id]);
        return { ok: true, data: rows };
    },

    async get(ctx, id) {
        const { rows } = await executeQuery("Expenses", "get", [id]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Expense not found" };
        return { ok: true, data: rows[0] };
    },

    async create(ctx, payload) {
        const { event_id, description, amount, category } = payload;

        // Basic validation
        if (!description) return { ok: false, code: "VALIDATION_ERROR", error: "Description is required" };
        if (amount === undefined || amount === null) return { ok: false, code: "VALIDATION_ERROR", error: "Amount is required" };

        const { rows } = await executeQuery("Expenses", "create", [event_id, description, amount, category || null]);
        return { ok: true, data: rows[0] };
    },

    async update(ctx, payload) {
        const { id, event_id, description, amount, category } = payload;
        const { rows } = await executeQuery("Expenses", "update", [id, event_id, description, amount, category || null]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Expense not found" };
        return { ok: true, data: rows[0] };
    },

    async delete(ctx, payload) {
        const { id } = payload;
        await executeQuery("Expenses", "delete", [id]);
        return { ok: true };
    }
};
