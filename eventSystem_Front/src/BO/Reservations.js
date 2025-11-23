import { callTx } from '../api/client';

export const Reservations = {
    /**
     * List reservations
     */
    list: async (payload = {}) => {
        return callTx('Reservations.list', [payload]);
    },

    /**
     * Create a reservation for a location
     * @param {object} payload - { location_id, event_id, date }
     */
    create: async (payload) => {
        return callTx('Reservations.create', [payload]);
    },

    /**
     * Cancel a reservation
     * @param {object} payload - { id }
     */
    cancel: async (payload) => {
        return callTx('Reservations.cancel', [payload]);
    },

    /**
     * Get available locations
     */
    getLocations: async (payload = {}) => {
        return callTx('Reservations.getLocations', [payload]);
    }
};
