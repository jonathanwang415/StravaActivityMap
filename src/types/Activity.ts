export interface Activity {
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
  //   calories: number
};