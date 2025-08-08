'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setTokenState] = useState<string | null>(null);

    // Load token from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('strava_token');
            if (stored) {
                setTokenState(stored);
            }
        }
    }, []);

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        if (typeof window !== 'undefined') {
            if (newToken) {
                localStorage.setItem('strava_token', newToken);
            } else {
                localStorage.removeItem('strava_token');
            }
        }
    };

    const logout = () => {
        setToken(null);
    };

    const value = {
        token,
        setToken,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}