import { executeQuery } from "../data/DataBase.js";

export const Reservations = {
    async list(ctx, payload = {}) {
        const { rows } = await executeQuery("Reservations", "list");
        return { ok: true, data: rows };
    },

    async create(ctx, payload) {
        const { location_id, event_id, date } = payload;

        if (!location_id || !date) return { ok: false, code: "VALIDATION_ERROR", error: "Location and date are required" };

        const { rows } = await executeQuery("Reservations", "create", [location_id, event_id, date]);
        return { ok: true, data: rows[0] };
    },

    async cancel(ctx, payload) {
        const { id } = payload;
        const { rows } = await executeQuery("Reservations", "cancel", [id]);
        if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Reservation not found" };
        return { ok: true, data: rows[0] };
    },

    async getLocations(ctx, payload = {}) {
        const { rows } = await executeQuery("Reservations", "getLocations");
        return { ok: true, data: rows };
    }
};
