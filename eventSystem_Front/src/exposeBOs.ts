import { Events } from './BO/Events';
import { Registrations } from './BO/Registrations';
import { Reservations } from './BO/Reservations';
import { Roles } from './BO/Roles';
import { Staffing } from './BO/Staffing';
import { Payments } from './BO/Payments';
import { Reports } from './BO/Reports';
import { Expenses } from './BO/Expenses';
import { Attendance } from './BO/Attendance';

// Expose BOs to window for manual testing
(window as any).Events = Events;
(window as any).Registrations = Registrations;
(window as any).Reservations = Reservations;
(window as any).Roles = Roles;
(window as any).Staffing = Staffing;
(window as any).Payments = Payments;
(window as any).Reports = Reports;
(window as any).Expenses = Expenses;
(window as any).Attendance = Attendance;

console.log("✅ Business Objects exposed to window!");
console.log("Try running these commands in the console:");
console.log("  await Events.list()");
console.log("  await Staffing.listByEvent(1)");
console.log("  await Reports.financialReport()");
console.log("  await Expenses.list()");
console.log("  await Attendance.listByEvent(1)");
