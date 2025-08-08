'use client';

import React, { useEffect, useState } from 'react';
import ActivityMap from '../components/ActivityMap';
import { getStravaAuthUrl } from '../utils/strava';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('access_token');

    console.log('token from search params:', token);

    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token){
            console.log('No token found, skipping API call');
            return;
        }

        console.log('Fetching activities with token:', token);

        setLoading(true);

        fetch('https://www.strava.com/api/v3/athlete/activities?per_page=100', {
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

    if (loading) return <p>Loading...</p>;

    if (!token)
        return (
            <a href={getStravaAuthUrl()} className="btn">
        Connect with Strava
            </a>
        );

    if (activities.length === 0) return <p>No activities found.</p>;

    return (
        <div>
            <h1>My Strava Activities</h1>
            <ActivityMap activities={activities} />
        </div>)
}
