import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ active, setActive }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const allTabs = [
        { id: 'users',         label: 'Usuarios',        roles: ['admin'] },
        { id: 'appointments',  label: 'Citas',            roles: ['patient', 'doctor', 'admin'] },
        { id: 'records',       label: 'Historiales',      roles: ['doctor', 'admin'] },
        { id: 'notifications', label: 'Notificaciones',   roles: ['patient', 'doctor', 'admin'] },
    ];

    const tabs = allTabs.filter(t => t.roles.includes(user?.role));

    const roleLabel = { admin: 'Administrador', doctor: 'Médico', patient: 'Paciente' };
    const roleColor = { admin: '#7c3aed', doctor: '#0f4c81', patient: '#0e7490' };

    return (
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', height: 64 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: '#0f4c81', borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>MediSystem</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Gestión Hospitalaria</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActive(tab.id)}
                            style={{ padding: '8px 18px', border: 'none', borderRadius: 8, cursor: 'pointer',
                                fontWeight: 500, fontSize: 13, transition: 'all 0.15s',
                                background: active === tab.id ? '#eff6ff' : 'transparent',
                                color: active === tab.id ? '#0f4c81' : '#64748b' }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{user?.name}</div>
                        <div style={{ fontSize: 11, color: roleColor[user?.role], fontWeight: 600 }}>
                            {roleLabel[user?.role]}
                        </div>
                    </div>
                    <div style={{ width: 36, height: 36, background: roleColor[user?.role] + '20',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, color: roleColor[user?.role], fontSize: 14 }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <button onClick={handleLogout}
                        style={{ padding: '7px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8,
                            background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}