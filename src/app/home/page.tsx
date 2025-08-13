'use client';

import React, { use, useEffect, useState } from 'react';
import ActivityMap from '../../components/ActivityMap';
import { getAiPrompt } from '../../utils/openai';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { get } from 'http';

export default function HomePage() {
    const { token, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    if (!isAuthenticated) {
        router.push('/login');
        return null; // Prevent rendering while redirecting
    }

    const { isLoading, setLoading, loadingMessage } = useLoading();
    const [activities, setActivities] = useState<any[]>([]);
    const [aiInsights, setAiInsights] = useState<string>('');

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
            .then(stravaResponse => {
                if (stravaResponse.status !== 200) {
                    if (stravaResponse.status === 401) {
                        console.error('Unauthorized: Token is invalid or expired. Redirecting for re-authorization.');
                        const router = useRouter();
                        router.push('/login');
                    }
                } else {
                    const stravaActivities = stravaResponse.data;
                    console.log('Activities fetched successfully:', stravaActivities);

                    const prompt = getAiPrompt(stravaActivities);

                    console.log('AI Prompt:', prompt);

                    if (!aiInsights) {
                        axios.post('/api/openai', { prompt })
                        .then(openAIResponse => {
                            if (openAIResponse.status !== 200) {
                                console.error('Error fetching AI insights:', openAIResponse.statusText);
                            }

                            const insight = openAIResponse.data;
                            console.log('AI response:', insight);

                            setActivities(stravaActivities);
                            setLoading(false);
                            setAiInsights(insight.result);
                        })
                        .catch(error => {
                            console.error('Error fetching AI insights:', error);
                        });
                    }
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

        return () => {
            // logout(); // Clean up the token on unmount
            // setActivities([]);
            // setAiInsights('');
            // setLoading(false); // Reset loading state
            // console.log('Cleanup: Token cleared and state reset');
        }
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
