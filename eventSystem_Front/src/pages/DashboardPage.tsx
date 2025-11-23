import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Import BOs (ignoring type checks for now as they are JS files)
// @ts-ignore
import { Events } from "../BO/Events";
// @ts-ignore
import { Registrations } from "../BO/Registrations";
// @ts-ignore
import { Reservations } from "../BO/Reservations";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [output, setOutput] = useState<string>("Click a button to test...");

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const runTest = async (name: string, fn: () => Promise<any>) => {
    setOutput(`Running ${name}...`);
    try {
      const res = await fn();
      setOutput(`[${name}] Result:\n${JSON.stringify(res, null, 2)}`);
    } catch (err: any) {
      setOutput(`[${name}] Error:\n${err.message}`);
    }
  };

  if (!user) {
    return <div className="fullpage-center">Sin sesion...</div>;
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar-title">EventSystem</div>
        <div className="app-sidebar-sub">
          Sesion: <strong>{user.name || user.username}</strong>
          <br />
          Perfil {user.profileId}
        </div>

        <nav className="app-nav">
          <button
            className="app-nav-btn primary"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button className="app-nav-btn" onClick={() => navigate("/events")}>
            Eventos
          </button>
          <button className="app-nav-btn" onClick={() => navigate("/reservations")}>
            📍 Reservaciones
          </button>
          <button className="app-nav-btn danger" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </nav>
      </aside>

      <main className="app-main">
        <div className="app-main-header">
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem" }}>
              Dashboard de eventos
            </h1>
            <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>
              Panel de control y verificación de Business Objects.
            </p>
          </div>
        </div>

        <section className="app-main-card">
          <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
            Verificación de Business Objects
          </h2>
          <p style={{ opacity: 0.9, marginBottom: "1rem" }}>
            Usa estos botones para probar la conexión con el backend y la lógica de los BOs.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <button className="app-btn" onClick={() => runTest("Events.list", () => Events.list())}>
              List Events
            </button>
            <button className="app-btn" onClick={() => runTest("Events.create", () => Events.create({ title: "Test Event " + Date.now(), date: "2025-12-01", location_id: 1, capacity: 100 }))}>
              Create Event
            </button>
            <button className="app-btn" onClick={() => runTest("Registrations.register", () => Registrations.register({ eventId: 1, guestName: "Guest " + Date.now(), guestEmail: "guest@test.com" }))}>
              Register Guest
            </button>
            <button className="app-btn" onClick={() => runTest("Registrations.listAttendees", () => Registrations.listAttendees(1))}>
              List Attendees (Evt 1)
            </button>
            <button className="app-btn" onClick={() => runTest("Reservations.create", () => Reservations.create({ locationId: 1, eventId: 1, date: "2025-12-05" }))}>
              Create Reservation
            </button>
            <button className="app-btn" onClick={() => runTest("Reservations.list", () => Reservations.list())}>
              List Reservations
            </button>
          </div>

          <div style={{ background: "#1e1e1e", color: "#0f0", padding: "1rem", borderRadius: "8px", fontFamily: "monospace", whiteSpace: "pre-wrap", maxHeight: "300px", overflow: "auto" }}>
            {output}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
