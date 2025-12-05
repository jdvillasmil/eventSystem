import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { Expenses } from "../BO/Expenses";
// @ts-ignore
import { Events } from "../BO/Events";
import Sidebar from "../components/Sidebar";

const ExpensesPage: React.FC = () => {
    const { user } = useAuth();

    const [expenses, setExpenses] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<any>(null);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const [formData, setFormData] = useState<{
        event_id: number | "";
        description: string;
        amount: number | "";
        category: string;
    }>({
        event_id: "",
        description: "",
        amount: "",
        category: ""
    });

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await Expenses.list();
            setExpenses(data || []);
        } catch (err) {
            console.error("Error fetching expenses", err);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const data = await Events.list();
            setEvents(data || []);
        } catch (err) {
            console.error("Error fetching events", err);
            setEvents([]);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchEvents();
    }, []);

    const openCreateModal = () => {
        setEditingExpense(null);
        setFormData({ event_id: "", description: "", amount: "", category: "" });
        setIsModalOpen(true);
    };

    const handleEdit = (expense: any) => {
        setEditingExpense(expense);
        setFormData({
            event_id: expense.event_id,
            description: expense.description,
            amount: expense.amount,
            category: expense.category || ""
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingExpense) {
                await Expenses.update({ ...formData, id: editingExpense.id });
            } else {
                await Expenses.create(formData);
            }
            setIsModalOpen(false);
            fetchExpenses();
        } catch (err) {
            alert("Error al guardar gasto");
        }
    };

    const handleDeleteClick = (expense: any) => {
        setDeleteTarget(expense);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await Expenses.delete({ id: deleteTarget.id });
            setDeleteTarget(null);
            fetchExpenses();
        } catch (err) {
            alert("Error al eliminar gasto");
        }
    };

    const getEventTitle = (eventId: number) => {
        const event = events.find(e => e.id === eventId);
        return event ? event.title : `Evento #${eventId}`;
    };

    if (!user) return null;

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="app-main">
                <div className="app-main-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Gastos</h1>
                        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>
                            Registra y gestiona los gastos de tus eventos.
                        </p>
                    </div>
                    <button className="auth-button" style={{ width: "auto", padding: "0.7rem 1.5rem" }} onClick={openCreateModal}>
                        + Nuevo Gasto
                    </button>
                </div>

                {loading ? (
                    <p>Cargando gastos...</p>
                ) : (
                    <div className="event-grid">
                        {expenses.map((expense) => (
                            <div key={expense.id} className="event-card">
                                <h3 className="event-title">{expense.description}</h3>
                                <div className="event-date">
                                    📅 {new Date(expense.expense_date).toLocaleDateString()}
                                </div>
                                <div className="event-meta">
                                    <span>🎫 {getEventTitle(expense.event_id)}</span>
                                    <span>💲 ${Number(expense.amount).toFixed(2)}</span>
                                    {expense.category && <span>🏷️ {expense.category}</span>}
                                </div>

                                <div className="card-actions">
                                    <button className="action-btn edit" onClick={() => handleEdit(expense)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteClick(expense)}>
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
                        <h2 style={{ marginTop: 0 }}>{editingExpense ? "Editar Gasto" : "Registrar Nuevo Gasto"}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">Evento</label>
                                <select
                                    className="form-input"
                                    value={formData.event_id}
                                    onChange={e => setFormData({ ...formData, event_id: Number(e.target.value) })}
                                    required
                                >
                                    <option value="">Selecciona un evento</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.id}>
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripción</label>
                                <input
                                    className="form-input"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    placeholder="Ej: Decoración, Catering, Sonido"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Monto ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value === "" ? "" : Number(e.target.value) })}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Categoría (Opcional)</label>
                                <input
                                    className="form-input"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Ej: Servicios, Materiales, Logística"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="app-nav-btn" onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="auth-button" style={{ width: "auto" }}>
                                    {editingExpense ? "Guardar Cambios" : "Guardar Gasto"}
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
                            ¿Realmente deseas eliminar el gasto <strong>"{deleteTarget.description}"</strong>?
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
        </div>
    );
};

export default ExpensesPage;
