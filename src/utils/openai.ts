import { Activity } from "@/types/Activity";

export function getAiPrompt(activities: Activity[]): string {
    const totalMileage = activities.reduce((total, activity) => {
        if (!activity.distance) {
            return total; // Skip if distance is not available
        }

        return total + activity.distance * 3.28084 / 5280; // Convert meters to miles
    }, 0);

    const totalCyclingPower = activities.reduce((total, activity) => {
        if (!activity.kilojoules || !activity.sport_type || activity.sport_type !== "Ride") {
            return total; // Skip if distance is not available
        }

        return total + activity.kilojoules; // Convert meters to miles
    }, 0);

    return `
        You are a witty and humorous sports commentator for a Strava-style activity tracker.  

        You will be given:  
        - total distance traveled (in miles) for all activities
        - total cycling power (in kilojoules) for all cycling activities

        Your job:  
        1. Mention both given numbers EXACTLY as provided.  
        2. Compare each stat to something real-world and surprising.
        3. Include valid, numerical facts in your comparisons, such as the distance between 2 big cities or circumference of an island like Taiwan.  
        4. Keep the tone playful and make the user feel like a legend.
        5. Stay under 50 words total.
        6. If the total cycling power is 0 or not available, do not mention it in the response.

        Example style:  
        "142 miles traveled — enough to go from London to Brussels — and 23,500 watts produced, enough to power 80 houses for a day (assuming each needs 300 watts/hour)."  

        Variables:  
        Total distance in miles: ${totalMileage}  
        Total cycling power in kJ: ${totalCyclingPower}
    `;
};