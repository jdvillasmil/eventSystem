import { executeQuery } from "../data/DataBase.js";

export const Roles = {
    async list(ctx) {
        const { rows } = await executeQuery("Roles", "list");
        return { ok: true, data: rows };
    },

    async get(ctx, id) {
        const { rows } = await executeQuery("Roles", "get", [id]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Role not found" };
        return { ok: true, data: rows[0] };
    },

    async create(ctx, payload) {
        const { name, base_cost } = payload;
        
        // Basic validation
        if (!name) return { ok: false, code: "VALIDATION_ERROR", error: "Name is required" };
        if (base_cost === undefined || base_cost === null) return { ok: false, code: "VALIDATION_ERROR", error: "Base cost is required" };

        const { rows } = await executeQuery("Roles", "create", [name, base_cost]);
        return { ok: true, data: rows[0] };
    },

    async update(ctx, payload) {
        const { id, name, base_cost } = payload;
        const { rows } = await executeQuery("Roles", "update", [id, name, base_cost]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Role not found" };
        return { ok: true, data: rows[0] };
    },

    async delete(ctx, payload) {
        const { id } = payload;
        await executeQuery("Roles", "delete", [id]);
        return { ok: true };
    }
};
