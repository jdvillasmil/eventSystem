import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type SidebarItem = {
  id: string;
  label: string;
  path: string;
  allowedProfiles: string[];
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "events",
    label: "📅 Eventos",
    path: "/events",
    allowedProfiles: ["ADMIN_SYSTEM", "EVENT_MANAGER", "RESERVATIONS", "FINANCE", "REPORTS", "AUDITOR", "STAFF_MANAGER"]
  },
  {
    id: "reservations",
    label: "📍 Reservaciones",
    path: "/reservations",
    allowedProfiles: ["ADMIN_SYSTEM", "EVENT_MANAGER", "RESERVATIONS"]
  },
  {
    id: "staffing",
    label: "👷 Personal",
    path: "/staffing",
    allowedProfiles: ["ADMIN_SYSTEM", "EVENT_MANAGER", "STAFF_MANAGER"]
  },
  {
    id: "roles",
    label: "👔 Roles",
    path: "/roles",
    allowedProfiles: ["ADMIN_SYSTEM", "STAFF_MANAGER"]
  },
  {
    id: "expenses",
    label: "💸 Gastos",
    path: "/expenses",
    allowedProfiles: ["ADMIN_SYSTEM", "EVENT_MANAGER", "FINANCE"]
  },
  {
    id: "attendance",
    label: "✓ Asistencia",
    path: "/attendance",
    allowedProfiles: ["ADMIN_SYSTEM", "EVENT_MANAGER", "CHECKIN"]
  },
  {
    id: "payments",
    label: "💰 Pagos",
    path: "/payments",
    allowedProfiles: ["ADMIN_SYSTEM", "FINANCE"]
  },
  {
    id: "reports",
    label: "📊 Reportes",
    path: "/reports",
    allowedProfiles: ["ADMIN_SYSTEM", "EVENT_MANAGER", "FINANCE", "REPORTS", "AUDITOR"]
  }
];

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

    // Get current profile key, default to ADMIN_SYSTEM if not set
    const currentProfileKey = user.profileKey || "ADMIN_SYSTEM";

    // Filter sidebar items based on user's profile
    const visibleItems = SIDEBAR_ITEMS.filter(item =>
        item.allowedProfiles.includes(currentProfileKey)
    );

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar-title">EventSystem</div>
            <div className="app-sidebar-sub">
                Sesion: <strong>{user.name || user.username}</strong>
            </div>
            <nav className="app-nav">
                {visibleItems.map(item => (
                    <button
                        key={item.id}
                        className={`app-nav-btn ${isActive(item.path) ? "primary" : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.label}
                    </button>
                ))}
                <button className="app-nav-btn danger" onClick={handleLogout}>
                    Cerrar sesion
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
