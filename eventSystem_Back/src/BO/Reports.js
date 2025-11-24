import { executeQuery } from "../data/DataBase.js";

export const Reports = {
    async eventSummary(ctx, event_id) {
        const { rows } = await executeQuery("Reports", "eventSummary", [event_id]);
        return { ok: true, data: rows[0] };
    },

    async financialReport(ctx) {
        const { rows } = await executeQuery("Reports", "financialReport");
        return { ok: true, data: rows };
    },

    async eventFinancialDetail(ctx, event_id) {
        const { rows } = await executeQuery("Reports", "eventFinancialDetail", [event_id]);
        return { ok: true, data: rows[0] };
    },

    async eventAttendanceDetail(ctx, event_id) {
        const { rows } = await executeQuery("Reports", "eventAttendanceDetail", [event_id]);
        return { ok: true, data: rows[0] };
    },

    async globalSummary(ctx) {
        const { rows } = await executeQuery("Reports", "globalSummary");
        return { ok: true, data: rows };
    }
};
