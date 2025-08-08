export const getStravaAuthUrl = () => {
    return `https://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI}/exchange_token&approval_prompt=force&scope=activity:read_all`;
};