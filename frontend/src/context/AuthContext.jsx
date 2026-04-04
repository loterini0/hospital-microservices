import { createContext, useContext, useState } from 'react';
import api from '../api/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken]       = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
    try {
        return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
        return {};
    }
});
    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        setToken(res.data.access_token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
    };

    const register = async (data) => {
        const res = await api.post('/auth/register', data);
        setToken(res.data.access_token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setToken(null);
        setUser({});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);