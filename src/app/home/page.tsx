'use client';

import React, { useEffect, useState } from 'react';
import ActivityMap from '../../components/ActivityMap';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params : {
                per_page: 200
            }
        };

        axios.get('https://www.strava.com/api/v3/athlete/activities', config)
            .then(response => {
                if (response.status !== 200) {
                    if (response.status === 401) {
                        console.error('Unauthorized: Token is invalid or expired. Redirecting for re-authorization.');
                        const router = useRouter();
                        router.push('/login');
                    } 
                } else {
                    console.log('Activities fetched successfully:', response.data);
                    setActivities(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: Token is invalid or expired. Redirecting for re-authorization.');
                    const router = useRouter();
                    router.push('/login');
                }
            })
            .finally(() => {
                setLoading(false);
            }); 
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
