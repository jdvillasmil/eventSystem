import { callTx } from '../api/client';

export const Staffing = {
    listByEvent: async (eventId) => {
        return callTx('Staffing.listByEvent', [eventId]);
    },
    assign: async (payload) => {
        return callTx('Staffing.assign', [payload]);
    },
    remove: async (payload) => {
        return callTx('Staffing.remove', [payload]);
    }
};
