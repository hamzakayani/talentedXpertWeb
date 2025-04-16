'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/Store';
import useSocket from '@/hooks/useSocket';
import VideoCall from './VideoCall';
import { endCall, receiveCall } from '@/reducers/CallSlice';

const CallHandler: React.FC = () => {
    const dispatch = useDispatch();
    const { socket } = useSocket();
    const thread = useSelector((state: RootState) => state.thread);
    const user = useSelector((state: RootState) => state.user);
    const { callActive, isCaller } = useSelector((state: RootState) => state.call);

    // Join thread room
    useEffect(() => {
        if (socket && thread?.id) {
            // socket.emit('join_thread', { threadId: thread.id });
            console.log(`Joined thread_${thread.id}`);
        }
    }, [socket, thread?.id]);

    // Derive userName safely
    const userName =
        user?.profile[0]?.type === 'TE'
            ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
            'Expert User'
            : `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
            'Requester User';

    useEffect(() => {
        if (!socket?.connected || !thread?.id) return;

        const handleCallRinging = (data: { threadId: number; roomId: string; callerName: string }) => {
            console.log('CallHandler received call_ringing:', data);
            if (data.threadId === thread.id && !callActive) {
                dispatch(receiveCall());
            }
        };

        socket.on('call_ringing', handleCallRinging);

        // return () => {
        //     socket.off('call_ringing', handleCallRinging);
        // };
    }, [socket, thread?.id, callActive, dispatch]);

    const handleEndCall = () => {
        dispatch(endCall());
    };
    console.log("callActive && thread?.id ", callActive, isCaller, thread?.id, userName)
    return callActive && thread?.id ? (
        <VideoCall userName={userName} userId={user?.profile[0]?.id} isCaller={isCaller} onEnd={handleEndCall} />
    ) : null;
};

export default CallHandler;