import { executeQuery } from "../data/DataBase.js";

export const Staffing = {
    async listByEvent(ctx, event_id) {
        const { rows } = await executeQuery("Staffing", "listByEvent", [event_id]);
        return { ok: true, data: rows };
    },

    async assign(ctx, payload) {
        const { event_id, person_name, role_id, agreed_cost } = payload;

        if (!event_id || !person_name || !role_id || agreed_cost === undefined) {
            return { ok: false, code: "VALIDATION_ERROR", error: "Missing required fields" };
        }

        const { rows } = await executeQuery("Staffing", "assign", [event_id, person_name, role_id, agreed_cost]);
        return { ok: true, data: rows[0] };
    },

    async remove(ctx, payload) {
        const { id } = payload;
        await executeQuery("Staffing", "remove", [id]);
        return { ok: true };
    }
};
