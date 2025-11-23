import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { PrivateRoute, PublicRoute } from "./routes/AuthRoutes";
import EventsPage from "./pages/EventsPage";
import ReservationsPage from "./pages/ReservationsPage";

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
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      {/* cuando hagamos la pantalla de eventos la protegemos igual */}
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

      {/* por defecto mandamos al dashboard (que a su vez manda al login si no hay sesion) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
