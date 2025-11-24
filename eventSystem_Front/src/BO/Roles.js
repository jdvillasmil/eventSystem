import { callTx } from '../api/client';

export const Roles = {
    list: async () => {
        return callTx('Roles.list');
    },
    get: async (id) => {
        return callTx('Roles.get', [id]);
    }
};
