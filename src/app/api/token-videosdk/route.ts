import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const API_KEY = process.env.REACT_APP_VIDEOSDK_API_KEY as string;
const SECRET_KEY = process.env.REACT_APP_VIDEOSDK_SECRET_KEY as string;

const API_BASE_URL = process.env.REACT_APP_VIDEOSDK_ENDPOINT as string;

export async function GET(req: NextRequest) {
    const meetingId = req.nextUrl.searchParams.get("meetingId") || null;

    // Generate JWT token
    const token = jwt.sign(
        {
            apikey: API_KEY,
            permissions: [
                `ask_join`, 
                'allow_join', 
                'allow_mod', 
                "allow_mic", 
                "allow_cam", 
                "publish_audio",
                "subscribe_audio",
                "publish_video",
                "subscribe_video"
            ],
            version: 2,
            // roles: ['rtc']
            // exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        SECRET_KEY,
        { expiresIn: '1h', algorithm: 'HS256' }
    );

    const url = `${API_BASE_URL}/rooms/${meetingId}`;
    const options = {
        method: "GET",
        headers: { 
            ...(token && { Authorization: token}), 
            "Content-Type": "application/json" 
        },
    };

    const response = await fetch(url, options)
    const data = await response.json()

    const roomId = data.roomId

    return NextResponse.json({ token, roomId });
}