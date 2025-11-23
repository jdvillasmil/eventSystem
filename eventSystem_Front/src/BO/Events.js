import { callTx } from '../api/client';

export const Events = {
    /**
     * List all events
     */
    list: async () => {
        return callTx('Events.list');
    },

    /**
     * Get event by ID
     * @param {number} id 
     */
    get: async (id) => {
        return callTx('Events.get', [id]);
    },

    /**
     * Create a new event
     * @param {object} payload 
     */
    create: async (payload) => {
        return callTx('Events.create', [payload]);
    },

    /**
     * Update an event
     * @param {object} payload - Must include id
     */
    update: async (payload) => {
        return callTx('Events.update', [payload]);
    },

    /**
     * Delete an event
     * @param {object} payload - Must include id
     */
    delete: async (payload) => {
        return callTx('Events.delete', [payload]);
    }
};
