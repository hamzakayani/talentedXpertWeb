import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const API_KEY = process.env.REACT_APP_VIDEOSDK_API_KEY as string;
const SECRET_KEY = process.env.REACT_APP_VIDEOSDK_SECRET_KEY as string;

export async function POST(req: NextRequest) {
    const { threadId } = await req.json();

    // Generate JWT token
    const token = jwt.sign(
        {
            apikey: API_KEY,
            permissions: ['allow_join'],
            version: 2,
        },
        SECRET_KEY,
        { expiresIn: '2h' }
    );

    // Use threadId as roomId (or generate a new one via VideoSDK API if needed)
    const roomId = `room-${threadId}`;

    return NextResponse.json({ token, roomId });
}