import { callTx } from '../api/client';

export const Registrations = {
    /**
     * Register a person to an event
     * @param {object} payload - { event_id, guest_name, guest_email }
     */
    register: async (payload) => {
        return callTx('Registrations.register', [payload]);
    },

    /**
     * List attendees for an event
     * @param {object} payload - { event_id }
     */
    listAttendees: async (payload) => {
        return callTx('Registrations.listAttendees', [payload]);
    },

    /**
     * Check in an attendee
     * @param {object} payload - { id }
     */
    checkIn: async (payload) => {
        return callTx('Registrations.checkIn', [payload]);
    },

    /**
     * Cancel registration
     * @param {object} payload - { id }
     */
    cancel: async (payload) => {
        return callTx('Registrations.cancel', [payload]);
    }
};
