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
    // const [token, setToken] = useState<string | null>(null);

    // useEffect(() => {
    //     if (!token && code) {
    //         setLoading(true);
    //         console.log('Exchanging code for token:', code);
    //         fetch('/api/auth/exchange_token', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ code }),
    //         })
    //             .then((res) => res.json())
    //             .then((data) => {
    //                 console.log('Token exchange response:', data);
    //                 if (data.access_token) {
    //                     setToken(data.access_token);
    //                     localStorage.setItem('strava_token', data.access_token);
    //                     window.history.replaceState({}, document.title, '/');
    //                 }
    //             })
    //             .catch(console.error)
    //             .finally(() => setLoading(false));
    //     } else {
    //         console.log('Using stored token:', token);
    //         const stored = localStorage.getItem('strava_token');
    //         if (stored) setToken(stored);
    //     }
    // }, [code, token]);

    useEffect(() => {
        if (!token){
            console.log('No token found, skipping API call');
            return;
        }

        console.log('Fetching activities with token:', token);

        setLoading(true);

        // const response = await axios.post('https://www.strava.com/oauth/token', {
        //     client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        //     client_secret: process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET,
        //     code,
        //     grant_type: 'authorization_code',
        // });

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

    // return <ActivityMap activities={activities} />;
}
