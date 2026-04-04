import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Users from '../components/Users';
import Appointments from '../components/Appointments';
import Records from '../components/Records';
import Medications from "../components/Medications";
import Notifications from '../components/Notifications';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate  = useNavigate();

    const defaultTab = user?.role === 'admin' ? 'users'
        : user?.role === 'doctor' ? 'appointments'
        : 'appointments';

    const [active, setActive] = useState(defaultTab);

    const sections = {
        users:         <Users />,
        appointments:  <Appointments />,
        records:       <Records />,
        notifications: <Notifications />,
        medications: <Medications />,
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
            <Navbar active={active} setActive={setActive} />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
                {sections[active]}
            </div>
        </div>
    );
}