import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const API_KEY = process.env.REACT_APP_VIDEOSDK_API_KEY as string;
const SECRET_KEY = process.env.REACT_APP_VIDEOSDK_SECRET_KEY as string;

const API_BASE_URL = "https://api.videosdk.live";

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
    // const roomId = `room-${threadId}`;

    const url = `${API_BASE_URL}/v2/rooms`;
    const options = {
        method: "POST",
        headers: { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlNTZjOTBjZC1mNGZiLTQxZWItYWMzOC1mNDM4M2FjMzZhYjciLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sInZlcnNpb24iOjIsImlhdCI6MTc0NDAxMDUyMSwiZXhwIjoxNzQ0MDE3NzIxfQ.yM0aC7VkAiDGLonnRjZqMQOOeKMfmoHFRU0FE0Od5CM', "Content-Type": "application/json" },
    };

    const response = await fetch(url, options)
    const data = await response.json()
console.log("::: meeting", data)
    const roomId = data.roomId

    return NextResponse.json({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlNTZjOTBjZC1mNGZiLTQxZWItYWMzOC1mNDM4M2FjMzZhYjciLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sInZlcnNpb24iOjIsImlhdCI6MTc0NDAxMDUyMSwiZXhwIjoxNzQ0MDE3NzIxfQ.yM0aC7VkAiDGLonnRjZqMQOOeKMfmoHFRU0FE0Od5CM', roomId });
}