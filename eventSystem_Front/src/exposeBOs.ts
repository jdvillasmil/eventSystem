import { Events } from './BO/Events';
import { Registrations } from './BO/Registrations';
import { Reservations } from './BO/Reservations';
import { Roles } from './BO/Roles';
import { Staffing } from './BO/Staffing';
import { Payments } from './BO/Payments';
import { Reports } from './BO/Reports';

// Expose BOs to window for manual testing
(window as any).Events = Events;
(window as any).Registrations = Registrations;
(window as any).Reservations = Reservations;
(window as any).Roles = Roles;
(window as any).Staffing = Staffing;
(window as any).Payments = Payments;
(window as any).Reports = Reports;

console.log("✅ Business Objects exposed to window!");
console.log("Try running these commands in the console:");
console.log("  await Events.list()");
console.log("  await Staffing.listByEvent(1)");
console.log("  await Reports.financialReport()");
