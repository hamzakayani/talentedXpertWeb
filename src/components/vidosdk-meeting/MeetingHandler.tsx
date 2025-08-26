'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Meeting from './Meeting';

const MeetingHandler = () => {
    const { id } = useParams();
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        if (typeof id === 'string' && id.length > 0) {
            getMeetingToken(id);
        }
    }, [id]);

    const getMeetingToken = async (meetingId: string) => {
        const response = await axios.get('/api/token-videosdk', meetingId ? { params: { meetingId } } : {});
        console.log("VideoSDK Response:", response.data);
        if (response.data.token) {
            setToken(response.data.token);
        } else {
            console.error('Failed to fetch meeting token');
        }
    }

    return (
        token && id &&
        <Meeting token={token} meetingId={id} participantName="John Doe" />
    )
}

export default MeetingHandler