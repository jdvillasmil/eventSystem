import { callTx } from '../api/client';

export const Payments = {
    listByEvent: async (eventId) => {
        return callTx('Payments.listByEvent', [eventId]);
    },
    create: async (payload) => {
        return callTx('Payments.create', [payload]);
    },
    pay: async (payload) => {
        return callTx('Payments.pay', [payload]);
    }
};
