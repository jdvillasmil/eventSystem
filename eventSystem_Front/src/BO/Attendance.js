import { callTx } from '../api/client';

export const Attendance = {
    listByEvent: async (event_id) => {
        return callTx('Attendance.listByEvent', [event_id]);
    },
    markAttendance: async (payload) => {
        return callTx('Attendance.markAttendance', [payload]);
    }
};
