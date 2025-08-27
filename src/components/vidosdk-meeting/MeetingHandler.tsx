'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Meeting from './Meeting';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { useNavigation } from '@/hooks/useNavigation';

const MeetingHandler = () => {
    const { id } = useParams();
    const [token, setToken] = useState<string>('');

    const user = useSelector((state: RootState) => state.user);
    const { navigate } = useNavigation()

    // Derive userName safely
    const userName =
        user?.profile
            ? `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim()
            : 'Guest User';


    useEffect(() => {
        if (typeof id === 'string' && id.length > 0) {
            getMeetingToken(id);
        }

        if (typeof window !== 'undefined' && !localStorage?.getItem('accessToken')) {
            navigate('/signin')
        }
    }, []);

    const getMeetingToken = async (meetingId: string) => {
        const response = await axios.get('/api/token-videosdk', meetingId ? { params: { meetingId } } : {});
        if (response.data.token) {
            setToken(response.data.token);
        } else {
            console.error('Failed to fetch meeting token');
        }
    }

    if (typeof window !== 'undefined' && !localStorage?.getItem('accessToken')) {
        return null;
    }

    return (
        token && id && userName &&
        <Meeting token={token} meetingId={id} participantName={userName} />
    )
}

export default MeetingHandler