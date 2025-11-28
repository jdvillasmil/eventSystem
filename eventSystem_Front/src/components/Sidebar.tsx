import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    if (!user) return null;

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar-title">EventSystem</div>
            <div className="app-sidebar-sub">
                Sesion: <strong>{user.name || user.username}</strong>
            </div>
            <nav className="app-nav">
                <button
                    className={`app-nav-btn ${isActive("/dashboard") ? "primary" : ""}`}
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </button>
                <button
                    className={`app-nav-btn ${isActive("/events") ? "primary" : ""}`}
                    onClick={() => navigate("/events")}
                >
                    Eventos
                </button>
                <button
                    className={`app-nav-btn ${isActive("/reservations") ? "primary" : ""}`}
                    onClick={() => navigate("/reservations")}
                >
                    📍 Reservaciones
                </button>
                <button
                    className={`app-nav-btn ${isActive("/staffing") ? "primary" : ""}`}
                    onClick={() => navigate("/staffing")}
                >
                    👷 Personal
                </button>
                <button
                    className={`app-nav-btn ${isActive("/roles") ? "primary" : ""}`}
                    onClick={() => navigate("/roles")}
                >
                    👔 Roles
                </button>
                <button
                    className={`app-nav-btn ${isActive("/expenses") ? "primary" : ""}`}
                    onClick={() => navigate("/expenses")}
                >
                    💸 Gastos
                </button>
                <button
                    className={`app-nav-btn ${isActive("/attendance") ? "primary" : ""}`}
                    onClick={() => navigate("/attendance")}
                >
                    ✓ Asistencia
                </button>
                <button
                    className={`app-nav-btn ${isActive("/payments") ? "primary" : ""}`}
                    onClick={() => navigate("/payments")}
                >
                    💰 Pagos
                </button>
                <button
                    className={`app-nav-btn ${isActive("/reports") ? "primary" : ""}`}
                    onClick={() => navigate("/reports")}
                >
                    📊 Reportes
                </button>
                <button className="app-nav-btn danger" onClick={handleLogout}>
                    Cerrar sesion
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
