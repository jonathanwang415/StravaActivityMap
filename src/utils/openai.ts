import { Activity } from "@/types/Activity";

export function getAiCommentary(activities: Activity[]): string {
    const totalRunningMiles = activities.reduce((total, activity) => {
        if (!activity.distance || !activity.sport_type || activity.sport_type !== "Run") return total; // Skip if distance is not available
        return total + activity.distance * 3.28084 / 5280; // Convert meters to miles
    }, 0);

    const totalCyclingMiles = activities.reduce((total, activity) => {
        if (!activity.distance || !activity.sport_type || activity.sport_type !== "Ride") return total; // Skip if distance is not available
        return total + activity.distance * 3.28084 / 5280; // Convert meters to miles
    }, 0);

            {/* <p> Total Running Miles : { Math.floor(totalRunningMiles)}</p>
            <p> Total Cycling Miles : { Math.floor(totalCyclingMiles)}</p> */}

    return `Total Running Miles : ${ Math.floor(totalRunningMiles)}\nTotal Cycling Miles : ${ Math.floor(totalCyclingMiles)}`;
};