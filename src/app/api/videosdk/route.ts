import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const API_KEY = process.env.REACT_APP_VIDEOSDK_API_KEY as string;
const SECRET_KEY = process.env.REACT_APP_VIDEOSDK_SECRET_KEY as string;

const API_BASE_URL = process.env.REACT_APP_VIDEOSDK_ENDPOINT as string;

export async function POST(req: NextRequest) {
    // Generate JWT token
    const token = jwt.sign(
        {
            apikey: API_KEY,
            permissions: [`ask_join`, 'allow_join', 'allow_mod'],
            version: 2,
            // exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        SECRET_KEY,
        { expiresIn: '2h', algorithm: 'HS256' }
    );

    const url = `${API_BASE_URL}/rooms`;
    const options = {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
    };

    const response = await fetch(url, options)
    const data = await response.json()

    const roomId = data.roomId

    return NextResponse.json({ token, roomId });
}
