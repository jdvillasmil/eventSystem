import { executeQuery } from "../data/DataBase.js";

export const Attendance = {
    async listByEvent(ctx, event_id) {
        const { rows } = await executeQuery("Attendance", "listByEvent", [event_id]);
        return { ok: true, data: rows };
    },

    async markAttendance(ctx, payload) {
        const { id } = payload;
        const { rows } = await executeQuery("Attendance", "markAttendance", [id]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Registration not found" };
        return { ok: true, data: rows[0] };
    }
};
