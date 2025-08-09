'use client';

import React, { use, useEffect, useState } from 'react';
import ActivityMap from '../../components/ActivityMap';
import { getAiCommentary } from '../../utils/openai';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { get } from 'http';

export default function HomePage() {
    const { token, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        const router = useRouter();
        router.push('/login');
        return null; // Prevent rendering while redirecting
    }

    const [activities, setActivities] = useState<any[]>([]);
    const [aiInsights, setAiInsights] = useState<string>('');

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

                    const insight = getAiCommentary(response.data);
                    console.log('AI Insights:', insight);

                    setActivities(response.data);
                    setLoading(false);
                    setAiInsights(insight)
                }
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: Token is invalid or expired. Redirecting for re-authorization.');
                    const router = useRouter();
                    router.push('/login');
                }
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
            <p> Total Activities : {activities.length}</p>
            <p> AI Insights: {aiInsights}</p>
            <ActivityMap activities={activities} />
        </div>
    );
}
