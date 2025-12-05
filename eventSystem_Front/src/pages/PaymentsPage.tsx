import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { Events } from "../BO/Events";
// @ts-ignore
import { Payments } from "../BO/Payments";
import Sidebar from "../components/Sidebar";

const PaymentsPage: React.FC = () => {
    // const navigate = useNavigate();
    const { user } = useAuth();

    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        totalAgreed: 0,
        totalPaid: 0,
        totalPending: 0,
        countPaid: 0,
        countPending: 0
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        const data = await Events.list();
        setEvents(data?.data || data || []);
    };

    const handleEventSelect = async (evt: any) => {
        setSelectedEvent(evt);
        setLoading(true);
        try {
            const data = await Payments.listByEvent(evt.id);
            const items = data?.data || data || [];
            setPayments(items);
            calculateStats(items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (items: any[]) => {
        let totalAgreed = 0;
        let totalPaid = 0;
        let totalPending = 0;
        let countPaid = 0;
        let countPending = 0;

        items.forEach(item => {
            const cost = Number(item.agreed_cost) || 0;
            const amount = Number(item.amount) || 0;

            totalAgreed += cost;

            if (item.status === 'PAID') {
                totalPaid += amount;
                countPaid++;
            } else {
                // If pending or no payment, it counts as pending money (using agreed cost)
                totalPending += cost;
                countPending++;
            }
        });

        setStats({ totalAgreed, totalPaid, totalPending, countPaid, countPending });
    };

    const handleCreatePayment = async (staffingId: number, amount: number) => {
        if (!confirm(`¿Generar orden de pago por $${amount}?`)) return;
        try {
            await Payments.create({ staffing_id: staffingId, amount });
            handleEventSelect(selectedEvent);
        } catch (err) {
            alert("Error al crear pago");
        }
    };

    const handlePay = async (paymentId: number) => {
        if (!confirm("¿Marcar como PAGADO?")) return;
        try {
            await Payments.pay({ id: paymentId });
            handleEventSelect(selectedEvent);
        } catch (err) {
            alert("Error al procesar pago");
        }
    };

    if (!user) return null;

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="app-main">
                <div className="app-main-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Gestión de Pagos</h1>
                        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>Controla los pagos al personal.</p>
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

                    {/* Payments List */}
                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {selectedEvent ? (
                            <>
                                <div style={{ marginBottom: "2rem" }}>
                                    <h2>Pagos para: {selectedEvent.title}</h2>

                                    {/* Stats Cards */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
                                        <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                            <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Acordado</div>
                                            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "white" }}>${stats.totalAgreed.toFixed(2)}</div>
                                        </div>
                                        <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                            <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Pagado</div>
                                            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#4ade80" }}>${stats.totalPaid.toFixed(2)}</div>
                                            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{stats.countPaid} pagos realizados</div>
                                        </div>
                                        <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                            <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Pendiente por Pagar</div>
                                            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#f87171" }}>${stats.totalPending.toFixed(2)}</div>
                                            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{stats.countPending} pagos pendientes</div>
                                        </div>
                                    </div>
                                </div>

                                {loading ? <p>Cargando...</p> : (
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ borderBottom: "1px solid #475569", textAlign: "left" }}>
                                                <th style={{ padding: "1rem" }}>Personal</th>
                                                <th style={{ padding: "1rem" }}>Rol</th>
                                                <th style={{ padding: "1rem" }}>Costo Acordado</th>
                                                <th style={{ padding: "1rem" }}>Estado</th>
                                                <th style={{ padding: "1rem" }}>Fecha Pago</th>
                                                <th style={{ padding: "1rem" }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map(p => (
                                                <tr key={p.staffing_id} style={{ borderBottom: "1px solid #334155" }}>
                                                    <td style={{ padding: "1rem" }}>{p.person_name}</td>
                                                    <td style={{ padding: "1rem" }}>{p.role_name}</td>
                                                    <td style={{ padding: "1rem" }}>${p.agreed_cost}</td>
                                                    <td style={{ padding: "1rem" }}>
                                                        <span className={`status-badge ${p.status === 'PAID' ? 'checked-in' : p.status === 'PENDING' ? 'registered' : 'cancelled'}`}>
                                                            {p.status === 'PAID' ? 'PAGADO' : p.status === 'PENDING' ? 'PENDIENTE' : 'SIN ORDEN'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "1rem" }}>
                                                        {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "-"}
                                                    </td>
                                                    <td style={{ padding: "1rem" }}>
                                                        {!p.payment_id && (
                                                            <button
                                                                className="attendee-btn"
                                                                style={{ background: "#3b82f6", color: "white", border: "none" }}
                                                                onClick={() => handleCreatePayment(p.staffing_id, p.agreed_cost)}
                                                            >
                                                                Generar Orden
                                                            </button>
                                                        )}
                                                        {p.status === 'PENDING' && (
                                                            <button className="attendee-btn checkin" onClick={() => handlePay(p.payment_id)}>
                                                                Pagar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {payments.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
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
                                <p>Selecciona un evento para ver sus pagos</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentsPage;
