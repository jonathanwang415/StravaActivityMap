'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            // Redirect to home page if already authenticated
            router.push('/home');
        } else {
            // Redirect to login page if not authenticated
            router.push('/login');
        }
    }, [isAuthenticated]);

    return null;
}