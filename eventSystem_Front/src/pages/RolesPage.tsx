import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { Roles } from "../BO/Roles";
import Sidebar from "../components/Sidebar";

const RolesPage: React.FC = () => {
    const { user } = useAuth();

    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<any>(null);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const [formData, setFormData] = useState<{
        name: string;
        base_cost: number | "";
    }>({
        name: "",
        base_cost: ""
    });

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const data = await Roles.list();
            setRoles(data || []);
        } catch (err) {
            console.error("Error fetching roles", err);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const openCreateModal = () => {
        setEditingRole(null);
        setFormData({ name: "", base_cost: "" });
        setIsModalOpen(true);
    };

    const handleEdit = (role: any) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            base_cost: role.base_cost
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await Roles.update({ ...formData, id: editingRole.id });
            } else {
                await Roles.create(formData);
            }
            setIsModalOpen(false);
            fetchRoles();
        } catch (err) {
            alert("Error al guardar rol");
        }
    };

    const handleDeleteClick = (role: any) => {
        setDeleteTarget(role);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await Roles.delete({ id: deleteTarget.id });
            setDeleteTarget(null);
            fetchRoles();
        } catch (err) {
            alert("Error al eliminar rol");
        }
    };

    if (!user) return null;

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="app-main">
                <div className="app-main-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Roles</h1>
                        <p style={{ opacity: 0.8, marginTop: "0.35rem" }}>
                            Configura los roles y sus costos base.
                        </p>
                    </div>
                    <button className="auth-button" style={{ width: "auto", padding: "0.7rem 1.5rem" }} onClick={openCreateModal}>
                        + Nuevo Rol
                    </button>
                </div>

                {loading ? (
                    <p>Cargando roles...</p>
                ) : (
                    <div className="event-grid">
                        {roles.map((role) => (
                            <div key={role.id} className="event-card">
                                <h3 className="event-title">{role.name}</h3>
                                <div className="event-meta">
                                    <span>💲 Costo Base: ${Number(role.base_cost).toFixed(2)}</span>
                                </div>

                                <div className="card-actions">
                                    <button className="action-btn edit" onClick={() => handleEdit(role)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteClick(role)}>
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
                        <h2 style={{ marginTop: 0 }}>{editingRole ? "Editar Rol" : "Crear Nuevo Rol"}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">Nombre del Rol</label>
                                <input
                                    className="form-input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Ej: Mesero, DJ, Seguridad"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Costo Base ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.base_cost}
                                    onChange={e => setFormData({ ...formData, base_cost: e.target.value === "" ? "" : Number(e.target.value) })}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="app-nav-btn" onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="auth-button" style={{ width: "auto" }}>
                                    {editingRole ? "Guardar Cambios" : "Guardar Rol"}
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
                            ¿Realmente deseas eliminar el rol <strong>"{deleteTarget.name}"</strong>?
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

export default RolesPage;
