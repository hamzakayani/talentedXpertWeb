'use client';
import { FC, useCallback, useEffect, useState, memo } from 'react';
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
    const thread = useSelector((state: RootState) => state.thread); const [invitedParticipants, setInvitedParticipants] = useState<{ name: string; status: string }[]>([]);

    const initializeCall = useCallback(async () => {
        if (!thread?.id || token || meetingId) return;

        try {
            const response = await axios.post('/api/videosdk', { threadId: thread.id });
            if (!response.data.token || !response.data.roomId) {
                throw new Error('Invalid response from server');
            }
            setToken(response.data.token);
            setMeetingId(response.data.roomId);

            // Fetch invited participants dynamically
            const participantsResponse = await axios.get(`/api/thread/${thread.id}/participants`);
            const participants = participantsResponse.data.participants.map((p: { name: string }) => ({
                name: p.name,
                status: 'not_joined', // Initial status
            }));
            setInvitedParticipants([...participants.filter((p: { name: string }) => p.name !== userName), { name: userName, status: 'joined' }]);

            if (socket) {
                socket.emit('start_call', { threadId: thread.id, roomId: response.data.roomId, participants: participants.map((p: { name: string }) => p.name) });
            }
            setCallActive(true);
        } catch (error: any) {
            console.error('Error initializing video call:', error.response?.data || error.message);
            setError(`Failed to start video call: ${error.response?.data?.error || error.message}`);
        }
    }, [socket, thread, setCallActive]);

    useEffect(() => {
        initializeCall();
    }, []);

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

        const handleCallStatus = (data: { threadId: number; participantName: string; status: string }) => {
            console.log('Received call_status:', data);
            if (data.threadId === thread?.id) {
                setInvitedParticipants((prev) =>
                    prev.map((p) =>
                        p.name === data.participantName ? { ...p, status: data.status } : p
                    )
                );
            }
        };

        socket.on('start_call', handleStartCall);
        socket.on('end_call', handleEndCall);
        socket.on('call_status', handleCallStatus);

        return () => {
            socket.off('start_call', handleStartCall);
            socket.off('end_call', handleEndCall);
            socket.off('call_status', handleCallStatus);
        };
    }, [socket, thread, meetingId, setCallActive]);

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark bg-opacity-75 position-absolute top-0 start-0 w-100">
                <div className="alert alert-danger p-4 rounded">{error}</div>
            </div>
        );
    }

    if (!token || !meetingId) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark bg-opacity-75 position-absolute top-0 start-0 w-100">
                <div className="text-white fs-4">Loading video call...</div>
            </div>
        );
    }

    console.log('Rendering VideoCall:', { userName, meetingId, token });
    return (
        <div className="container-fluid vh-100 p-0 position-absolute top-0 start-0 bg-dark">
            {callActive && token  && meetingId && (
                <MeetingProvider
                    config={{
                        meetingId,
                        micEnabled: true,
                        webcamEnabled: true,
                        name: `${userName}`,
                    }}
                    token={token}
                    // joinWithoutUserInteraction
                    onError={(err: any) => {
                        console.error('MeetingProvider Error:', err);
                        setError(`MeetingProvider failed: ${err.message}`);
                    }}
                >
                    <MeetingView
                        onEnd={() => {
                            setCallActive(false);
                            if (socket) {
                                socket.emit('end_call', { threadId: thread?.id });
                            }
                        }}
                        invitedParticipants={invitedParticipants}
                    />
                </MeetingProvider>
            )}
        </div>
    );
};

const MeetingView: FC<{ onEnd: () => void; invitedParticipants: { name: string; status: string }[] }> = memo(({ onEnd, invitedParticipants }) => {
    const { participants, leave, join, toggleMic, toggleWebcam, micEnabled, webcamEnabled, isMeetingJoined } = useMeeting();
    const [micOn, setMicOn] = useState(micEnabled);
    const [webcamOn, setWebcamOn] = useState(webcamEnabled);
    const [hasJoined, setHasJoined] = useState(false);

    useEffect(() => {
        if (!hasJoined && !isMeetingJoined) {
            join();
            setHasJoined(true);
            console.log('Meeting joined');
        }
    }, [join, hasJoined, isMeetingJoined]);

    useEffect(() => {
        console.log('Participants:', Array.from(participants.keys()));
    }, [participants]);

    const participantIds = Array.from(participants.keys());
    const activeParticipants = participantIds.map((id) => {
        const participant = participants.get(id);
        return { id, name: participant?.displayName || 'Unknown', status: 'joined' };
    });

    // Merge active participants with invited participants
    const allParticipants = invitedParticipants.map((invited) => {
        const active = activeParticipants.find((p) => p.name === invited.name);
        return active || invited;
    });

    const handleEndCall = useCallback(() => {
        leave();
        onEnd();
    }, [leave, onEnd]);

    const handleToggleMic = useCallback(() => {
        toggleMic();
        setMicOn((prev: any) => !prev);
    }, [toggleMic]);

    const handleToggleWebcam = useCallback(() => {
        toggleWebcam();
        setWebcamOn((prev: any) => !prev);
    }, [toggleWebcam]);

    return (
        <div className="h-100 d-flex flex-column">
            {/* Header */}
            <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center shadow-sm">
                <h2 className="mb-0">Video Call - Thread # </h2>
                <span className="badge bg-primary rounded-pill">{participantIds.length} Participants</span>
            </div>

            {/* Video Grid */}
            <div className="flex-grow-1 p-3 overflow-auto bg-dark">
                {allParticipants.length === 0 ? (
                    <div className="h-100 d-flex justify-content-center align-items-center text-white fs-4">
                        No participants invited...
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                        {allParticipants.map((participant:any, index:number) => (
                            <div key={participant.id || `invited-${index}`} className="col">
                                {participant.status === 'joined' ? (
                                    <ParticipantView participantId={participant.id!} />
                                ) : (
                                    <div className="card h-100 bg-dark text-white border-0 shadow-sm">
                                        <div
                                            className="card-img-top bg-secondary d-flex justify-content-center align-items-center rounded-top text-white fs-5"
                                            style={{ height: '200px' }}
                                        >
                                            {participant.name} ({participant.status === 'ringing' ? 'Ringing' : participant.status === 'declined' ? 'Declined' : 'Not Joined'})
                                        </div>
                                        <div className="card-body p-2">
                                            <h5 className="card-title mb-0">{participant.name}</h5>
                                            <p className="card-text text-muted">
                                                {participant.status === 'ringing' ? 'Calling...' : participant.status === 'declined' ? 'Call declined' : 'Waiting to join...'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-dark p-3 d-flex justify-content-center gap-3 border-top shadow-sm">
                <button
                    onClick={handleToggleMic}
                    className={`btn ${micOn ? 'btn-secondary' : 'btn-danger'} rounded-circle p-3`}
                    title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                    <Icon icon={micOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={24} />
                </button>
                <button
                    onClick={handleToggleWebcam}
                    className={`btn ${webcamOn ? 'btn-secondary' : 'btn-danger'} rounded-circle p-3`}
                    title={webcamOn ? 'Turn Off Video' : 'Turn On Video'}
                >
                    <Icon icon={webcamOn ? 'mdi:video' : 'mdi:video-off'} width={24} />
                </button>
                <button
                    onClick={handleEndCall}
                    className="btn btn-danger rounded-circle p-3"
                    title="End Call"
                >
                    <Icon icon="material-symbols-light:call-end" width={24} />
                </button>
            </div>
        </div>
    );
});

const ParticipantView: FC<{ participantId: string }> = memo(({ participantId }) => {
    const { webcamStream, micStream, displayName } = useParticipant(participantId);
    const { localParticipant } = useMeeting();

    useEffect(() => {
        console.log(`Participant ${participantId}:`, { webcamStream, micStream });
    }, [webcamStream, micStream, participantId]);

    return (
        <div className="card h-100 bg-dark text-white border-0 shadow-sm">
            {webcamStream ? (
                <video
                    autoPlay
                    muted={participantId === localParticipant.id}
                    ref={(ref) => {
                        if (ref && webcamStream) {
                            const stream = new MediaStream([webcamStream.track]);
                            ref.srcObject = stream;
                            ref.play().catch((err) => console.error('Video play error:', err));
                        }
                    }}
                    className="card-img-top rounded-top object-fit-cover"
                    style={{ height: '200px' }}
                />
            ) : (
                <div
                    className="card-img-top bg-secondary d-flex justify-content-center align-items-center rounded-top text-white fs-5"
                    style={{ height: '200px' }}
                >
                    {displayName || 'No Video'}
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
            <div className="card-body p-2">
                <h5 className="card-title mb-0">{displayName || 'Participant'}</h5>
            </div>
            {!micStream && (
                <span className="position-absolute top-0 end-0 m-2 badge bg-danger rounded-circle p-2">
                    <Icon icon="mdi:microphone-off" width={16} />
                </span>
            )}
        </div>
    );
});

MeetingView.displayName = 'MeetingView';
ParticipantView.displayName = 'ParticipantView';

export default VideoCall;