'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type LoadingContextType = {
    isLoading: boolean;
    loadingMessage?: string;
    setLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
    children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
    
    return (
        <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading, loadingMessage }}>
            {children}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}