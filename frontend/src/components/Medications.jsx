import { useState, useEffect } from 'react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

export default function Medications() {
    const { user }                        = useAuth();
    const [medications, setMedications]   = useState([]);
    const [showForm, setShowForm]         = useState(false);
    const [editingId, setEditingId]       = useState(null);
    const [stockId, setStockId]           = useState(null);
    const [stockQty, setStockQty]         = useState('');
    const [loading, setLoading]           = useState(true);
    const [form, setForm]                 = useState({ name: '', description: '', stock: '', unit: '', price: '' });

    useEffect(() => { loadMedications(); }, []);

    const loadMedications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/medications/');
            setMedications(Array.isArray(res.data) ? res.data : []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const createMedication = async () => {
        try {
            await api.post('/medications/', {
                ...form,
                stock: parseInt(form.stock) || 0,
                price: parseFloat(form.price) || 0,
            });
            setShowForm(false);
            setForm({ name: '', description: '', stock: '', unit: '', price: '' });
            loadMedications();
        } catch (e) { console.error(e); }
    };

    const updateMedication = async () => {
        try {
            await api.put(`/medications/${editingId}`, {
                name: form.name,
                description: form.description,
                unit: form.unit,
                price: parseFloat(form.price) || 0,
            });
            setEditingId(null);
            setForm({ name: '', description: '', stock: '', unit: '', price: '' });
            loadMedications();
        } catch (e) { console.error(e); }
    };

    const deleteMedication = async (id) => {
        if (!confirm('¿Está seguro de eliminar este medicamento?')) return;
        await api.delete(`/medications/${id}`);
        loadMedications();
    };

    const updateStock = async (id) => {
        if (!stockQty) return;
        try {
            await api.patch(`/medications/${id}/stock`, { quantity: parseInt(stockQty) });
            setStockId(null);
            setStockQty('');
            loadMedications();
        } catch (e) { console.error(e); }
    };

    const startEdit = (med) => {
        setEditingId(med.id);
        setForm({ name: med.name, description: med.description || '', stock: med.stock, unit: med.unit, price: med.price });
        setShowForm(false);
    };

    const isAdmin  = user?.role === 'admin';
    const canStock = user?.role === 'admin' || user?.role === 'doctor';

    const stockColor = (stock) => {
        if (stock === 0)   return { bg: '#fee2e2', color: '#dc2626', label: 'Sin stock' };
        if (stock < 10)    return { bg: '#fef9c3', color: '#a16207', label: 'Stock bajo' };
        return                    { bg: '#dcfce7', color: '#15803d', label: 'Disponible' };
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Medicamentos</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13 }}>Inventario de medicamentos del sistema hospitalario</p>
                </div>
                {isAdmin && (
                    <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', description: '', stock: '', unit: '', price: '' }); }} style={primaryBtn}>
                        + Nuevo medicamento
                    </button>
                )}
            </div>

            {/* Formulario crear */}
            {showForm && isAdmin && (
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Registrar medicamento</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Nombre</label>
                            <input placeholder="Ej: Losartán" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Unidad</label>
                            <input placeholder="Ej: mg, ml, tableta" value={form.unit}
                                onChange={e => setForm({ ...form, unit: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Stock inicial</label>
                            <input placeholder="0" type="number" value={form.stock}
                                onChange={e => setForm({ ...form, stock: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Precio (COP)</label>
                            <input placeholder="0" type="number" value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Descripción</label>
                            <input placeholder="Descripción del medicamento" value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={createMedication} style={primaryBtn}>Guardar</button>
                        <button onClick={() => setShowForm(false)} style={secondaryBtn}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* Formulario editar */}
            {editingId && isAdmin && (
                <div style={{ ...cardStyle, borderLeft: '4px solid #0f4c81' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Editar medicamento #{editingId}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Nombre</label>
                            <input value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Unidad</label>
                            <input value={form.unit}
                                onChange={e => setForm({ ...form, unit: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Precio (COP)</label>
                            <input type="number" value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Descripción</label>
                            <input value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={updateMedication} style={primaryBtn}>Actualizar</button>
                        <button onClick={() => setEditingId(null)} style={secondaryBtn}>Cancelar</button>
                    </div>
                </div>
            )}

            <div style={cardStyle}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando medicamentos...</div>
                ) : medications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No hay medicamentos registrados</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                {['ID', 'Nombre', 'Descripción', 'Unidad', 'Stock', 'Precio', 'Estado', 'Acciones'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12,
                                        fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {medications.map(m => {
                                const sc = stockColor(m.stock);
                                return (
                                    <tr key={m.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: 12 }}>#{m.id}</span></td>
                                        <td style={tdStyle}><span style={{ fontWeight: 600, color: '#0f172a' }}>{m.name}</span></td>
                                        <td style={tdStyle}><span style={{ color: '#475569', fontSize: 13 }}>{m.description || '—'}</span></td>
                                        <td style={tdStyle}><span style={{ color: '#475569' }}>{m.unit}</span></td>
                                        <td style={tdStyle}>
                                            {stockId === m.id ? (
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                    <input type="number" placeholder="±cantidad" value={stockQty}
                                                        onChange={e => setStockQty(e.target.value)}
                                                        style={{ ...inputStyle, width: 90, padding: '5px 8px' }} />
                                                    <button onClick={() => updateStock(m.id)} style={{ ...primaryBtn, padding: '5px 10px', fontSize: 12 }}>OK</button>
                                                    <button onClick={() => { setStockId(null); setStockQty(''); }} style={{ ...secondaryBtn, padding: '5px 10px', fontSize: 12 }}>✕</button>
                                                </div>
                                            ) : (
                                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{m.stock}</span>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ color: '#475569' }}>
                                                ${Number(m.price).toLocaleString('es-CO')}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ background: sc.bg, color: sc.color,
                                                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                                {sc.label}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {canStock && stockId !== m.id && (
                                                    <button onClick={() => { setStockId(m.id); setStockQty(''); }}
                                                        style={{ color: '#0f4c81', background: 'none', border: 'none',
                                                            cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                                                        Stock
                                                    </button>
                                                )}
                                                {isAdmin && (
                                                    <>
                                                        <button onClick={() => startEdit(m)}
                                                            style={{ color: '#0f4c81', background: 'none', border: 'none',
                                                                cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                                                            Editar
                                                        </button>
                                                        <button onClick={() => deleteMedication(m.id)}
                                                            style={{ color: '#ef4444', background: 'none', border: 'none',
                                                                cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                                                            Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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
