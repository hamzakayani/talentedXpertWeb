// 'use client';
// import { FC, useCallback, useEffect, useState, memo } from 'react';
// import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/Store';
// import { Icon } from '@iconify/react';
// import useSocket from '@/hooks/useSocket';
// import apiCall from '@/services/apiCall/apiCall';
// import { requests } from '@/services/requests/requests';

// const VideoCall: FC<any> = ({ callActive, setCallActive, onEnd, userName }) => {
//     const [token, setToken] = useState<string | null>(null);
//     const [meetingId, setMeetingId] = useState<string | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const { socket } = useSocket();
//     const thread = useSelector((state: RootState) => state.thread);
//     const [invitedParticipants, setInvitedParticipants] = useState<{ name: string; status: string }[]>([]);

//     const initializeCall = useCallback(async () => {
//         if (!thread?.id || token || meetingId) return;

//         try {
//             const response = await axios.post('/api/videosdk', { threadId: thread.id });
//             if (!response.data.token || !response.data.roomId) {
//                 throw new Error('Invalid response from server');
//             }
//             setToken(response.data.token);
//             setMeetingId(response.data.roomId);

//             // Fetch invited participants dynamically
//             let participants: { name: string; status: string }[] = [];
//             try {
//                 const participantsResponse = await axios.get(`/api/thread/${thread.id}/participants`, { params: thread });
//                 const participantsData = participantsResponse.data.participants;
//                 console.log(":::", participantsData)
//                 if (!Array.isArray(participantsData)) {
//                     console.warn('Participants data is not an array, using empty list:', participantsData);
//                 } else {
//                     participants = participantsData.map((p: { name: string }) => ({
//                         name: p.name,
//                         status: 'not_joined',
//                     }));
//                 }
//             } catch (participantsError: any) {
//                 console.error('Error fetching participants:', participantsError.response?.data || participantsError.message);
//             }
//             console.log("{{{", participants)
//             setInvitedParticipants([
//                 ...participants.filter((p: { name: string }) => p.name !== userName),
//                 { name: userName, status: 'joined' },
//             ]);

//             if (socket) {
//                 console.log(">>>", socket)
//                 socket.emit('start_call', { threadId: thread.id, roomId: response.data.roomId, participants: participants.map((p: { name: string }) => p.name) });
//             }
//             setCallActive(true);
//         } catch (error: any) {
//             console.error('Error initializing video call:', error.response?.data || error.message);
//             setError(`Failed to start video call: ${error.response?.data?.error || error.message}`);
//         }
//     }, [socket, thread, setCallActive, token, meetingId, userName]);

//     useEffect(() => {
//         initializeCall();
//     }, []);

//     useEffect(() => {
//         if (!socket) return;

//         const handleStartCall = (data: { threadId: number; roomId: string }) => {
//             console.log('Received start_call:', data);
//             if (data.threadId === thread?.id && !meetingId) {
//                 setMeetingId(data.roomId);
//                 setCallActive(true);
//             }
//         };

//         const handleEndCall = (data: { threadId: number }) => {
//             console.log('Received end_call:', data);
//             if (data.threadId === thread?.id) {
//                 setCallActive(false);
//             }
//         };

//         const handleCallStatus = (data: { threadId: number; participantName: string; status: string }) => {
//             console.log('Received call_status:', data);
//             if (data.threadId === thread?.id) {
//                 setInvitedParticipants((prev) =>
//                     prev.map((p) =>
//                         p.name === data.participantName ? { ...p, status: data.status } : p
//                     )
//                 );
//             }
//         };

//         socket.on('start_call', handleStartCall);
//         socket.on('end_call', handleEndCall);
//         socket.on('call_status', handleCallStatus);

//         return () => {
//             socket.off('start_call', handleStartCall);
//             socket.off('end_call', handleEndCall);
//             socket.off('call_status', handleCallStatus);
//         };
//     }, [socket, thread, meetingId, setCallActive]);

//     if (error) {
//         return (
//             <div className="d-flex justify-content-center align-items-center vh-100 bg-dark bg-opacity-75 position-absolute top-0 start-0 w-100">
//                 <div className="alert alert-danger p-4 rounded">{error}</div>
//             </div>
//         );
//     }

//     if (!token || !meetingId) {
//         return (
//             <div className="d-flex justify-content-center align-items-center vh-100 bg-dark bg-opacity-75 position-absolute top-0 start-0 w-100">
//                 <div className="text-white fs-4">Loading video call...</div>
//             </div>
//         );
//     }

//     return (
//         <div className="container-fluid vh-100 p-0 position-absolute top-0 start-0 bg-dark">
//             {callActive && token && meetingId && (
//                 <MeetingProvider
//                     config={{
//                         meetingId,
//                         micEnabled: true,
//                         webcamEnabled: true,
//                         name: `${userName}`,
//                     }}
//                     token={token}
//                     joinWithoutUserInteraction
//                     onError={(err: any) => {
//                         console.error('MeetingProvider Error:', err);
//                         setError(`MeetingProvider failed: ${err.message}`);
//                     }}
//                 >
//                     <MeetingView
//                         onEnd={() => {
//                             setCallActive(false);
//                             if (socket) {
//                                 socket.emit('end_call', { threadId: thread?.id });
//                             }
//                         }}
//                         invitedParticipants={invitedParticipants}
//                     />
//                 </MeetingProvider>
//             )}
//         </div>
//     );
// };

// const MeetingView: FC<{ onEnd: () => void; invitedParticipants: { name: string; status: string }[] }> = memo(({ onEnd, invitedParticipants }) => {
//     const { participants, leave, join, toggleMic, toggleWebcam, micEnabled, webcamEnabled, isMeetingJoined } = useMeeting();
//     const [micOn, setMicOn] = useState(micEnabled);
//     const [webcamOn, setWebcamOn] = useState(webcamEnabled);
//     const [hasJoined, setHasJoined] = useState(false);

//     useEffect(() => {
//         if (!hasJoined && !isMeetingJoined) {
//             join();
//             setHasJoined(true);
//             console.log('Meeting joined');
//         }
//     }, [join, hasJoined, isMeetingJoined]);

//     useEffect(() => {
//         console.log('Participants:', Array.from(participants.keys()));
//     }, [participants]);

//     const participantIds = Array.from(participants.keys());
//     const activeParticipants = participantIds.map((id) => {
//         const participant = participants.get(id);
//         return { id, name: participant?.displayName || 'Unknown', status: 'joined' };
//     });

//     // Merge active participants with invited participants
//     const allParticipants = invitedParticipants.map((invited) => {
//         const active = activeParticipants.find((p) => p.name === invited.name);
//         return active || invited;
//     });
//     console.log(":::", invitedParticipants)
//     const handleEndCall = useCallback(() => {
//         leave();
//         onEnd();
//     }, [leave, onEnd]);

//     const handleToggleMic = useCallback(() => {
//         toggleMic();
//         setMicOn((prev: any) => !prev);
//     }, [toggleMic]);

//     const handleToggleWebcam = useCallback(() => {
//         toggleWebcam();
//         setWebcamOn((prev: any) => !prev);
//     }, [toggleWebcam]);

//     return (
//         <div className="h-100 d-flex flex-column">
//             {/* Header */}
//             <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center shadow-sm">
//                 <h2 className="mb-0">Video Call - Thread # </h2>
//                 <span className="badge bg-primary rounded-pill">{participantIds.length} Participants</span>
//             </div>

//             {/* Video Grid */}
//             <div className="flex-grow-1 p-3 overflow-auto bg-dark">
//                 {allParticipants.length === 0 ? (
//                     <div className="h-100 d-flex justify-content-center align-items-center text-white fs-4">
//                         No participants invited...
//                     </div>
//                 ) : (
//                     <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
//                         {allParticipants.map((participant: any, index: number) => (
//                             <div key={participant.id || `invited-${index}`} className="col">
//                                 {participant.status === 'joined' ? (
//                                     <ParticipantView participantId={participant.id!} />
//                                 ) : (
//                                     <div className="card h-100 bg-dark text-white border-0 shadow-sm">
//                                         <div
//                                             className="card-img-top bg-secondary d-flex justify-content-center align-items-center rounded-top text-white fs-5"
//                                             style={{ height: '200px' }}
//                                         >
//                                             {participant.name} ({participant.status === 'ringing' ? 'Ringing' : participant.status === 'declined' ? 'Declined' : 'Not Joined'})
//                                         </div>
//                                         <div className="card-body p-2">
//                                             <h5 className="card-title mb-0">{participant.name}</h5>
//                                             <p className="card-text text-muted">
//                                                 {participant.status === 'ringing' ? 'Calling...' : participant.status === 'declined' ? 'Call declined' : 'Waiting to join...'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Controls */}
//             <div className="bg-dark p-3 d-flex justify-content-center gap-3 border-top shadow-sm">
//                 <button
//                     onClick={handleToggleMic}
//                     className={`btn ${micOn ? 'btn-secondary' : 'btn-danger'} rounded-circle p-3`}
//                     title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
//                 >
//                     <Icon icon={micOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={24} />
//                 </button>
//                 <button
//                     onClick={handleToggleWebcam}
//                     className={`btn ${webcamOn ? 'btn-secondary' : 'btn-danger'} rounded-circle p-3`}
//                     title={webcamOn ? 'Turn Off Video' : 'Turn On Video'}
//                 >
//                     <Icon icon={webcamOn ? 'mdi:video' : 'mdi:video-off'} width={24} />
//                 </button>
//                 <button
//                     onClick={handleEndCall}
//                     className="btn btn-danger rounded-circle p-3"
//                     title="End Call"
//                 >
//                     <Icon icon="material-symbols-light:call-end" width={24} />
//                 </button>
//             </div>
//         </div>
//     );
// });

// const ParticipantView: FC<{ participantId: string }> = memo(({ participantId }) => {
//     const { webcamStream, micStream, displayName } = useParticipant(participantId);
//     const { localParticipant } = useMeeting();

//     useEffect(() => {
//         console.log(`Participant ${participantId}:`, { webcamStream, micStream });
//     }, [webcamStream, micStream, participantId]);

//     return (
//         <div className="card h-100 bg-dark text-white border-0 shadow-sm">
//             {webcamStream ? (
//                 <video
//                     autoPlay
//                     muted={participantId === localParticipant.id}
//                     ref={(ref) => {
//                         if (ref && webcamStream) {
//                             const stream = new MediaStream([webcamStream.track]);
//                             ref.srcObject = stream;
//                             ref.play().catch((err) => console.error('Video play error:', err));
//                         }
//                     }}
//                     className="card-img-top rounded-top object-fit-cover"
//                     style={{ height: '200px' }}
//                 />
//             ) : (
//                 <div
//                     className="card-img-top bg-secondary d-flex justify-content-center align-items-center rounded-top text-white fs-5"
//                     style={{ height: '200px' }}
//                 >
//                     {displayName || 'No Video'}
//                 </div>
//             )}
//             {micStream && (
//                 <audio
//                     autoPlay
//                     ref={(ref) => {
//                         if (ref && micStream) {
//                             const stream = new MediaStream([micStream.track]);
//                             ref.srcObject = stream;
//                             ref.play().catch((err) => console.error('Audio play error:', err));
//                         }
//                     }}
//                 />
//             )}
//             <div className="card-body p-2">
//                 <h5 className="card-title mb-0">{displayName || 'Participant'}</h5>
//             </div>
//             {!micStream && (
//                 <span className="position-absolute top-0 end-0 m-2 badge bg-danger rounded-circle p-2">
//                     <Icon icon="mdi:microphone-off" width={16} />
//                 </span>
//             )}
//         </div>
//     );
// });

// MeetingView.displayName = 'MeetingView';
// ParticipantView.displayName = 'ParticipantView';

// export default VideoCall;

'use client';
import { FC, useCallback, useEffect, useState, memo } from 'react';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { Icon } from '@iconify/react';
import useSocket from '@/hooks/useSocket';

const VideoCall: FC<{ userName: string; onEnd: () => void }> = ({ userName, onEnd }) => {
    const [token, setToken] = useState<string | null>(null);
    const [meetingId, setMeetingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'accepted' | 'rejected' | 'ended'>('idle');
    const [isCaller, setIsCaller] = useState<boolean>(false);
    const [otherParticipant, setOtherParticipant] = useState<{ name: string; status: string } | null>(null);
    const { socket } = useSocket();
    const thread = useSelector((state: RootState) => state.thread);

    const initiateCall = useCallback(async () => {
        if (!thread?.id || token || meetingId || callStatus !== 'idle') return;

        try {
            // Fetch VideoSDK room
            const response = await axios.post('/api/videosdk', { threadId: thread.id });
            if (!response.data.token || !response.data.roomId) {
                throw new Error('Invalid VideoSDK response');
            }
            setToken(response.data.token);
            setMeetingId(response.data.roomId);
            setIsCaller(true);
            setCallStatus('ringing');

            // Fetch participants
            const participantsResponse = await axios.get(`/api/thread/${thread.id}/participants`);
            const participants = participantsResponse.data.participants || [];
            if (!Array.isArray(participants) || participants.length < 2) {
                throw new Error('Invalid participants data');
            }
            const other = participants.find((p: { name: string }) => p.name !== userName);
            if (!other) {
                throw new Error('No other participant found');
            }
            setOtherParticipant({ name: other.name, status: 'ringing' });

            if (socket) {
                socket.emit('initiate_call', {
                    threadId: thread.id,
                    roomId: response.data.roomId,
                    receiverName: other.name,
                    callerName: userName,
                });
            } else {
                throw new Error('Socket not connected');
            }
        } catch (error: any) {
            console.error('Error initiating call:', error.message);
            setError(error.message || 'Failed to start call');
        }
    }, [socket, thread, token, meetingId, callStatus, userName]);

    useEffect(() => {
        // Start call if user is caller
        if (callStatus === 'idle' && !isCaller) return;
        initiateCall();
    }, [initiateCall, callStatus, isCaller]);

    useEffect(() => {
        if (!socket) return;

        const handleCallRinging = (data: { threadId: number; roomId: string; callerName: string }) => {
            console.log('Received call_ringing:', data);
            if (data.threadId === thread?.id && !isCaller && callStatus === 'idle') {
                setMeetingId(data.roomId);
                setOtherParticipant({ name: data.callerName, status: 'ringing' });
                setCallStatus('ringing');
            }
        };

        const handleCallAccepted = (data: { threadId: number; participantName: string }) => {
            console.log('Received call_accepted:', data);
            if (data.threadId === thread?.id) {
                setCallStatus('accepted');
                setOtherParticipant((prev) => prev ? { ...prev, status: 'joined' } : null);
            }
        };

        const handleCallRejected = (data: { threadId: number }) => {
            console.log('Received call_rejected:', data);
            if (data.threadId === thread?.id) {
                setCallStatus('rejected');
                onEnd();
            }
        };

        const handleCallEnded = (data: { threadId: number }) => {
            console.log('Received call_ended:', data);
            if (data.threadId === thread?.id) {
                setCallStatus('ended');
                onEnd();
            }
        };

        socket.on('call_ringing', handleCallRinging);
        socket.on('call_accepted', handleCallAccepted);
        socket.on('call_rejected', handleCallRejected);
        socket.on('call_ended', handleCallEnded);

        return () => {
            socket.off('call_ringing', handleCallRinging);
            socket.off('call_accepted', handleCallAccepted);
            socket.off('call_rejected', handleCallRejected);
            socket.off('call_ended', handleCallEnded);
        };
    }, [socket, thread, isCaller, callStatus, onEnd]);

    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                        onClick={onEnd}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black">
            {(token || meetingId) && (
                <MeetingProvider
                    config={{
                        meetingId: meetingId || '',
                        micEnabled: callStatus === 'accepted',
                        webcamEnabled: callStatus === 'accepted',
                        name: userName,
                    }}
                    token={token || ''}
                    joinWithoutUserInteraction={callStatus === 'accepted'}
                >
                    <MeetingView
                        isCaller={isCaller}
                        callStatus={callStatus}
                        setCallStatus={setCallStatus}
                        userName={userName}
                        otherParticipant={otherParticipant}
                        socket={socket}
                        threadId={thread?.id}
                        onEnd={onEnd}
                        joinMeeting={() => {
                            if (!token) {
                                axios
                                    .post('/api/videosdk', { threadId: thread.id })
                                    .then((response) => {
                                        setToken(response.data.token);
                                        setCallStatus('accepted');
                                        socket?.emit('call_accepted', { threadId: thread?.id, participantName: userName });
                                    })
                                    .catch((err) => setError('Failed to join call'));
                            } else {
                                setCallStatus('accepted');
                                socket?.emit('call_accepted', { threadId: thread?.id, participantName: userName });
                            }
                        }}
                    />
                </MeetingProvider>
            )}
        </div>
    );
};

interface MeetingViewProps {
    isCaller: boolean;
    callStatus: 'idle' | 'ringing' | 'accepted' | 'rejected' | 'ended';
    setCallStatus: (status: 'idle' | 'ringing' | 'accepted' | 'rejected' | 'ended') => void;
    userName: string;
    otherParticipant: { name: string; status: string } | null;
    socket: any;
    threadId: number | undefined;
    onEnd: () => void;
    joinMeeting: () => void;
}

const MeetingView: FC<MeetingViewProps> = memo(
    ({ isCaller, callStatus, setCallStatus, userName, otherParticipant, socket, threadId, onEnd, joinMeeting }) => {
        const { participants, leave, join, toggleMic, toggleWebcam, micEnabled, webcamEnabled, localParticipant } = useMeeting();
        const [micOn, setMicOn] = useState<boolean>(micEnabled);
        const [webcamOn, setWebcamOn] = useState<boolean>(webcamEnabled);
        const [hasJoined, setHasJoined] = useState<boolean>(false);
        const [callDuration, setCallDuration] = useState<number>(0);

        // Join meeting when accepted
        useEffect(() => {
            if (callStatus === 'accepted' && !hasJoined) {
                join();
                setHasJoined(true);
            }
        }, [callStatus, hasJoined, join]);

        // Call duration timer
        useEffect(() => {
            let timer: NodeJS.Timeout;
            if (callStatus === 'accepted') {
                timer = setInterval(() => {
                    setCallDuration((prev) => prev + 1);
                }, 1000);
            }
            return () => clearInterval(timer);
        }, [callStatus]);

        const participantIds = Array.from(participants.keys()) as string[];
        const otherParticipantId = participantIds.find((id) => id !== localParticipant?.id);

        const handleToggleMic = useCallback(() => {
            toggleMic();
            setMicOn((prev) => !prev);
        }, [toggleMic]);

        const handleToggleWebcam = useCallback(() => {
            toggleWebcam();
            setWebcamOn((prev) => !prev);
        }, [toggleWebcam]);

        const handleEndCall = useCallback(() => {
            leave();
            setCallStatus('ended');
            if (socket?.connected) {
                socket.emit('call_ended', { threadId });
            } else {
                console.warn('Socket not connected, cannot emit call_ended');
            }
            onEnd();
        }, [leave, setCallStatus, socket, threadId, onEnd]);

        const handleAcceptCall = useCallback(() => {
            joinMeeting();
        }, [joinMeeting]);

        const handleRejectCall = useCallback(() => {
            setCallStatus('rejected');
            if (socket?.connected) {
                socket.emit('call_rejected', { threadId });
            } else {
                console.warn('Socket not connected, cannot emit call_rejected');
            }
            onEnd();
        }, [setCallStatus, socket, threadId, onEnd]);

        // Format call duration (MM:SS)
        const formatDuration = (seconds: number): string => {
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        };

        // Incoming call UI (WhatsApp-like)
        if (callStatus === 'ringing' && !isCaller) {
            return (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
                    <div className="text-center animate-pulse">
                        <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                            {otherParticipant?.name?.charAt(0) || '?'}
                        </div>
                        <h1 className="text-3xl font-semibold mb-2">Incoming Call</h1>
                        <p className="text-xl">{otherParticipant?.name || 'Unknown'}</p>
                        <p className="text-md mt-2">Calling...</p>
                    </div>
                    <div className="flex gap-6 mt-10">
                        <button
                            onClick={handleAcceptCall}
                            className="bg-green-500 p-5 rounded-full hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
                            title="Accept Call"
                        >
                            <Icon icon="material-symbols:check" width={28} />
                        </button>
                        <button
                            onClick={handleRejectCall}
                            className="bg-red-500 p-5 rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
                            title="Reject Call"
                        >
                            <Icon icon="material-symbols:close" width={28} />
                        </button>
                    </div>
                </div>
            );
        }

        // Rejected or ended call
        if (callStatus === 'rejected' || callStatus === 'ended') {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold mb-4">
                            {callStatus === 'rejected' ? 'Call Rejected' : 'Call Ended'}
                        </h1>
                        <button
                            onClick={onEnd}
                            className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 flex flex-col bg-black text-white">
                {/* Status Bar */}
                <div className="p-3 bg-gray-900 flex justify-between items-center">
                    <span className="text-md font-medium">
                        {callStatus === 'ringing' ? 'Calling...' : `In Call ${formatDuration(callDuration)}`}
                    </span>
                    <span className="text-sm">{otherParticipant?.name || 'Participant'}</span>
                </div>

                {/* Video Area */}
                <div className="flex-grow relative">
                    {/* Other Participant (Full-screen) */}
                    <div className="absolute inset-0">
                        {callStatus === 'accepted' && otherParticipantId ? (
                            <ParticipantView participantId={otherParticipantId} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <div className="text-center animate-pulse">
                                    <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                                        {otherParticipant?.name?.charAt(0) || '?'}
                                    </div>
                                    <p className="text-xl">{otherParticipant?.name || 'Participant'}</p>
                                    <p className="text-md mt-2">
                                        {callStatus === 'ringing' ? 'Ringing...' : 'Waiting...'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Self Video (Overlay, bottom-right) */}
                    {localParticipant?.id && (
                        <div
                            className={`absolute bottom-4 right-4 w-24 h-18 md:w-32 md:h-24 rounded-lg overflow-hidden transition-all duration-300 ${callStatus === 'ringing' && isCaller ? 'shadow-lg' : ''
                                }`}
                        >
                            <ParticipantView participantId={localParticipant.id} isSelf />
                        </div>
                    )}
                </div>

                {/* Controls */}
                {(callStatus === 'accepted' || (callStatus === 'ringing' && isCaller)) && (
                    <div className="p-4 bg-gray-900 flex justify-center gap-4">
                        <button
                            onClick={handleToggleMic}
                            className={`p-4 rounded-full ${micOn ? 'bg-gray-600' : 'bg-red-500'} hover:bg-opacity-80 transform hover:scale-105 transition-all duration-200`}
                            title={micOn ? 'Mute' : 'Unmute'}
                        >
                            <Icon icon={micOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={24} />
                        </button>
                        <button
                            onClick={handleToggleWebcam}
                            className={`p-4 rounded-full ${webcamOn ? 'bg-gray-600' : 'bg-red-500'} hover:bg-opacity-80 transform hover:scale-105 transition-all duration-200`}
                            title={webcamOn ? 'Turn Off Video' : 'Turn On Video'}
                        >
                            <Icon icon={webcamOn ? 'mdi:video' : 'mdi:video-off'} width={24} />
                        </button>
                        <button
                            onClick={handleEndCall}
                            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
                            title="End Call"
                        >
                            <Icon icon="material-symbols-light:call-end" width={24} />
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

interface ParticipantViewProps {
    participantId: string;
    isSelf?: boolean;
}

const ParticipantView: FC<ParticipantViewProps> = memo(({ participantId, isSelf = false }) => {
    const { webcamStream, micStream, displayName } = useParticipant(participantId);
    const { localParticipant } = useMeeting();

    if (!participantId) {
        return (
            <div className="relative w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-white text-lg">
                No Participant
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
            {webcamStream ? (
                <video
                    autoPlay
                    muted={isSelf || participantId === localParticipant?.id}
                    ref={(ref) => {
                        if (ref && webcamStream) {
                            ref.srcObject = new MediaStream([webcamStream.track]);
                            ref.play().catch((err) => console.error('Video play error:', err));
                        }
                    }}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-lg bg-gray-800">
                    <span>{displayName || 'No Video'}</span>
                </div>
            )}
            {micStream && !isSelf && participantId !== localParticipant?.id && (
                <audio
                    autoPlay
                    ref={(ref) => {
                        if (ref && micStream) {
                            ref.srcObject = new MediaStream([micStream.track]);
                            ref.play().catch((err) => console.error('Audio play error:', err));
                        }
                    }}
                />
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-2 py-1 rounded text-sm">
                {displayName || 'Participant'}
            </div>
            {!micStream && (
                <div className="absolute top-2 right-2 bg-red-500 p-1 rounded-full">
                    <Icon icon="mdi:microphone-off" width={16} />
                </div>
            )}
        </div>
    );
});

MeetingView.displayName = 'MeetingView';
ParticipantView.displayName = 'ParticipantView';

export default VideoCall;