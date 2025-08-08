'use client';

import React, { useEffect, useState } from 'react';
import ActivityMap from '../../components/ActivityMap';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const { token, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        const router = useRouter();
        router.push('/login');
        return null; // Prevent rendering while redirecting
    }

    const [activities, setActivities] = useState<any[]>([]);

    const { isLoading, setLoading, loadingMessage } = useLoading();

    useEffect(() => {
        if (!token){
            console.log('No token found, skipping API call');
            return;
        }

        console.log('Fetching activities with token:', token);

        setLoading(true);

        fetch('https://www.strava.com/api/v3/athlete/activities?per_page=200', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    // Handle unauthorized specifically
                    if (res.status === 401) {
                        console.error('Unauthorized: Token is invalid or expired. Redirecting for re-authorization.');
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
            return res.json();
        })
            .then(setActivities)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

    if (isLoading) {
        return <p>{loadingMessage}</p>
    };

    if (activities.length === 0) {
        return <p>No activities found.</p>
    };

    return (
        <div>
            <h1>My Strava Activities</h1>
            <ActivityMap activities={activities} />
        </div>
    );
}
