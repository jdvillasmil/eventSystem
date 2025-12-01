import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { Attendance } from "../BO/Attendance";
// @ts-ignore
import { Events } from "../BO/Events";
import Sidebar from "../components/Sidebar";

const AttendancePage: React.FC = () => {
    const { user } = useAuth();

    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | "">("");
    const [attendees, setAttendees] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        try {
            const data = await Events.list();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ [AttendancePage] Error fetching events:", err);
            setEvents([]);
        }
    };

    const fetchAttendees = async (eventId: number) => {
        try {
            setLoading(true);
            const data = await Attendance.listByEvent(eventId);

            // Ensure we always set an array
            setAttendees(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ Error fetching attendees:", err);
            setAttendees([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventChange = (eventId: string) => {
        const id = Number(eventId);
        setSelectedEventId(id);
        if (id) {
            fetchAttendees(id);
        } else {
            setAttendees([]);
        }
    };

    const handleMarkAttendance = async (attendeeId: number) => {
        try {
            await Attendance.markAttendance({ id: attendeeId });
            if (selectedEventId) {
                fetchAttendees(selectedEventId);
            }
        } catch (err) {
            alert("Error al marcar asistencia");
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
        if (statusLower.includes("check")) return "Asistió";
        if (statusLower.includes("cancel")) return "Cancelado";
        return "Registrado";
    };

    if (!user) return null;

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="app-main">
                <div className="app-main-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Asistencia</h1>
                        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>
                            Marca la asistencia de las personas registradas.
                        </p>
                    </div>
                </div>

                {/* Event Selector */}
                <div style={{ marginBottom: "2rem" }}>
                    <label className="form-label" style={{ display: "block", marginBottom: "0.5rem" }}>
                        Selecciona un Evento
                    </label>
                    <select
                        className="form-input"
                        style={{ maxWidth: "400px" }}
                        value={selectedEventId}
                        onChange={(e) => handleEventChange(e.target.value)}
                    >
                        <option value="">-- Selecciona un evento --</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.title} - {new Date(event.date).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Attendees List */}
                {selectedEventId && (
                    <>
                        {loading ? (
                            <p>Cargando asistentes...</p>
                        ) : attendees.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">👥</div>
                                <p>No hay personas registradas para este evento</p>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ marginBottom: "1rem" }}>
                                    {attendees.length} {attendees.length === 1 ? "persona registrada" : "personas registradas"}
                                </h3>
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
                                                    <button
                                                        className="attendee-btn checkin"
                                                        onClick={() => handleMarkAttendance(attendee.id)}
                                                    >
                                                        ✓ Marcar Asistencia
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default AttendancePage;
