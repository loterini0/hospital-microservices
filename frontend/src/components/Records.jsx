import { useState, useEffect } from 'react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

export default function Records() {
    const { user }                = useAuth();
    const [records, setRecords]   = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading]   = useState(true);
    const [form, setForm]         = useState({ patient_id: '', doctor_id: '', diagnosis: '', prescription: '', notes: '' });

    useEffect(() => { loadRecords(); }, []);

    const loadRecords = async () => {
        setLoading(true);
        const res = await api.get('/records/');
        setRecords(res.data);
        setLoading(false);
    };

    const createRecord = async () => {
        await api.post('/records/', {
            ...form,
            patient_id: parseInt(form.patient_id),
            doctor_id:  parseInt(form.doctor_id),
        });
        setShowForm(false);
        setForm({ patient_id: '', doctor_id: '', diagnosis: '', prescription: '', notes: '' });
        loadRecords();
    };

    const deleteRecord = async (id) => {
        if (!confirm('¿Está seguro de eliminar este historial?')) return;
        await api.delete(`/records/${id}`);
        loadRecords();
    };

    const canCreate = user?.role === 'doctor' || user?.role === 'admin';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Historiales clínicos</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13 }}>Registros médicos y diagnósticos de pacientes</p>
                </div>
                {canCreate && (
                    <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
                        + Nuevo historial
                    </button>
                )}
            </div>

            {showForm && canCreate && (
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Registrar historial clínico</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>ID Paciente</label>
                            <input placeholder="ID del paciente" type="number" value={form.patient_id}
                                onChange={e => setForm({ ...form, patient_id: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>ID Médico</label>
                            <input placeholder="ID del médico" type="number" value={form.doctor_id}
                                onChange={e => setForm({ ...form, doctor_id: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Diagnóstico</label>
                            <input placeholder="Diagnóstico médico" value={form.diagnosis}
                                onChange={e => setForm({ ...form, diagnosis: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Prescripción</label>
                            <input placeholder="Medicamentos y dosis" value={form.prescription}
                                onChange={e => setForm({ ...form, prescription: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Notas clínicas</label>
                            <input placeholder="Observaciones adicionales" value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={createRecord} style={primaryBtn}>Guardar</button>
                        <button onClick={() => setShowForm(false)} style={secondaryBtn}>Cancelar</button>
                    </div>
                </div>
            )}

            <div style={cardStyle}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando historiales...</div>
                ) : records.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No hay historiales registrados</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                {['ID', 'Paciente', 'Médico', 'Diagnóstico', 'Prescripción', 'Notas', 'Acciones'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12,
                                        fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(r => (
                                <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: 12 }}>#{r.id}</span></td>
                                    <td style={tdStyle}><span style={{ fontWeight: 500 }}>Paciente {r.patient_id}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>Dr. {r.doctor_id}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#0f172a', fontWeight: 500 }}>{r.diagnosis}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>{r.prescription || '—'}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>{r.notes || '—'}</span></td>
                                    <td style={tdStyle}>
                                        {canCreate && (
                                            <button onClick={() => deleteRecord(r.id)}
                                                style={{ color: '#ef4444', background: 'none', border: 'none',
                                                    cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                                                Eliminar
                                            </button>
                                        )}
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