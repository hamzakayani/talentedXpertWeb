'use client';
import { FC, useCallback, useEffect, useState } from 'react';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { Icon } from '@iconify/react';
import useSocket from '@/hooks/useSocket';

const VideoCall: FC<any> = ({ callActive, setCallActive, onEnd, userName }) => {
    const [token, setToken] = useState<string | null>(null);
    const [meetingId, setMeetingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { socket } = useSocket();
    const thread = useSelector((state: RootState) => state.thread);

    // Memoized function to initialize the call
    const initializeCall = useCallback(async () => {
        if (!thread?.id || token || meetingId) return; // Prevent re-initialization
        try {
            const response = await axios.post('/api/videosdk', { threadId: thread.id });
            setToken(response.data.token);
            setMeetingId(response.data.roomId);
            console.log('Call initialized:', { token: response.data.token, roomId: response.data.roomId });

            if (socket) {
                socket.emit('start_call', {
                    threadId: thread.id,
                    roomId: response.data.roomId,
                });
            }
            setCallActive(true);
        } catch (error) {
            console.error('Error initializing video call:', error);
            setError('Failed to start video call. Please try again.');
        }
    }, [socket, thread, token, meetingId]);

    // Initialize call only once
    useEffect(() => {
        initializeCall();
    }, [initializeCall]);

    // Socket.IO event handling with cleanup
    useEffect(() => {
        if (!socket) return;

        const handleStartCall = (data: { threadId: number; roomId: string }) => {
            console.log('Received start_call:', data);
            if (data.threadId === thread?.id && !meetingId) {
                setMeetingId(data.roomId);
                setCallActive(true);
            }
        };

        const handleEndCall = (data: { threadId: number }) => {
            console.log('Received end_call:', data);
            if (data.threadId === thread?.id) {
                setCallActive(false);
            }
        };

        socket.on('start_call', handleStartCall);
        socket.on('end_call', handleEndCall);

        return () => {
            socket.off('start_call', handleStartCall);
            socket.off('end_call', handleEndCall);
        };
    }, [socket, thread, meetingId]);

    if (error) {
        return (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-[1000]">
                <div className="bg-white p-4 rounded-lg text-red-500">{error}</div>
            </div>
        );
    }

    if (!token || !meetingId) {
        return (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-[1000]">
                <div className="text-white">Loading video call...</div>
            </div>
        );
    }
console.log(":::", userName)
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 z-[1000]">
            {/* {callActive && (
                <MeetingProvider
                    config={{
                        meetingId,
                        micEnabled: true,
                        webcamEnabled: true,
                        name: `${userName}`,
                    }}
                    token={token}
                >
                    <MeetingView
                        onEnd={() => {
                            setCallActive(false);
                            if (socket) {
                                socket.emit('end_call', { threadId: thread?.id });
                            }
                        }}
                    />
                </MeetingProvider>
            )} */}
        </div>
    );
};

const MeetingView = ({ onEnd }: { onEnd: () => void }) => {
    const { participants, leave, join, toggleMic, toggleWebcam, micEnabled, webcamEnabled } = useMeeting();
    const [micOn, setMicOn] = useState(micEnabled);
    const [webcamOn, setWebcamOn] = useState(webcamEnabled);

    useEffect(() => {
        join();
        console.log('Meeting joined');
    }, [join]);

    useEffect(() => {
        console.log('Participants:', Array.from(participants.keys()));
    }, [participants]);

    const participantIds = Array.from(participants.keys());

    const handleEndCall = () => {
        leave();
        onEnd();
    };

    const handleToggleMic = () => {
        toggleMic();
        setMicOn((prev:any) => !prev);
    };

    const handleToggleWebcam = () => {
        toggleWebcam();
        setWebcamOn((prev:any) => !prev);
    };

    return (
        <div className="relative w-full h-full flex flex-col">
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Video Call - Thread # 1</h2>
                <div className="flex items-center gap-4">
                    <span>{participantIds.length} Participants</span>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-auto">
                {participantIds.length === 0 ? (
                    <div className="text-center text-white">Waiting for participants...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {participantIds.map((id:any) => (
                            <ParticipantView key={id} participantId={id} />
                        ))}
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gray-800 p-4 flex justify-center items-center gap-6">
                <button
                    onClick={handleToggleMic}
                    className={`p-3 rounded-full ${micOn ? 'bg-gray-600' : 'bg-red-500'} text-white`}
                    title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                    <Icon icon={micOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={24} />
                </button>
                <button
                    onClick={handleToggleWebcam}
                    className={`p-3 rounded-full ${webcamOn ? 'bg-gray-600' : 'bg-red-500'} text-white`}
                    title={webcamOn ? 'Turn Off Video' : 'Turn On Video'}
                >
                    <Icon icon={webcamOn ? 'mdi:video' : 'mdi:video-off'} width={24} />
                </button>
                <button
                    onClick={handleEndCall}
                    className="p-3 rounded-full bg-red-600 text-white"
                    title="End Call"
                >
                    <Icon icon="material-symbols-light:call-end" width={24} />
                </button>
            </div>
        </div>
    );
};

const ParticipantView = ({ participantId }: { participantId: string }) => {
    const { webcamStream, micStream, displayName } = useParticipant(participantId);

    useEffect(() => {
        console.log(`Participant ${participantId}:`, { webcamStream, micStream });
    }, [webcamStream, micStream, participantId]);

    return (
        <div className="relative border rounded-lg overflow-hidden bg-black">
            {webcamStream ? (
                <video
                    autoPlay
                    muted={participantId === useMeeting().localParticipant.id}
                    ref={(ref) => {
                        if (ref && webcamStream) {
                            const stream = new MediaStream([webcamStream.track]);
                            ref.srcObject = stream;
                            ref.play().catch((err) => console.error('Video play error:', err));
                        }
                    }}
                    className="w-full h-64 object-cover"
                />
            ) : (
                <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                    <span className="text-white text-lg">{displayName || 'No Video'}</span>
                </div>
            )}
            {micStream && (
                <audio
                    autoPlay
                    ref={(ref) => {
                        if (ref && micStream) {
                            const stream = new MediaStream([micStream.track]);
                            ref.srcObject = stream;
                            ref.play().catch((err) => console.error('Audio play error:', err));
                        }
                    }}
                />
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white p-1 rounded">
                {displayName}
            </div>
            {!micStream && (
                <div className="absolute top-2 right-2 bg-red-500 p-1 rounded-full">
                    <Icon icon="mdi:microphone-off" width={16} />
                </div>
            )}
        </div>
    );
};

export default VideoCall;