import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [tab, setTab]       = useState('login');
    const [error, setError]   = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate            = useNavigate();

    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [regForm, setRegForm]     = useState({
        name: '', email: '', password: '', role: 'patient', question: '', answer: ''
    });

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await login(loginForm.email, loginForm.password);
            navigate('/dashboard');
        } catch {
            setError('Credenciales incorrectas. Verifique su email y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        try {
            await register(regForm);
            navigate('/dashboard');
        } catch {
            setError('Error al registrarse. Verifique los datos ingresados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f1f5f9' }}>
            {/* Left panel */}
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #0f4c81 0%, #1a6ba0 50%, #0e7490 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 60, color: '#fff' }}>
                <div style={{ maxWidth: 420 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
                        <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)',
                            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 700 }}>MediSystem</div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>Sistema de Gestión Hospitalaria</div>
                        </div>
                    </div>
                    <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>
                        Gestión hospitalaria inteligente
                    </h1>
                    <p style={{ fontSize: 16, opacity: 0.8, lineHeight: 1.7 }}>
                        Plataforma integrada para la administración de pacientes, citas médicas e historiales clínicos.
                    </p>
                    <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { icon: '⚕', text: 'Gestión de citas y pacientes' },
                            { icon: '📋', text: 'Historiales clínicos digitales' },
                            { icon: '🔔', text: 'Notificaciones en tiempo real' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)',
                                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                    {item.icon}
                                </div>
                                <span style={{ opacity: 0.9 }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                        {tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: 32 }}>
                        {tab === 'login' ? 'Ingrese sus credenciales para acceder al sistema' : 'Complete los datos para registrarse'}
                    </p>

                    <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 28 }}>
                        {['login', 'register'].map(t => (
                            <button key={t} onClick={() => { setTab(t); setError(''); }}
                                style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, cursor: 'pointer',
                                    fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
                                    background: tab === t ? '#fff' : 'transparent',
                                    color: tab === t ? '#0f172a' : '#64748b',
                                    boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
                                {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                            </button>
                        ))}
                    </div>

                    {tab === 'login' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Correo electrónico</label>
                                <input placeholder="correo@hospital.com" type="email" value={loginForm.email}
                                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                                    style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Contraseña</label>
                                <input placeholder="••••••••" type="password" value={loginForm.password}
                                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                    style={inputStyle} />
                            </div>
                            <button onClick={handleLogin} disabled={loading} style={primaryBtn}>
                                {loading ? 'Ingresando...' : 'Ingresar al sistema'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={labelStyle}>Nombre completo</label>
                                <input placeholder="Dr. Juan Pérez" value={regForm.name}
                                    onChange={e => setRegForm({ ...regForm, name: e.target.value })} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Correo electrónico</label>
                                <input placeholder="correo@hospital.com" type="email" value={regForm.email}
                                    onChange={e => setRegForm({ ...regForm, email: e.target.value })} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Contraseña</label>
                                <input placeholder="Mínimo 8 caracteres" type="password" value={regForm.password}
                                    onChange={e => setRegForm({ ...regForm, password: e.target.value })} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Rol</label>
                                <select value={regForm.role} onChange={e => setRegForm({ ...regForm, role: e.target.value })} style={inputStyle}>
                                    <option value="patient">Paciente</option>
                                    <option value="doctor">Médico</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Pregunta de seguridad</label>
                                <input placeholder="Ej: ¿Nombre de su mascota?" value={regForm.question}
                                    onChange={e => setRegForm({ ...regForm, question: e.target.value })} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Respuesta</label>
                                <input placeholder="Respuesta secreta" value={regForm.answer}
                                    onChange={e => setRegForm({ ...regForm, answer: e.target.value })} style={inputStyle} />
                            </div>
                            <button onClick={handleRegister} disabled={loading} style={primaryBtn}>
                                {loading ? 'Registrando...' : 'Crear cuenta'}
                            </button>
                        </div>
                    )}

                    {error && (
                        <div style={{ marginTop: 16, padding: '12px 16px', background: '#fef2f2',
                            border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, outline: 'none', background: '#fff', color: '#0f172a', boxSizing: 'border-box',
    transition: 'border-color 0.2s' };
const primaryBtn = { padding: '12px', borderRadius: 8, border: 'none', background: '#0f4c81',
    color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 15, width: '100%', marginTop: 8 };