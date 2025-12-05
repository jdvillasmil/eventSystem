import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { Reports } from "../BO/Reports";
// @ts-ignore
import { Events } from "../BO/Events";
// @ts-ignore
import { Expenses } from "../BO/Expenses";
import Sidebar from "../components/Sidebar";

const ReportsPage: React.FC = () => {
    const { user } = useAuth();

    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [financialDetail, setFinancialDetail] = useState<any>(null);
    const [attendanceDetail, setAttendanceDetail] = useState<any>(null);
    const [expensesList, setExpensesList] = useState<any[]>([]);
    const [globalSummary, setGlobalSummary] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'event' | 'global'>('event');

    useEffect(() => {
        loadEvents();
        loadGlobalSummary();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await Events.list();
            // callTx already extracts .data, so data is the array directly
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Error loading events:', err);
            setEvents([]);
        }
    };

    const loadGlobalSummary = async () => {
        try {
            const data = await Reports.globalSummary();
            // callTx already extracts .data, so data is the array directly
            setGlobalSummary(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Error loading global summary:', err);
            setGlobalSummary([]);
        }
    };

    const handleEventChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedEventId(id);
        if (id) {
            setLoading(true);
            try {
                const [financial, attendance, expenses] = await Promise.all([
                    Reports.eventFinancialDetail(Number(id)),
                    Reports.eventAttendanceDetail(Number(id)),
                    Expenses.listByEvent(Number(id))
                ]);

                // callTx already extracts .data, so we use the response directly
                setFinancialDetail(financial || null);
                setAttendanceDetail(attendance || null);
                setExpensesList(Array.isArray(expenses) ? expenses : []);
            } catch (err) {
                console.error('❌ Error fetching reports:', err);
                setFinancialDetail(null);
                setAttendanceDetail(null);
                setExpensesList([]);
            } finally {
                setLoading(false);
            }
        } else {
            setFinancialDetail(null);
            setAttendanceDetail(null);
            setExpensesList([]);
        }
    };

    if (!user) return null;

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="app-main">
                <div className="app-main-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Reportes</h1>
                        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>Estadísticas y datos financieros.</p>
                    </div>
                </div>

                <div className="tabs" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #334155" }}>
                    <button
                        className={`tab-btn ${activeTab === 'event' ? 'active' : ''}`}
                        onClick={() => setActiveTab('event')}
                        style={{
                            padding: "1rem",
                            background: "none",
                            border: "none",
                            color: activeTab === 'event' ? "#3b82f6" : "#94a3b8",
                            borderBottom: activeTab === 'event' ? "2px solid #3b82f6" : "none",
                            cursor: "pointer",
                            fontSize: "1rem"
                        }}
                    >
                        Reporte por Evento
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
                        onClick={() => setActiveTab('global')}
                        style={{
                            padding: "1rem",
                            background: "none",
                            border: "none",
                            color: activeTab === 'global' ? "#3b82f6" : "#94a3b8",
                            borderBottom: activeTab === 'global' ? "2px solid #3b82f6" : "none",
                            cursor: "pointer",
                            fontSize: "1rem"
                        }}
                    >
                        Resumen Global
                    </button>
                </div>

                {activeTab === 'event' && (
                    <div className="tab-content">
                        <div className="form-group" style={{ maxWidth: "400px", marginBottom: "2rem" }}>
                            <label className="form-label">Seleccionar Evento</label>
                            <select className="form-input" value={selectedEventId} onChange={handleEventChange}>
                                <option value="">-- Selecciona --</option>
                                {events.map(evt => (
                                    <option key={evt.id} value={evt.id}>{evt.title}</option>
                                ))}
                            </select>
                        </div>

                        {loading && <p>Cargando reporte...</p>}

                        {financialDetail && attendanceDetail && (
                            <>
                                {/* Financial Stats */}
                                <h3 style={{ marginBottom: "1rem" }}>📊 Reporte Financiero</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                                    <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                        <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>Ingresos</h4>
                                        <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "0.5rem", color: "#4ade80" }}>
                                            ${Number(financialDetail.total_income || 0).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                        <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>Gastos Generales</h4>
                                        <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "0.5rem", color: "#f87171" }}>
                                            ${Number(financialDetail.total_expenses || 0).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                        <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>Costo Personal</h4>
                                        <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "0.5rem", color: "#f59e0b" }}>
                                            ${Number(financialDetail.staff_cost || 0).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                        <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>Balance Final</h4>
                                        <div style={{
                                            fontSize: "1.8rem",
                                            fontWeight: "bold",
                                            marginTop: "0.5rem",
                                            color: Number(financialDetail.balance || 0) >= 0 ? "#4ade80" : "#f87171"
                                        }}>
                                            ${Number(financialDetail.balance || 0).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {/* Expense Breakdown */}
                                {expensesList.length > 0 && (
                                    <>
                                        <h3 style={{ marginBottom: "1rem", marginTop: "2rem" }}>💰 Desglose de Gastos</h3>
                                        <div style={{
                                            background: "#1e293b",
                                            borderRadius: "12px",
                                            border: "1px solid #334155",
                                            overflow: "hidden"
                                        }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead>
                                                    <tr style={{
                                                        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                                                        borderBottom: "2px solid #334155"
                                                    }}>
                                                        <th style={{ padding: "1rem", textAlign: "left", color: "#94a3b8", fontWeight: 600 }}>Descripción</th>
                                                        <th style={{ padding: "1rem", textAlign: "left", color: "#94a3b8", fontWeight: 600 }}>Categoría</th>
                                                        <th style={{ padding: "1rem", textAlign: "left", color: "#94a3b8", fontWeight: 600 }}>Fecha</th>
                                                        <th style={{ padding: "1rem", textAlign: "right", color: "#94a3b8", fontWeight: 600 }}>Monto</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {expensesList.map((expense, idx) => (
                                                        <tr key={expense.id || idx} style={{
                                                            borderBottom: idx < expensesList.length - 1 ? "1px solid #334155" : "none"
                                                        }}>
                                                            <td style={{ padding: "1rem", color: "#e2e8f0" }}>{expense.description || "Sin descripción"}</td>
                                                            <td style={{ padding: "1rem" }}>
                                                                <span style={{
                                                                    padding: "0.25rem 0.75rem",
                                                                    borderRadius: "6px",
                                                                    fontSize: "0.85rem",
                                                                    background: "rgba(59, 130, 246, 0.1)",
                                                                    color: "#60a5fa",
                                                                    border: "1px solid rgba(59, 130, 246, 0.2)"
                                                                }}>
                                                                    {expense.category || "General"}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: "1rem", color: "#94a3b8", fontSize: "0.9rem" }}>
                                                                {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString() : "N/A"}
                                                            </td>
                                                            <td style={{
                                                                padding: "1rem",
                                                                textAlign: "right",
                                                                color: "#f87171",
                                                                fontWeight: "bold",
                                                                fontSize: "1.1rem"
                                                            }}>
                                                                ${Number(expense.amount || 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr style={{
                                                        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                                                        borderTop: "2px solid #334155"
                                                    }}>
                                                        <td colSpan={3} style={{
                                                            padding: "1rem",
                                                            fontWeight: "bold",
                                                            color: "#e2e8f0",
                                                            fontSize: "1.1rem"
                                                        }}>
                                                            Total de Gastos
                                                        </td>
                                                        <td style={{
                                                            padding: "1rem",
                                                            textAlign: "right",
                                                            color: "#f87171",
                                                            fontWeight: "bold",
                                                            fontSize: "1.3rem"
                                                        }}>
                                                            ${expensesList.reduce((sum, exp) => sum + Number(exp.amount || 0), 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {/* Attendance Stats */}
                                <h3 style={{ marginBottom: "1rem", marginTop: "2rem" }}>👥 Reporte de Asistencia</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                                    <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                        <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>Registrados</h4>
                                        <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "0.5rem" }}>
                                            {attendanceDetail.total_registered || 0}
                                        </div>
                                    </div>
                                    <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                        <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>Asistieron</h4>
                                        <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "0.5rem", color: "#4ade80" }}>
                                            {attendanceDetail.total_attended || 0}
                                        </div>
                                    </div>
                                    <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                        <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>% Asistencia</h4>
                                        <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "0.5rem", color: "#60a5fa" }}>
                                            {Number(attendanceDetail.attendance_percentage || 0).toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="stat-card" style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #334155" }}>
                                        <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>Estado</h4>
                                        <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "0.5rem" }}>
                                            <span className={`status-badge ${financialDetail.status === 'COMPLETED' ? 'checked-in' : 'registered'}`}>
                                                {financialDetail.status || 'PLANNED'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'global' && (
                    <div className="tab-content">
                        <h3 style={{ marginBottom: "1rem" }}>Resumen de Todos los Eventos</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #475569", textAlign: "left" }}>
                                    <th style={{ padding: "1rem" }}>Evento</th>
                                    <th style={{ padding: "1rem" }}>Estado</th>
                                    <th style={{ padding: "1rem" }}>Fecha</th>
                                    <th style={{ padding: "1rem" }}>Ingresos</th>
                                    <th style={{ padding: "1rem" }}>Gastos</th>
                                    <th style={{ padding: "1rem" }}>Personal</th>
                                    <th style={{ padding: "1rem" }}>Balance</th>
                                    <th style={{ padding: "1rem" }}>Registrados</th>
                                    <th style={{ padding: "1rem" }}>Asistieron</th>
                                </tr>
                            </thead>
                            <tbody>
                                {globalSummary.map((row) => (
                                    <tr key={row.id} style={{ borderBottom: "1px solid #334155" }}>
                                        <td style={{ padding: "1rem" }}>{row.title}</td>
                                        <td style={{ padding: "1rem" }}>
                                            <span className={`status-badge ${row.status === 'COMPLETED' ? 'checked-in' : 'registered'}`}>
                                                {row.status || 'PLANNED'}
                                            </span>
                                        </td>
                                        <td style={{ padding: "1rem" }}>{new Date(row.date).toLocaleDateString()}</td>
                                        <td style={{ padding: "1rem", color: "#4ade80" }}>${Number(row.total_income || 0).toFixed(2)}</td>
                                        <td style={{ padding: "1rem", color: "#f87171" }}>${Number(row.total_expenses || 0).toFixed(2)}</td>
                                        <td style={{ padding: "1rem", color: "#f59e0b" }}>${Number(row.staff_cost || 0).toFixed(2)}</td>
                                        <td style={{
                                            padding: "1rem",
                                            color: Number(row.balance || 0) >= 0 ? "#4ade80" : "#f87171",
                                            fontWeight: "bold"
                                        }}>
                                            ${Number(row.balance || 0).toFixed(2)}
                                        </td>
                                        <td style={{ padding: "1rem" }}>{row.total_registered || 0}</td>
                                        <td style={{ padding: "1rem", color: "#4ade80" }}>{row.total_attended || 0}</td>
                                    </tr>
                                ))}
                                {globalSummary.length === 0 && (
                                    <tr>
                                        <td colSpan={9} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                                            No hay eventos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ReportsPage;
