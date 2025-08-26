import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const API_KEY = process.env.REACT_APP_VIDEOSDK_API_KEY as string;
const SECRET_KEY = process.env.REACT_APP_VIDEOSDK_SECRET_KEY as string;

const API_BASE_URL = process.env.REACT_APP_VIDEOSDK_ENDPOINT as string;


export async function GET(req: NextRequest) {
    // Generate JWT token
    const token = jwt.sign(
        {
            apikey: API_KEY,
            permissions: [`ask_join`, 'allow_join', 'allow_mod'],
            roomId: `${req.nextUrl.searchParams.get('meetingId')}`,
            version: 2,
        },
        SECRET_KEY,
        { expiresIn: '2h', algorithm: 'HS256' }
    );

    return NextResponse.json({ token });
}
