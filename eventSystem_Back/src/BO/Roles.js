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
    }
};
