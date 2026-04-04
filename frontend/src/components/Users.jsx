import { useState, useEffect } from 'react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

export default function Users() {
    const { user }                = useAuth();
    const [users, setUsers]       = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', phone: '', role: 'patient' });
    const [loading, setLoading]   = useState(true);
    const [form, setForm]         = useState({ name: '', email: '', phone: '', role: 'patient' });

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users/');
            setUsers(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const createUser = async () => {
        try {
            await api.post('/users/', form);
            setShowForm(false);
            setForm({ name: '', email: '', phone: '', role: 'patient' });
            loadUsers();
        } catch (e) { console.error(e); }
    };

    const updateUser = async (id) => {
        try {
            await api.put(`/users/${id}`, editForm);
            setEditingId(null);
            loadUsers();
        } catch (e) { console.error('Error actualizar usuario:', e.response?.data); }
    };

    const deleteUser = async (id) => {
        if (!confirm('¿Está seguro de eliminar este usuario?')) return;
        await api.delete(`/users/${id}`);
        loadUsers();
    };

    const startEdit = (u) => {
        setEditingId(u.id);
        setEditForm({ name: u.name, phone: u.phone || '', role: u.role });
        setShowForm(false);
    };

    const roleConfig = {
        admin:   { label: 'Administrador', bg: '#f3e8ff', color: '#7c3aed' },
        doctor:  { label: 'Médico',        bg: '#dbeafe', color: '#1d4ed8' },
        patient: { label: 'Paciente',      bg: '#ccfbf1', color: '#0f766e' },
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Gestión de usuarios</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13 }}>Administre los usuarios del sistema hospitalario</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} style={primaryBtn}>
                    + Nuevo usuario
                </button>
            </div>

            {showForm && (
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Registrar nuevo usuario</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Nombre completo</label>
                            <input placeholder="Nombre" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Correo electrónico</label>
                            <input placeholder="correo@hospital.com" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Teléfono</label>
                            <input placeholder="300 000 0000" value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Rol</label>
                            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                                <option value="patient">Paciente</option>
                                <option value="doctor">Médico</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={createUser} style={primaryBtn}>Guardar</button>
                        <button onClick={() => setShowForm(false)} style={secondaryBtn}>Cancelar</button>
                    </div>
                </div>
            )}

            {editingId && (
                <div style={{ ...cardStyle, borderLeft: '4px solid #0f4c81' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Editar usuario #{editingId}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Nombre completo</label>
                            <input value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Teléfono</label>
                            <input value={editForm.phone}
                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Rol</label>
                            <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} style={inputStyle}>
                                <option value="patient">Paciente</option>
                                <option value="doctor">Médico</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => updateUser(editingId)} style={primaryBtn}>Actualizar</button>
                        <button onClick={() => setEditingId(null)} style={secondaryBtn}>Cancelar</button>
                    </div>
                </div>
            )}

            <div style={cardStyle}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando usuarios...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                {['ID', 'Nombre', 'Correo electrónico', 'Teléfono', 'Rol', 'Acciones'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12,
                                        fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: 12 }}>#{u.id}</span></td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%',
                                                background: roleConfig[u.role]?.bg, color: roleConfig[u.role]?.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: 13 }}>
                                                {u.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 500, color: '#0f172a' }}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>{u.email}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>{u.phone || '—'}</span></td>
                                    <td style={tdStyle}>
                                        <span style={{ background: roleConfig[u.role]?.bg, color: roleConfig[u.role]?.color,
                                            padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                            {roleConfig[u.role]?.label}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => startEdit(u)}
                                                style={{ color: '#0f4c81', background: 'none', border: 'none',
                                                    cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                                                Editar
                                            </button>
                                            <button onClick={() => deleteUser(u.id)}
                                                style={{ color: '#ef4444', background: 'none', border: 'none',
                                                    cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const cardStyle    = { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 20, border: '1px solid #f1f5f9' };
const inputStyle   = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', color: '#0f172a', boxSizing: 'border-box' };
const labelStyle   = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' };
const tdStyle      = { padding: '14px 16px', verticalAlign: 'middle' };
const primaryBtn   = { padding: '9px 20px', border: 'none', background: '#0f4c81', color: '#fff', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 };
const secondaryBtn = { padding: '9px 20px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 };
