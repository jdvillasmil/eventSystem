import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { Events } from "../BO/Events";
// @ts-ignore
import { Staffing } from "../BO/Staffing";
// @ts-ignore
import { Registrations } from "../BO/Registrations";
import Sidebar from "../components/Sidebar";

const EventsPage: React.FC = () => {
    const { user } = useAuth();

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for Edit/Delete
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    // State for Attendees
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [attendees, setAttendees] = useState<any[]>([]);
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [loadingAttendees, setLoadingAttendees] = useState(false);

    // State for Staff
    const [eventStaff, setEventStaff] = useState<any[]>([]);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [loadingStaff, setLoadingStaff] = useState(false);

    // Form State for Events
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        date: string;
        location_id: number;
        capacity: number | "";
    }>({
        title: "",
        description: "",
        date: "",
        location_id: 1,
        capacity: 100
    });

    // Form State for Registration
    const [registerData, setRegisterData] = useState({
        guest_name: "",
        guest_email: ""
    });

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await Events.list();
            setEvents(data || []);
        } catch (err) {
            console.error("Error fetching events", err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendees = async (eventId: number) => {
        try {
            setLoadingAttendees(true);
            const data = await Registrations.listAttendees({ event_id: eventId });
            setAttendees(data || []);
        } catch (err) {
            console.error("Error fetching attendees", err);
            setAttendees([]);
        } finally {
            setLoadingAttendees(false);
        }
    };

    const fetchStaff = async (eventId: number) => {
        try {
            setLoadingStaff(true);
            const data = await Staffing.listByEvent(eventId);
            setEventStaff(data?.data || data || []);
        } catch (err) {
            console.error("Error fetching staff", err);
            setEventStaff([]);
        } finally {
            setLoadingStaff(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);



    const openCreateModal = () => {
        setEditingEvent(null);
        setFormData({ title: "", description: "", date: "", location_id: 1, capacity: 100 });
        setIsModalOpen(true);
    };

    const handleEdit = (evt: any) => {
        setEditingEvent(evt);
        const dateObj = new Date(evt.date);
        const dateStr = dateObj.toISOString().slice(0, 16);

        setFormData({
            title: evt.title,
            description: evt.description || "",
            date: dateStr,
            location_id: evt.location_id,
            capacity: evt.capacity
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await Events.update({ ...formData, id: editingEvent.id });
            } else {
                await Events.create(formData);
            }
            setIsModalOpen(false);
            fetchEvents();
        } catch (err) {
            alert("Error al guardar evento");
        }
    };

    const handleDeleteClick = (evt: any) => {
        setDeleteTarget(evt);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await Events.delete({ id: deleteTarget.id });
            setDeleteTarget(null);
            fetchEvents();
        } catch (err) {
            alert("Error al eliminar evento");
        }
    };

    // Attendees Functions
    const handleViewAttendees = async (evt: any) => {
        setSelectedEvent(evt);
        setShowAttendeesModal(true);
        await fetchAttendees(evt.id);
    };

    const handleViewStaff = async (evt: any) => {
        setSelectedEvent(evt);
        setShowStaffModal(true);
        await fetchStaff(evt.id);
    };

    const handleRegisterClick = () => {
        setShowRegisterModal(true);
        setRegisterData({ guest_name: "", guest_email: "" });
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;

        try {
            await Registrations.register({
                event_id: selectedEvent.id,
                ...registerData
            });
            setShowRegisterModal(false);
            setRegisterData({ guest_name: "", guest_email: "" });
            await fetchAttendees(selectedEvent.id);
        } catch (err) {
            alert("Error al registrar persona");
        }
    };

    const handleCheckIn = async (registrationId: number) => {
        try {
            await Registrations.checkIn({ id: registrationId });
            if (selectedEvent) {
                await fetchAttendees(selectedEvent.id);
            }
        } catch (err) {
            alert("Error al hacer check-in");
        }
    };

    const handleCancelRegistration = async (registrationId: number) => {
        try {
            await Registrations.cancel({ id: registrationId });
            if (selectedEvent) {
                await fetchAttendees(selectedEvent.id);
            }
        } catch (err) {
            alert("Error al cancelar registro");
        }
    };

    const getStatusBadgeClass = (status: string) => {
        const statusLower = status?.toLowerCase() || "";
        if (statusLower.includes("check")) return "checked-in";
        if (statusLower.includes("cancel")) return "cancelled";
        return "registered";
    };

    const getStatusText = (status: string) => {
        const statusLower = status?.toLowerCase() || "";
        if (statusLower.includes("check")) return "Check-in";
        if (statusLower.includes("cancel")) return "Cancelado";
        return "Registrado";
    };

    if (!user) return null;

    return (
        <div className="app-shell">
            {/* Sidebar */}
            <Sidebar />

            <main className="app-main">
                <div className="app-main-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Eventos</h1>
                        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>
                            Gestiona tus eventos próximos.
                        </p>
                    </div>
                    <button className="auth-button" style={{ width: "auto", padding: "0.7rem 1.5rem" }} onClick={openCreateModal}>
                        + Nuevo Evento
                    </button>
                </div>

                {loading ? (
                    <p>Cargando eventos...</p>
                ) : (
                    <div className="event-grid">
                        {events.map((evt) => (
                            <div key={evt.id} className="event-card">
                                <h3 className="event-title">{evt.title}</h3>
                                <div className="event-date">
                                    📅 {new Date(evt.date).toLocaleDateString()} {new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <p style={{ fontSize: "0.9rem", color: "#cbd5e1", marginBottom: "1rem" }}>
                                    {evt.description || "Sin descripción"}
                                </p>
                                <div className="event-meta">
                                    <span>📍 ID Lugar: {evt.location_id}</span>
                                    <span>👥 Capacidad: {evt.capacity}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="card-actions">
                                    <button className="action-btn attendees" onClick={() => handleViewAttendees(evt)}>
                                        👥 Asistentes
                                    </button>
                                    <button className="action-btn" style={{ background: "#8b5cf6", color: "white" }} onClick={() => handleViewStaff(evt)}>
                                        👔 Personal
                                    </button>
                                    <button className="action-btn edit" onClick={() => handleEdit(evt)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteClick(evt)}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>{editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">Título</label>
                                <input
                                    className="form-input"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripción</label>
                                <input
                                    className="form-input"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fecha y Hora</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Capacidad</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.capacity}
                                    onChange={e => setFormData({ ...formData, capacity: e.target.value === "" ? "" : Number(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="app-nav-btn" onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="auth-button" style={{ width: "auto" }}>
                                    {editingEvent ? "Guardar Cambios" : "Guardar Evento"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="delete-title">¿Estás seguro?</h2>
                        <p className="delete-text">
                            ¿Realmente deseas eliminar el evento <strong>"{deleteTarget.title}"</strong>?
                            <br />
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="modal-actions" style={{ justifyContent: "center" }}>
                            <button className="app-nav-btn" onClick={() => setDeleteTarget(null)}>
                                Cancelar
                            </button>
                            <button className="app-nav-btn danger" style={{ border: "1px solid #ef4444" }} onClick={confirmDelete}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendees Modal */}
            {showAttendeesModal && selectedEvent && (
                <div className="modal-overlay" onClick={() => setShowAttendeesModal(false)}>
                    <div className="attendees-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="attendees-header">
                            <div>
                                <h2 style={{ margin: 0 }}>Asistentes de {selectedEvent.title}</h2>
                                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                                    {attendees.length} {attendees.length === 1 ? "persona registrada" : "personas registradas"}
                                </p>
                            </div>
                            <button
                                className="auth-button"
                                style={{ width: "auto", padding: "0.6rem 1.2rem" }}
                                onClick={handleRegisterClick}
                            >
                                + Registrar Persona
                            </button>
                        </div>

                        {loadingAttendees ? (
                            <p style={{ textAlign: "center", color: "#94a3b8" }}>Cargando asistentes...</p>
                        ) : attendees.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">👥</div>
                                <p>No hay personas registradas aún</p>
                                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                                    Haz clic en "+ Registrar Persona" para agregar asistentes
                                </p>
                            </div>
                        ) : (
                            <div className="attendees-list">
                                {attendees.map((attendee) => (
                                    <div key={attendee.id} className="attendee-card">
                                        <div className="attendee-info">
                                            <div className="attendee-name">{attendee.guest_name || "Sin nombre"}</div>
                                            <div className="attendee-email">{attendee.guest_email || "Sin email"}</div>
                                        </div>
                                        <div className="attendee-actions">
                                            <span className={`status-badge ${getStatusBadgeClass(attendee.status)}`}>
                                                {getStatusText(attendee.status)}
                                            </span>
                                            {attendee.status?.toLowerCase() === "registered" && (
                                                <>
                                                    <button
                                                        className="attendee-btn checkin"
                                                        onClick={() => handleCheckIn(attendee.id)}
                                                    >
                                                        ✓ Check-in
                                                    </button>
                                                    <button
                                                        className="attendee-btn cancel-reg"
                                                        onClick={() => handleCancelRegistration(attendee.id)}
                                                    >
                                                        ✕ Cancelar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Register Form (inline) */}
                        {showRegisterModal && (
                            <form className="register-form" onSubmit={handleRegisterSubmit}>
                                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Registrar Nueva Persona</h3>
                                <div className="form-group">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        className="form-input"
                                        value={registerData.guest_name}
                                        onChange={e => setRegisterData({ ...registerData, guest_name: e.target.value })}
                                        required
                                        placeholder="Nombre completo"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={registerData.guest_email}
                                        onChange={e => setRegisterData({ ...registerData, guest_email: e.target.value })}
                                        required
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="app-nav-btn"
                                        onClick={() => setShowRegisterModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="auth-button" style={{ width: "auto" }}>
                                        Registrar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Staff Modal */}
            {showStaffModal && selectedEvent && (
                <div className="modal-overlay" onClick={() => setShowStaffModal(false)}>
                    <div className="attendees-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="attendees-header">
                            <div>
                                <h2 style={{ margin: 0 }}>Personal de {selectedEvent.title}</h2>
                                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                                    {eventStaff.length} {eventStaff.length === 1 ? "persona asignada" : "personas asignadas"}
                                </p>
                            </div>
                            <button
                                className="app-nav-btn"
                                style={{ width: "auto", padding: "0.6rem 1.2rem" }}
                                onClick={() => setShowStaffModal(false)}
                            >
                                Cerrar
                            </button>
                        </div>

                        {loadingStaff ? (
                            <p style={{ textAlign: "center", color: "#94a3b8" }}>Cargando personal...</p>
                        ) : eventStaff.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">👔</div>
                                <p>No hay personal asignado aún</p>
                                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                                    Ve a la sección "Personal" para asignar roles.
                                </p>
                            </div>
                        ) : (
                            <div className="attendees-list">
                                {eventStaff.map((staff) => (
                                    <div key={staff.id} className="attendee-card">
                                        <div className="attendee-info">
                                            <div className="attendee-name">{staff.person_name || "Sin nombre"}</div>
                                            <div className="attendee-email" style={{ color: "#60a5fa" }}>{staff.role_name || "Sin rol"}</div>
                                        </div>
                                        <div className="attendee-actions">
                                            <span className="status-badge registered">
                                                ${staff.agreed_cost}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
