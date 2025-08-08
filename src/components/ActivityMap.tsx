"use client";

import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

interface Activity {
  id: number;
  name: string;
  map: {
    summary_polyline: string;
  };
  sport_type: string;
}

interface Props {
  activities: Activity[];
}

const ActivityMap: React.FC<Props> = ({ activities }) => {
    return (
        //  <div>
        //     {activities.map((activity) => {
        //         if (!activity.map.summary_polyline) {
        //             return null;
        //         }
        //         const coords = polyline.decode(activity.map.summary_polyline);
        //         return <Polyline key={activity.id} positions={coords} color="red" />;
        //     })}
        //  </div>
        <MapContainer center={[37.77, -122.42]} zoom={12} style={{ height: '90vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {activities.map((activity) => {
                if (!activity.map.summary_polyline) return null;
                const coords = polyline.decode(activity.map.summary_polyline);
                const color = activity.sport_type === "Ride" ? "red" : "blue";
                return <Polyline key={activity.id} positions={coords} color={color}/>;
            })}
        </MapContainer>
    );
};

export default ActivityMap;