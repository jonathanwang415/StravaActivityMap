"use client";

import React, { useState } from 'react';
// Used with OpenStreetMap
// import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { GoogleMap, LoadScript, Polyline as GooglePolyline, InfoWindow } from "@react-google-maps/api";
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

interface Activity {
  id: number;
  name: string;
  map: {
    summary_polyline: string;
  };
  sport_type: string;
  average_speed: number;
  max_speed: number;
  moving_time: number;
  elaspsed_time: number;
  total_elevation_gain: number;
  distance: number;
}

const colorMap: Record<string, string> = {
    Ride: 'red',
    Run: 'blue',
    Hike: 'green',
    Walk: 'purple',
    AlpineSki: 'darkblue',
};

// Used with OpenStreetMap
// const homeCoords: number[] = [37.77, -122.42]; // Default center coordinates for the map

const defaultCenter = { lat: 37.77, lng: -122.42 };

interface Props {
  activities: Activity[];
}

const containerStyle = {
    width: "100%",
    height: "90vh",
  };

const ActivityMap: React.FC<Props> = ({ activities }) => {
    const [selectedActivity, setSelectedActivity] = useState<{
        lat: number;
        lng: number;
        name: string;
        sport_type: string;
        id: number;
        average_speed: number;
        max_speed: number;
        moving_time: number;
        total_elevation_gain: number;
        distance: number;
      } | null>(null);

    const [clicked, setClicked] = useState(false);

    const [mousePos, setMousePos] = useState<{ lat: number; lng: number } | null>(null);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
                options={{
                    mapTypeId: "roadmap", // 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
                    streetViewControl: true,
                    fullscreenControl: true,
                }}
                onMouseMove={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setMousePos({ lat, lng });
                  }}
            >
                {activities.map((activity) => {
                if (!activity.map.summary_polyline) return null;

                // Decode polyline → convert to {lat, lng} objects
                const coords = polyline.decode(activity.map.summary_polyline).map(([lat, lng]) => ({
                    lat,
                    lng,
                }));

                const color = colorMap[activity.sport_type] || "black";

                return (
                    <GooglePolyline
                        key={activity.id}
                        path={coords}
                        options={{
                            strokeColor: color,
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                        onClick={() => {
                            // Center of the polyline = middle coordinate
                            const midPoint = coords[Math.floor(coords.length / 2)];
                            setClicked(true);
                            setSelectedActivity({
                                lat: midPoint.lat,
                                lng: midPoint.lng,
                                name: activity.name,
                                sport_type: activity.sport_type,
                                id: activity.id,
                                average_speed: activity.average_speed,
                                max_speed: activity.max_speed,
                                moving_time: activity.moving_time,
                                total_elevation_gain: activity.total_elevation_gain,
                                distance: activity.distance,
                            });
                        }}
                        onMouseOver={() => {
                            if (clicked) return; // Prevent hover effect if already clicked
                            // Optionally, you can change the style on hover
                            const midPoint = coords[Math.floor(coords.length / 2)];

                            setSelectedActivity({
                                lat: mousePos ? mousePos.lat : midPoint.lat,
                                lng: mousePos ? mousePos.lng : midPoint.lng,
                                name: activity.name,
                                sport_type: activity.sport_type,
                                id: activity.id,
                                average_speed: activity.average_speed,
                                max_speed: activity.max_speed,
                                moving_time: activity.moving_time,
                                total_elevation_gain: activity.total_elevation_gain,
                                distance: activity.distance,
                            });
                        }}
                        onMouseOut={() => {
                            if (clicked) return; // Prevent mouse out effect if already clicked
                            // Optionally, you can reset the style on mouse out
                            setSelectedActivity(null)
                        }}
                    />
                );
                })}

                {selectedActivity && (
                    <InfoWindow
                        position={{ lat: selectedActivity.lat, lng: selectedActivity.lng }}
                        onCloseClick={() => {
                            setSelectedActivity(null)
                            setClicked(false);
                        }}
                    >
                        <div style={{ minWidth: "150px" }}>
                            <h3 style={{ margin: 0 }}>
                                <a href={`https://www.strava.com/activities/${selectedActivity.id}`} target="_blank">
                                    {selectedActivity.name}
                                </a>
                            </h3>

                            <p style={{ margin: 0 }}>Type: {selectedActivity.sport_type}</p>
                            <p style={{ margin: 0 }}>Average Speed: {Math.floor(selectedActivity.average_speed * 2.23694)} mph </p>
                            <p style={{ margin: 0 }}>Max Speed: {Math.floor(selectedActivity.max_speed * 2.23694)} mph</p>
                            <p style={{ margin: 0 }}>Moving Time: {Math.floor(selectedActivity.moving_time / 60)} minutes</p>
                            <p style={{ margin: 0 }}>Total Elevation Gain: {Math.floor(selectedActivity.total_elevation_gain * 3.28084)} ft</p>
                            <p style={{ margin: 0 }}>Distance: {Math.floor(selectedActivity.distance * 3.28084 / 5280)} miles</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>

        // Used with OpenStreetMap
        // <MapContainer center={homeCoords} zoom={12} style={{ height: '90vh', width: '100%' }}>
        //     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        //     {activities.map((activity) => {
        //         if (!activity.map.summary_polyline) return null;
        //         const coords = polyline.decode(activity.map.summary_polyline);
        //         const color = colorMap[activity.sport_type];
        //         return <Polyline key={activity.id} positions={coords} color={color}/>;
        //     })}
        // </MapContainer>
    );
};

export default ActivityMap;