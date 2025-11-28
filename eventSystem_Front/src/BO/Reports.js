import { callTx } from '../api/client';

export const Reports = {
    eventSummary(event_id) {
        return callTx('Reports.eventSummary', [event_id]);
    },
    financialReport() {
        return callTx('Reports.financialReport');
    },
    eventFinancialDetail(event_id) {
        return callTx('Reports.eventFinancialDetail', [event_id]);
    },
    eventAttendanceDetail(event_id) {
        return callTx('Reports.eventAttendanceDetail', [event_id]);
    },
    globalSummary() {
        return callTx('Reports.globalSummary');
    }
};
