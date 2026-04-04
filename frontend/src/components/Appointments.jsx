import { useState, useEffect } from 'react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

export default function Appointments() {
    const { user }                        = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm]         = useState(false);
    const [loading, setLoading]           = useState(true);
    const [form, setForm]                 = useState({ patient_id: '', doctor_id: '', date: '', time: '', reason: '' });

    useEffect(() => { loadAppointments(); }, []);

    const loadAppointments = async () => {
        setLoading(true);
        const res = await api.get('/appointments/');
        setAppointments(res.data);
        setLoading(false);
    };

    const createAppointment = async () => {
        await api.post('/appointments/', {
            ...form,
            patient_id: parseInt(form.patient_id),
            doctor_id:  parseInt(form.doctor_id),
            time:       form.time + ':00',
            status:     'scheduled',
        });
        setShowForm(false);
        setForm({ patient_id: '', doctor_id: '', date: '', time: '', reason: '' });
        loadAppointments();
    };

    const deleteAppointment = async (id) => {
        if (!confirm('¿Está seguro de cancelar esta cita?')) return;
        await api.delete(`/appointments/${id}`);
        loadAppointments();
    };

    const canCreate = ['patient', 'admin'].includes(user?.role);

    const statusConfig = {
        scheduled: { label: 'Programada', bg: '#dbeafe', color: '#1d4ed8' },
        completed: { label: 'Completada', bg: '#dcfce7', color: '#15803d' },
        cancelled: { label: 'Cancelada',  bg: '#fee2e2', color: '#dc2626' },
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Citas médicas</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13 }}>Gestione las citas médicas del sistema</p>
                </div>
                {canCreate && (
                    <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
                        + Nueva cita
                    </button>
                )}
            </div>

            {showForm && canCreate && (
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Registrar nueva cita</h3>
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
                        <div>
                            <label style={labelStyle}>Fecha</label>
                            <input type="date" value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Hora</label>
                            <input type="time" value={form.time}
                                onChange={e => setForm({ ...form, time: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Motivo de consulta</label>
                            <input placeholder="Describa el motivo de la consulta" value={form.reason}
                                onChange={e => setForm({ ...form, reason: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={createAppointment} style={primaryBtn}>Guardar</button>
                        <button onClick={() => setShowForm(false)} style={secondaryBtn}>Cancelar</button>
                    </div>
                </div>
            )}

            <div style={cardStyle}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando citas...</div>
                ) : appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No hay citas registradas</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                {['ID', 'Paciente', 'Médico', 'Fecha', 'Hora', 'Motivo', 'Estado', 'Acciones'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12,
                                        fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: 12 }}>#{a.id}</span></td>
                                    <td style={tdStyle}><span style={{ fontWeight: 500 }}>Paciente {a.patient_id}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>Dr. {a.doctor_id}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>{a.date}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>{a.time}</span></td>
                                    <td style={tdStyle}><span style={{ color: '#475569' }}>{a.reason}</span></td>
                                    <td style={tdStyle}>
                                        <span style={{ background: statusConfig[a.status]?.bg, color: statusConfig[a.status]?.color,
                                            padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                            {statusConfig[a.status]?.label}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        {canCreate && (
                                            <button onClick={() => deleteAppointment(a.id)}
                                                style={{ color: '#ef4444', background: 'none', border: 'none',
                                                    cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                                                Cancelar
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