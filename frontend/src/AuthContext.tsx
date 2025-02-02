import React, { createContext, useContext, useState } from 'react';
import { User, AuthState } from './types';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
    });

    const login = async (email: string, password: string) => {
        const response = await fetch('https://ctdt-d.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        return data.user;
    };

    const register = async (email: string, password: string, name: string) => {
    try {
        const response = await fetch('https://ctdt-d.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const userData = await response.json();
        setAuthState({ user: userData, isAuthenticated: true });
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
    };

    const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    };

    return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};