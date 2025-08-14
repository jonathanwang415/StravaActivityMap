'use client';

import React, { useEffect } from 'react';
import { getStravaAuthUrl } from '../../utils/strava';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Link } from '@radix-ui/themes';


export default function LoginPage() {
    const { isAuthenticated } = useAuth();

    const searchParams = useSearchParams();
    const token = searchParams.get('access_token');

    const { setToken } = useAuth();
    const router = useRouter();

    useEffect(() => {

        if (isAuthenticated) {
            // Redirect to home page if already authenticated
            router.push('/home');
        } else if (token) {
            setToken(token);
            router.push('/home'); // Redirect to home after setting token
        }
    }, [token]);

    return (
        <Link href={getStravaAuthUrl()} >
            Connect with Strava
        </Link>
    );
}
