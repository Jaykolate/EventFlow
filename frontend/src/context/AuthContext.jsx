import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const res = await api.get('/auth/me/');
                setUser(res.data);
            }
        } catch (error) {
            console.error('Auth verification failed', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login/', { email, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            await checkUser();
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Login failed.');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register/', userData);
            localStorage.setItem('access_token', res.data.tokens.access);
            localStorage.setItem('refresh_token', res.data.tokens.refresh);
            setUser(res.data.user);
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            const errMsg = Object.values(error.response?.data || {}).flat().join(', ');
            toast.error(errMsg || 'Registration failed.');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        toast.success('Logged out successfully.');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
