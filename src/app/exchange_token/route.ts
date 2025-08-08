import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Handle GET request from Strava redirect
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/?error=missing_code', req.url));
    }

    console.log('Exchanging code for token (GET):', code);

    try {
        const tokenData = await exchangeCodeForToken(code);
        
        // Redirect to login page - you can handle the token on the frontend
        return NextResponse.redirect(new URL(`/login?access_token=${tokenData.access_token}`, req.url));
    } catch (error) {
        console.error('GET token exchange error:', error);
        return NextResponse.redirect(new URL('/?error=token_exchange_failed', req.url));
    }
}

// Shared function to exchange code for token
async function exchangeCodeForToken(code: string) {
    const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
    });

    return response.data;
}