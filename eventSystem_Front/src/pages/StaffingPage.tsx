import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { Events } from "../BO/Events";
// @ts-ignore
import { Staffing } from "../BO/Staffing";
// @ts-ignore
import { Roles } from "../BO/Roles";
import Sidebar from "../components/Sidebar";

const StaffingPage: React.FC = () => {
    // const navigate = useNavigate();
    const { user } = useAuth();

    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [staff, setStaff] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        person_name: "",
        role_id: "",
        agreed_cost: ""
    });

    useEffect(() => {
        loadEvents();
        loadRoles();
    }, []);

    const loadEvents = async () => {
        const data = await Events.list();
        setEvents(data?.data || data || []);
    };

    const loadRoles = async () => {
        try {
            const data = await Roles.list();
            console.log("Roles loaded:", data);
            setRoles(data?.data || data || []);
        } catch (err) {
            console.error("Error loading roles:", err);
        }
    };

    const handleEventSelect = async (evt: any) => {
        setSelectedEvent(evt);
        setLoading(true);
        try {
            const data = await Staffing.listByEvent(evt.id);
            setStaff(data?.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;

        try {
            await Staffing.assign({
                event_id: selectedEvent.id,
                person_name: formData.person_name,
                role_id: Number(formData.role_id),
                agreed_cost: Number(formData.agreed_cost)
            });
            setShowModal(false);
            setFormData({ person_name: "", role_id: "", agreed_cost: "" });
            handleEventSelect(selectedEvent); // Reload list
        } catch (err) {
            alert("Error al asignar personal");
        }
    };

    const handleRemoveStaff = async (id: number) => {
        if (!confirm("¿Eliminar del personal?")) return;
        try {
            await Staffing.remove({ id });
            handleEventSelect(selectedEvent);
        } catch (err) {
            alert("Error al eliminar");
        }
    };

    const handleRoleChange = (roleId: string) => {
        const role = roles.find(r => r.id === Number(roleId));
        setFormData({
            ...formData,
            role_id: roleId,
            agreed_cost: role ? role.base_cost : ""
        });
    };

    if (!user) return null;

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="app-main">
                <div className="app-main-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Gestión de Personal</h1>
                        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>Asigna roles y personal a tus eventos.</p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "2rem", height: "calc(100vh - 150px)" }}>
                    {/* Event List */}
                    <div style={{ width: "300px", overflowY: "auto", borderRight: "1px solid #334155", paddingRight: "1rem" }}>
                        <h3>Selecciona un Evento</h3>
                        <div className="event-list-sidebar">
                            {events.map(evt => (
                                <div
                                    key={evt.id}
                                    onClick={() => handleEventSelect(evt)}
                                    className={`event-item ${selectedEvent?.id === evt.id ? 'active' : ''}`}
                                    style={{
                                        padding: "1rem",
                                        marginBottom: "0.5rem",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        background: selectedEvent?.id === evt.id ? "#3b82f6" : "#1e293b",
                                        color: "white"
                                    }}
                                >
                                    <div style={{ fontWeight: "bold" }}>{evt.title}</div>
                                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{new Date(evt.date).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Staff List */}
                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {selectedEvent ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <h2>Personal para: {selectedEvent.title}</h2>
                                    <button className="auth-button" style={{ width: "auto" }} onClick={() => setShowModal(true)}>
                                        + Asignar Personal
                                    </button>
                                </div>

                                {loading ? <p>Cargando...</p> : (
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ borderBottom: "1px solid #475569", textAlign: "left" }}>
                                                <th style={{ padding: "1rem" }}>Nombre</th>
                                                <th style={{ padding: "1rem" }}>Rol</th>
                                                <th style={{ padding: "1rem" }}>Costo Acordado</th>
                                                <th style={{ padding: "1rem" }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {staff.map(s => (
                                                <tr key={s.id} style={{ borderBottom: "1px solid #334155" }}>
                                                    <td style={{ padding: "1rem" }}>{s.person_name}</td>
                                                    <td style={{ padding: "1rem" }}>
                                                        <span className="status-badge registered">{s.role_name}</span>
                                                    </td>
                                                    <td style={{ padding: "1rem" }}>${s.agreed_cost}</td>
                                                    <td style={{ padding: "1rem" }}>
                                                        <button className="action-btn delete" onClick={() => handleRemoveStaff(s.id)}>Eliminar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {staff.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                                                        No hay personal asignado a este evento.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
                                <p>Selecciona un evento para ver su personal</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Asignar Personal</h2>
                        <form onSubmit={handleAddStaff}>
                            <div className="form-group">
                                <label className="form-label">Nombre de la Persona</label>
                                <input
                                    className="form-input"
                                    value={formData.person_name}
                                    onChange={e => setFormData({ ...formData, person_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Rol</label>
                                <select
                                    className="form-input"
                                    value={formData.role_id}
                                    onChange={e => handleRoleChange(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona un rol</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name} (${r.base_cost})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Costo Acordado</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.agreed_cost}
                                    onChange={e => setFormData({ ...formData, agreed_cost: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="app-nav-btn" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="auth-button" style={{ width: "auto" }}>Asignar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffingPage;
