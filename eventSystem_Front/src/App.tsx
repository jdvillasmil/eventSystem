import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { PrivateRoute, PublicRoute } from "./routes/AuthRoutes";
import EventsPage from "./pages/EventsPage";
import ReservationsPage from "./pages/ReservationsPage";
import StaffingPage from "./pages/StaffingPage";
import PaymentsPage from "./pages/PaymentsPage";
import ReportsPage from "./pages/ReportsPage";
import RolesPage from "./pages/RolesPage";
import ExpensesPage from "./pages/ExpensesPage";
import AttendancePage from "./pages/AttendancePage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      {/* Protected routes */}
      <Route
        path="/events"
        element={
          <PrivateRoute>
            <EventsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <PrivateRoute>
            <ReservationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/staffing"
        element={
          <PrivateRoute>
            <StaffingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <PrivateRoute>
            <PaymentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <PrivateRoute>
            <RolesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <PrivateRoute>
            <ExpensesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <AttendancePage />
          </PrivateRoute>
        }
      />

      {/* Default redirect to events */}
      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
};

export default App;
