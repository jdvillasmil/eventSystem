import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { Reservations } from "../BO/Reservations";
// @ts-ignore
import { Events } from "../BO/Events";

const ReservationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [reservations, setReservations] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [formData, setFormData] = useState({
        location_id: 0,
        event_id: 0,
        date: ""
    });

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const data = await Reservations.list();
            console.log("Reservations loaded:", data);
            setReservations(data || []);
        } catch (err) {
            console.error("Error fetching reservations", err);
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const data = await Reservations.getLocations();
            console.log("Locations loaded:", data);
            setLocations(data || []);
        } catch (err) {
            console.error("Error fetching locations", err);
        }
    };

    const fetchEvents = async () => {
        try {
            const data = await Events.list();
            console.log("Events loaded:", data);
            setEvents(data || []);
        } catch (err) {
            console.error("Error fetching events", err);
        }
    };

    useEffect(() => {
        fetchReservations();
        fetchLocations();
        fetchEvents();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.location_id === 0 || !formData.date) {
            alert("Por favor selecciona un lugar y una fecha");
            return;
        }

        try {
            console.log("Creating reservation with:", formData);
            await Reservations.create(formData);
            setShowCreateModal(false);
            setFormData({ location_id: 0, event_id: 0, date: "" });
            fetchReservations();
        } catch (err: any) {
            console.error("Error creating reservation:", err);
            alert(`Error al crear reservación: ${err.message || "Error desconocido"}`);
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm("¿Estás seguro de cancelar esta reservación?")) return;

        try {
            await Reservations.cancel({ id });
            fetchReservations();
        } catch (err: any) {
            console.error("Error canceling reservation:", err);
            alert(`Error al cancelar reservación: ${err.message || "Error desconocido"}`);
        }
    };

    // Auto-fill date when event is selected
    const handleEventChange = (eventId: number) => {
        if (eventId > 0) {
            const selectedEvent = events.find(e => e.id === eventId);
            if (selectedEvent && selectedEvent.date) {
                // Convert event date to YYYY-MM-DD format
                const eventDate = new Date(selectedEvent.date);
                const dateStr = eventDate.toISOString().split('T')[0];
                setFormData(prev => ({ ...prev, event_id: eventId, date: dateStr }));
            } else {
                setFormData(prev => ({ ...prev, event_id: eventId }));
            }
        } else {
            setFormData(prev => ({ ...prev, event_id: 0 }));
        }
    };

    const getLocationName = (locationId: number) => {
        const location = locations.find(l => l.id === locationId);
        return location?.name || `Lugar #${locationId}`;
    };

    const getEventTitle = (eventId: number) => {
        if (!eventId) return "Sin evento asignado";
        const event = events.find(e => e.id === eventId);
        return event?.title || `Evento #${eventId}`;
    };

    if (!user) return null;

    return (
        <div className="app-shell">
            {/* Sidebar */}
            <aside className="app-sidebar">
                <div className="app-sidebar-title">EventSystem</div>
                <div className="app-sidebar-sub">
                    Sesion: <strong>{user.name || user.username}</strong>
                </div>
                <nav className="app-nav">
                    <button className="app-nav-btn" onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>
                    <button className="app-nav-btn" onClick={() => navigate("/events")}>
                        Eventos
                    </button>
                    <button className="app-nav-btn primary" onClick={() => navigate("/reservations")}>
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
                        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Reservaciones</h1>
                        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>
                            Gestiona las reservaciones de lugares para eventos.
                        </p>
                    </div>
                    <button
                        className="auth-button"
                        style={{ width: "auto", padding: "0.7rem 1.5rem" }}
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Nueva Reservación
                    </button>
                </div>

                {loading ? (
                    <p>Cargando reservaciones...</p>
                ) : reservations.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📍</div>
                        <p>No hay reservaciones aún</p>
                        <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                            Haz clic en "+ Nueva Reservación" para crear una
                        </p>
                    </div>
                ) : (
                    <div className="reservation-grid">
                        {reservations.map((reservation) => (
                            <div key={reservation.id} className="reservation-card">
                                <h3 className="reservation-location">
                                    📍 {reservation.location_name || getLocationName(reservation.location_id)}
                                </h3>
                                <div className="reservation-event">
                                    🎫 {reservation.event_title || getEventTitle(reservation.event_id)}
                                </div>
                                <div className="reservation-date">
                                    📅 {new Date(reservation.date).toLocaleDateString()}
                                </div>

                                <div className="reservation-footer">
                                    <span className={reservation.status?.toLowerCase() === "cancelled" ? "status-cancelled" : "status-active"}>
                                        {reservation.status?.toLowerCase() === "cancelled" ? "Cancelada" : "Activa"}
                                    </span>
                                    {reservation.status?.toLowerCase() !== "cancelled" && (
                                        <button
                                            className="cancel-btn"
                                            onClick={() => handleCancel(reservation.id)}
                                        >
                                            ✕ Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>Nueva Reservación</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="form-label">Lugar</label>
                                <select
                                    className="form-input"
                                    value={formData.location_id}
                                    onChange={e => setFormData({ ...formData, location_id: Number(e.target.value) })}
                                    required
                                >
                                    <option value={0}>Selecciona un lugar</option>
                                    {locations.map(location => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Evento (opcional)</label>
                                <select
                                    className="form-input"
                                    value={formData.event_id}
                                    onChange={e => handleEventChange(Number(e.target.value))}
                                >
                                    <option value={0}>Sin evento asignado</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.id}>
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                                {formData.event_id > 0 && (
                                    <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.5rem" }}>
                                        💡 La fecha se llenó automáticamente con la fecha del evento
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Fecha de Reservación</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="app-nav-btn"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="auth-button" style={{ width: "auto" }}>
                                    Crear Reservación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;
