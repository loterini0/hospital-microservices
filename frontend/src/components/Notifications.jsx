import { useState, useEffect } from 'react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
    const { user }                          = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showForm, setShowForm]           = useState(false);
    const [loading, setLoading]             = useState(true);
    const [form, setForm]                   = useState({ user_id: '', type: 'appointment', message: '' });

    useEffect(() => { loadNotifications(); }, []);

    const loadNotifications = async () => {
        setLoading(true);
        const res = await api.get('/notifications/');
        setNotifications(res.data);
        setLoading(false);
    };

    const createNotification = async () => {
        await api.post('/notifications/', { ...form, user_id: parseInt(form.user_id) });
        setShowForm(false);
        setForm({ user_id: '', type: 'appointment', message: '' });
        loadNotifications();
    };

    const markAsRead = async (id) => {
        await api.put(`/notifications/${id}/read`);
        loadNotifications();
    };

    const deleteNotification = async (id) => {
        if (!confirm('¿Está seguro de eliminar esta notificación?')) return;
        await api.delete(`/notifications/${id}`);
        loadNotifications();
    };

    const canCreate = user?.role === 'admin';
    const canDelete = user?.role === 'admin';

    const typeConfig = {
        appointment: { label: 'Cita',          bg: '#dbeafe', color: '#1d4ed8' },
        reminder:    { label: 'Recordatorio',  bg: '#fef9c3', color: '#a16207' },
        alert:       { label: 'Alerta',        bg: '#fee2e2', color: '#dc2626' },
    };

    const unread = notifications.filter(n => !n.read).length;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        Notificaciones
                        {unread > 0 && (
                            <span style={{ marginLeft: 10, background: '#ef4444', color: '#fff',
                                borderRadius: 20, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>
                                {unread} nuevas
                            </span>
                        )}
                    </h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13 }}>Centro de notificaciones del sistema</p>
                </div>
                {canCreate && (
                    <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
                        + Nueva notificación
                    </button>
                )}
            </div>

            {showForm && canCreate && (
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Crear notificación</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>ID Usuario</label>
                            <input placeholder="ID del usuario" type="number" value={form.user_id}
                                onChange={e => setForm({ ...form, user_id: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Tipo</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                                <option value="appointment">Cita</option>
                                <option value="reminder">Recordatorio</option>
                                <option value="alert">Alerta</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Mensaje</label>
                            <input placeholder="Contenido de la notificación" value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={createNotification} style={primaryBtn}>Enviar</button>
                        <button onClick={() => setShowForm(false)} style={secondaryBtn}>Cancelar</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {loading ? (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                        Cargando notificaciones...
                    </div>
                ) : notifications.length === 0 ? (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                        No hay notificaciones
                    </div>
                ) : notifications.map(n => (
                    <div key={n._id} style={{ ...cardStyle, marginBottom: 0,
                        borderLeft: `4px solid ${n.read ? '#e2e8f0' : typeConfig[n.type]?.color}`,
                        opacity: n.read ? 0.7 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <span style={{ background: typeConfig[n.type]?.bg, color: typeConfig[n.type]?.color,
                                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    {typeConfig[n.type]?.label}
                                </span>
                                <div>
                                    <p style={{ margin: 0, fontWeight: n.read ? 400 : 600, color: '#0f172a' }}>{n.message}</p>
                                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                                        Usuario #{n.user_id} · {new Date(n.createdAt).toLocaleDateString('es-CO')}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                {!n.read && (
                                    <button onClick={() => markAsRead(n._id)}
                                        style={{ ...secondaryBtn, padding: '6px 14px', fontSize: 12 }}>
                                        Marcar leída
                                    </button>
                                )}
                                {canDelete && (
                                    <button onClick={() => deleteNotification(n._id)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none',
                                            cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const cardStyle    = { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 20, border: '1px solid #f1f5f9' };
const inputStyle   = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', color: '#0f172a', boxSizing: 'border-box' };
const labelStyle   = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' };
const primaryBtn   = { padding: '9px 20px', border: 'none', background: '#0f4c81', color: '#fff', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 };
const secondaryBtn = { padding: '9px 20px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 };