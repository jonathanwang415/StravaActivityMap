'use client';

import React, { useRef, useEffect, useState } from 'react';
import ActivityMap from '../../components/ActivityMap';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Activity } from '@/types/Activity';

export default function HomePage() {
    const { token } = useAuth();
    const router = useRouter();

    const { isLoading, setLoading, loadingMessage } = useLoading();
    const [activities, setActivities] = useState<any[]>([]);
    const [totalMileage, setTotalMileage] = useState<number>(0);
    const [totalCyclingPower, setTotalCyclingPower] = useState<number>(0);
    const [aiInsights, setAiInsights] = useState<string>('');
    const hasFetched = useRef(false);


    useEffect(() => {
        if (!token){    
            console.log('No token found, skipping API call');
            setTimeout(() => {
                router.push('/login');
            }, 0);
            return;
        }

        if (activities && aiInsights) {
            return; // Skip if activities and insights are already set
        }

        if (hasFetched.current) {
            return;
        }

        hasFetched.current = true;

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

        if (!isLoading) {
            return;
        }

        axios.get('https://www.strava.com/api/v3/athlete/activities', config)
            .then(stravaResponse => {
                if (stravaResponse.status !== 200) {
                    if (stravaResponse.status === 401) {
                        console.error('Unauthorized: Token is invalid or expired. Redirecting for re-authorization.');
                        const router = useRouter();
                        router.push('/login');
                    }
                } else {
                    const stravaActivities: Activity [] = stravaResponse.data;
                    console.log('Activities fetched successfully:', stravaActivities);

                    const mileage = stravaActivities.reduce((total, activity) => {
                        if (!activity.distance) {
                            return total; // Skip if distance is not available
                        }
                
                        return total + activity.distance * 3.28084 / 5280; // Convert meters to miles
                    }, 0);
                
                    const power = stravaActivities.reduce((total, activity) => {
                        if (!activity.kilojoules || !activity.sport_type || activity.sport_type !== "Ride") {
                            return total; // Skip if distance is not available
                        }
                
                        return total + activity.kilojoules; // Convert meters to miles
                    }, 0);

                    console.log('totalMileage:', mileage);
                    console.log('totalCyclingPower:', power);

                    axios.post('/api/openai', { mileage, power })
                        .then(openAIResponse => {
                            if (openAIResponse.status !== 200) {
                                console.error('Error fetching AI insights:', openAIResponse.statusText);
                            }

                            const insight = openAIResponse.data;
                            console.log('AI response:', insight);

                            setActivities(stravaActivities);
                            setTotalMileage(mileage);
                            setTotalCyclingPower(power);
                            setLoading(false);
                            setAiInsights(insight.result);
                        })
                        .catch(error => {
                            console.error('Error fetching AI insights:', error);
                        });
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
            <p>Total Mileage: {totalMileage.toFixed(0)} miles</p>
            <p>Total Cycling Power: {totalCyclingPower > 0 ? `${totalCyclingPower.toFixed(0)} kJ` : 'N/A'}</p>
            <p> Total Activities : {activities.length}</p>
            <p> AI Insights: {aiInsights}</p>
            <ActivityMap activities={activities} />
        </div>
    );
}
