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
        console.log('🔍 [Backend] Reports.eventFinancialDetail called with event_id:', event_id);
        const { rows } = await executeQuery("Reports", "eventFinancialDetail", [event_id]);
        console.log('📊 [Backend] Financial detail:', rows[0]);
        return { ok: true, data: rows[0] };
    },

    async eventAttendanceDetail(ctx, event_id) {
        console.log('🔍 [Backend] Reports.eventAttendanceDetail called with event_id:', event_id);
        const { rows } = await executeQuery("Reports", "eventAttendanceDetail", [event_id]);
        console.log('📊 [Backend] Attendance detail:', rows[0]);
        return { ok: true, data: rows[0] };
    },

    async globalSummary(ctx) {
        console.log('🔍 [Backend] Reports.globalSummary called');
        const { rows } = await executeQuery("Reports", "globalSummary");
        console.log('📊 [Backend] Global summary returned', rows.length, 'events');
        return { ok: true, data: rows };
    }
};
