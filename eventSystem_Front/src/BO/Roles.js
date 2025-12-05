import { callTx } from '../api/client';

export const Roles = {
    list: async () => {
        return callTx('Roles.list');
    },
    get: async (id) => {
        return callTx('Roles.get', [id]);
    },
    create: async (payload) => {
        return callTx('Roles.create', [payload]);
    },
    update: async (payload) => {
        return callTx('Roles.update', [payload]);
    },
    delete: async (payload) => {
        return callTx('Roles.delete', [payload]);
    }
};
