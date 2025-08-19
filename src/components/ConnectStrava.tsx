"use client";

import React from 'react';
import { getStravaAuthUrl } from '../utils/strava';

const ConnectStrava: React.FC= () => {
    return (
        <a href={getStravaAuthUrl()} className="btn">
            Connect with Strava Now!
        </a>
    );
};

export default ConnectStrava;