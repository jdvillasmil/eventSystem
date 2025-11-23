import { Events } from './BO/Events';
import { Registrations } from './BO/Registrations';
import { Reservations } from './BO/Reservations';

// Expose BOs to window for manual testing
(window as any).Events = Events;
(window as any).Registrations = Registrations;
(window as any).Reservations = Reservations;

console.log("✅ Business Objects exposed to window!");
console.log("Try running these commands in the console:");
console.log("  await Events.list()");
console.log("  await Registrations.listAttendees(1)"); // Example eventId
console.log("  await Reservations.list()");
