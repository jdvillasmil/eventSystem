import { callTx } from '../api/client';

export const Expenses = {
    list: async () => {
        return callTx('Expenses.list');
    },
    listByEvent: async (event_id) => {
        return callTx('Expenses.listByEvent', [event_id]);
    },
    get: async (id) => {
        return callTx('Expenses.get', [id]);
    },
    create: async (payload) => {
        return callTx('Expenses.create', [payload]);
    },
    update: async (payload) => {
        return callTx('Expenses.update', [payload]);
    },
    delete: async (payload) => {
        return callTx('Expenses.delete', [payload]);
    }
};
