// 'use client';
// import { FC, useCallback, useEffect, useState, memo } from 'react';
// import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/Store';
// import { Icon } from '@iconify/react';
// import useSocket from '@/hooks/useSocket';
// import { Socket } from 'socket.io-client';

// const VideoCall: FC<{ isCaller: boolean; setIsCaller: any; userName: string; onEnd: () => void }> = ({ isCaller, setIsCaller, userName, onEnd }) => {
//     const [token, setToken] = useState<string | null>(null);
//     const [meetingId, setMeetingId] = useState<string | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'accepted' | 'rejected' | 'ended'>('idle');
//     // const [isCaller, setIsCaller] = useState<boolean>(false);
//     const [otherParticipant, setOtherParticipant] = useState<{ name: string; status: string } | null>(null);
//     const { socket } = useSocket();
//     const thread = useSelector((state: RootState) => state.thread);

//     const initiateCall = useCallback(async () => {
//         if (!thread?.id || token || meetingId || callStatus !== 'idle' || !socket) return;

//         try {
//             // Fetch VideoSDK room
//             const response = await axios.post('/api/videosdk', { threadId: thread.id });
//             if (!response.data.token || !response.data.roomId) {
//                 throw new Error('Invalid VideoSDK response');
//             }
//             setToken(response.data.token);
//             setMeetingId(response.data.roomId);
//             setIsCaller(true);
//             setCallStatus('ringing');

//             // Fetch participants
//             let participants: any[] = [];
//             try {
//                 // const participantsResponse = await axios.get(`/api/thread/${thread.id}/participants`, { params: thread });
//                 // const participantsData = participantsResponse.data.participants;
//                 const user1 = thread?.expertProfile?.user?.firstName + ' ' + thread?.expertProfile?.user?.lastName
//                 const user2 = thread?.task?.requesterProfile?.user?.firstName + ' ' + thread?.task?.requesterProfile?.user?.lastName
//                 const participantsData = [
//                     { name: `${user1}` },
//                     { name: `${user2}` },
//                 ]
//                 if (!Array.isArray(participantsData) || participantsData.length < 2) {
//                     throw new Error('Invalid participants data');
//                 } else {
//                     participants = participantsData || [];
//                 }
//             } catch (participantsError: any) {
//                 console.error('Error fetching participants:', participantsError.response?.data || participantsError.message);
//             }
//             // const participantsResponse = await axios.get(`/api/thread/${thread.id}/participants`, { params: thread });
//             // const participants = participantsResponse.data.participants || [];
//             // if (!Array.isArray(participants) || participants.length < 2) {
//             //     throw new Error('Invalid participants data');
//             // }
//             const other = participants.find((p: { name: string }) => p.name !== userName);
//             if (!other) {
//                 throw new Error('No other participant found');
//             }
//             setOtherParticipant({ name: other.name, status: 'ringing' });

//             if (socket?.connected) {
//                 socket?.emit('initiate_call', {
//                     threadId: thread.id,
//                     roomId: response.data.roomId,
//                     receiverName: other.name,
//                     callerName: userName,
//                 });
//             } else {
//                 throw new Error('Socket not connected');
//             }
//         } catch (error: any) {
//             console.error('Error initiating call:', error.message);
//             setError(error.message || 'Failed to start call');
//         }
//     }, [socket, thread, token, meetingId, callStatus, userName]);

//     useEffect(() => {
//         // Only initiate if explicitly set as caller
//         if (callStatus === 'idle' && isCaller) {
//             initiateCall();
//         }
//     }, [initiateCall, isCaller, callStatus]);
// console.log(isCaller, callStatus)
//     useEffect(() => {
//         if (!socket) return;

//         // const handleCallRinging = (data: { threadId: number; roomId: string; callerName: string }) => {
//         //     console.log('Received call_ringing:', data);
//         //     if (data.threadId === thread?.id && !isCaller && callStatus === 'idle') {
//         //         setMeetingId(data.roomId);
//         //         setOtherParticipant({ name: data.callerName, status: 'ringing' });
//         //         setCallStatus('ringing');
//         //     }
//         // };
//         const handleCallRinging = async (data: { threadId: number; roomId: string; callerName: string }) => {
//             console.log('VideoCall received call_ringing:', data);
//             if (data.threadId === thread.id && !isCaller) {
//               try {
//                 // Fetch token for receiver
//                 const response = await axios.post('/api/videosdk', { threadId: thread.id });
//                 if (!response.data.token || !response.data.roomId) {
//                   throw new Error('Invalid VideoSDK response for receiver');
//                 }

//                 setToken(response.data.token);
//                 setMeetingId(data.roomId);
//                 setOtherParticipant({ name: data.callerName, status: 'ringing' });
//                 setCallStatus('ringing');
//               } catch (error: any) {
//                 console.error('Error handling call_ringing:', error.message);
//                 setError(error.message || 'Failed to prepare incoming call');
//                 setIsCaller(false);
//                 onEnd();
//               }
//             }
//           }

//         const handleCallAccepted = (data: { threadId: number; participantName: string }) => {
//             console.log('Received call_accepted:', data);
//             if (data.threadId === thread?.id) {
//                 setCallStatus('accepted');
//                 setOtherParticipant((prev) => (prev ? { ...prev, status: 'joined' } : null));
//             }
//         };

//         const handleCallRejected = (data: { threadId: number }) => {
//             console.log('Received call_rejected:', data);
//             if (data.threadId === thread?.id) {
//                 setCallStatus('rejected');
//                 onEnd();
//             }
//         };

//         const handleCallEnded = (data: { threadId: number }) => {
//             console.log('Received call_ended:', data);
//             if (data.threadId === thread?.id) {
//                 setCallStatus('ended');
//                 onEnd();
//             }
//         };

//         socket.on('call_ringing', handleCallRinging);
//         socket.on('call_accepted', handleCallAccepted);
//         socket.on('call_rejected', handleCallRejected);
//         socket.on('call_ended', handleCallEnded);

//         return () => {
//             socket.off('call_ringing', handleCallRinging);
//             socket.off('call_accepted', handleCallAccepted);
//             socket.off('call_rejected', handleCallRejected);
//             socket.off('call_ended', handleCallEnded);
//         };
//     }, [socket, thread, isCaller, callStatus, onEnd]);

//     return (
//         <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark">
//             {error && (
//                 <div className="modal show d-block" tabIndex={-1}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Error</h5>
//                                 <button type="button" className="btn-close" onClick={onEnd} aria-label="Close"></button>
//                             </div>
//                             <div className="modal-body">
//                                 <p className="text-danger">{error}</p>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-danger" onClick={onEnd}>
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {(!token || !meetingId) &&
//                 <div className="d-flex justify-content-center align-items-center vh-100 bg-dark bg-opacity-75 position-absolute top-0 start-0 w-100">
//                     <div className="text-white fs-4">Loading video call...</div>
//                 </div>
//             }
//             {(token || meetingId) && (
//                 <MeetingProvider
//                     config={{
//                         meetingId: meetingId || '',
//                         micEnabled: callStatus === 'accepted',
//                         webcamEnabled: callStatus === 'accepted',
//                         name: userName,
//                     }}
//                     token={token || ''}
//                     joinWithoutUserInteraction={callStatus === 'accepted'}
//                 >
//                     <MeetingView
//                         isCaller={isCaller}
//                         callStatus={callStatus}
//                         setCallStatus={setCallStatus}
//                         userName={userName}
//                         otherParticipant={otherParticipant}
//                         socket={socket}
//                         threadId={thread?.id}
//                         onEnd={onEnd}
//                         joinMeeting={() => {
//                             if (!thread?.id) {
//                                 setError('Thread ID is missing');
//                                 return;
//                             }
//                             if (!token) {
//                                 axios
//                                     .post('/api/videosdk', { threadId: thread.id })
//                                     .then((response) => {
//                                         setToken(response.data.token);
//                                         setCallStatus('accepted');
//                                         if (socket?.connected) {
//                                             socket.emit('call_accepted', { threadId: thread.id, participantName: userName });
//                                         }
//                                     })
//                                     .catch((err) => setError('Failed to join call'));
//                             } else {
//                                 setCallStatus('accepted');
//                                 if (socket?.connected) {
//                                     socket.emit('call_accepted', { threadId: thread.id, participantName: userName });
//                                 }
//                             }
//                         }}
//                     />
//                 </MeetingProvider>
//             )}
//         </div>
//     );
// };

// interface MeetingViewProps {
//     isCaller: boolean;
//     callStatus: 'idle' | 'ringing' | 'accepted' | 'rejected' | 'ended';
//     setCallStatus: (status: 'idle' | 'ringing' | 'accepted' | 'rejected' | 'ended') => void;
//     userName: string;
//     otherParticipant: { name: string; status: string } | null;
//     socket: Socket | null;
//     threadId: number | undefined;
//     onEnd: () => void;
//     joinMeeting: () => void;
// }

// const MeetingView: FC<MeetingViewProps> = memo(
//     ({ isCaller, callStatus, setCallStatus, userName, otherParticipant, socket, threadId, onEnd, joinMeeting }) => {
//         const { participants, leave, join, toggleMic, toggleWebcam, micEnabled, webcamEnabled, localParticipant } = useMeeting();
//         const [micOn, setMicOn] = useState<boolean>(micEnabled);
//         const [webcamOn, setWebcamOn] = useState<boolean>(webcamEnabled);
//         const [hasJoined, setHasJoined] = useState<boolean>(false);
//         const [callDuration, setCallDuration] = useState<number>(0);

//         useEffect(() => {
//             if (callStatus === 'accepted' && !hasJoined) {
//                 join();
//                 setHasJoined(true);
//             }
//         }, [callStatus, hasJoined, join]);

//         useEffect(() => {
//             let timer: NodeJS.Timeout;
//             if (callStatus === 'accepted') {
//                 timer = setInterval(() => {
//                     setCallDuration((prev) => prev + 1);
//                 }, 1000);
//             }
//             return () => clearInterval(timer);
//         }, [callStatus]);

//         const participantIds: string[] = Array.from(participants.keys());
//         const otherParticipantId = participantIds.find((id) => id !== localParticipant?.id);

//         const handleToggleMic = useCallback(() => {
//             toggleMic();
//             setMicOn((prev) => !prev);
//         }, [toggleMic]);

//         const handleToggleWebcam = useCallback(() => {
//             toggleWebcam();
//             setWebcamOn((prev) => !prev);
//         }, [toggleWebcam]);

//         const handleEndCall = useCallback(() => {
//             leave();
//             setCallStatus('ended');
//             if (socket?.connected) {
//                 socket.emit('call_ended', { threadId });
//             } else {
//                 console.warn('Socket not connected, cannot emit call_ended');
//             }
//             onEnd();
//         }, [leave, setCallStatus, socket, threadId, onEnd]);

//         const handleAcceptCall = useCallback(() => {
//             joinMeeting();
//         }, [joinMeeting]);

//         const handleRejectCall = useCallback(() => {
//             setCallStatus('rejected');
//             if (socket?.connected) {
//                 socket.emit('call_rejected', { threadId });
//             } else {
//                 console.warn('Socket not connected, cannot emit call_rejected');
//             }
//             onEnd();
//         }, [setCallStatus, socket, threadId, onEnd]);

//         const formatDuration = (seconds: number): string => {
//             const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//             const secs = (seconds % 60).toString().padStart(2, '0');
//             return `${mins}:${secs}`;
//         };

//         if (callStatus === 'ringing' && !isCaller) {
//             return (
//                 <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
//                     <div className="text-center">
//                         <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px', fontSize: '48px' }}>
//                             {otherParticipant?.name?.charAt(0) || '?'}
//                         </div>
//                         <h1 className="h3 mb-2">Incoming Call</h1>
//                         <p className="h5">{otherParticipant?.name || 'Unknown'}</p>
//                         <p className="mt-2">Calling...</p>
//                     </div>
//                     <div className="d-flex gap-3 mt-4">
//                         <button className="btn btn-success btn-lg" onClick={handleAcceptCall} title="Accept Call">
//                             <Icon icon="material-symbols:check" width={24} />
//                         </button>
//                         <button className="btn btn-danger btn-lg" onClick={handleRejectCall} title="Reject Call">
//                             <Icon icon="material-symbols:close" width={24} />
//                         </button>
//                     </div>
//                 </div>
//             );
//         }

//         if (callStatus === 'rejected' || callStatus === 'ended') {
//             return (
//                 <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-white">
//                     <div className="text-center">
//                         <h1 className="h3 mb-4">{callStatus === 'rejected' ? 'Call Rejected' : 'Call Ended'}</h1>
//                         <button className="btn btn-danger" onClick={onEnd}>
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column bg-dark text-white">
//                 {/* Status Bar */}
//                 <div className="p-3 bg-secondary d-flex justify-content-between align-items-center">
//                     <span className="fw-medium">
//                         {callStatus === 'ringing' ? 'Calling...' : `In Call ${formatDuration(callDuration)}`}
//                     </span>
//                     <span>{otherParticipant?.name || 'Participant'}</span>
//                 </div>

//                 {/* Video Area */}
//                 <div className="flex-grow-1 position-relative">
//                     {/* Other Participant (Full-screen) */}
//                     <div className="position-absolute top-0 start-0 w-100 h-100">
//                         {callStatus === 'accepted' && otherParticipantId ? (
//                             <ParticipantView participantId={otherParticipantId} />
//                         ) : (
//                             <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary">
//                                 <div className="text-center">
//                                     <div className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
//                                         {otherParticipant?.name?.charAt(0) || '?'}
//                                     </div>
//                                     <p className="h5">{otherParticipant?.name || 'Participant'}</p>
//                                     <p className="mt-2">{callStatus === 'ringing' ? 'Ringing...' : 'Waiting...'}</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Self Video (Overlay, bottom-right) */}
//                     {localParticipant?.id && (
//                         <div
//                             className={`position-absolute bottom-0 end-0 rounded shadow ${callStatus === 'ringing' && isCaller ? 'shadow-lg' : ''}`}
//                             style={{ width: '120px', height: '90px' }}
//                         >
//                             <ParticipantView participantId={localParticipant.id} isSelf />
//                         </div>
//                     )}
//                 </div>

//                 {/* Controls */}
//                 {(callStatus === 'accepted' || (callStatus === 'ringing' && isCaller)) && (
//                     <div className="p-3 bg-secondary d-flex justify-content-center gap-3">
//                         <button
//                             className={`btn ${micOn ? 'btn-secondary' : 'btn-danger'}`}
//                             onClick={handleToggleMic}
//                             title={micOn ? 'Mute' : 'Unmute'}
//                         >
//                             <Icon icon={micOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={24} />
//                         </button>
//                         <button
//                             className={`btn ${webcamOn ? 'btn-secondary' : 'btn-danger'}`}
//                             onClick={handleToggleWebcam}
//                             title={webcamOn ? 'Turn Off Video' : 'Turn On Video'}
//                         >
//                             <Icon icon={webcamOn ? 'mdi:video' : 'mdi:video-off'} width={24} />
//                         </button>
//                         <button className="btn btn-danger" onClick={handleEndCall} title="End Call">
//                             <Icon icon="material-symbols-light:call-end" width={24} />
//                         </button>
//                     </div>
//                 )}
//             </div>
//         );
//     }
// );

// interface ParticipantViewProps {
//     participantId: string;
//     isSelf?: boolean;
// }

// const ParticipantView: FC<ParticipantViewProps> = memo(({ participantId, isSelf = false }) => {
//     const { webcamStream, micStream, displayName } = useParticipant(participantId);
//     const { localParticipant } = useMeeting();

//     if (!participantId) {
//         return (
//             <div className="position-relative w-100 h-100 bg-secondary rounded d-flex align-items-center justify-content-center text-white">
//                 No Participant
//             </div>
//         );
//     }

//     return (
//         <div className="position-relative w-100 h-100 bg-secondary rounded overflow-hidden">
//             {webcamStream ? (
//                 <video
//                     autoPlay
//                     muted={isSelf || participantId === localParticipant?.id}
//                     ref={(ref) => {
//                         if (ref && webcamStream) {
//                             ref.srcObject = new MediaStream([webcamStream.track]);
//                             ref.play().catch((err) => console.error('Video play error:', err));
//                         }
//                     }}
//                     className="w-100 h-100 object-fit-cover"
//                 />
//             ) : (
//                 <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white">
//                     <span>{displayName || 'No Video'}</span>
//                 </div>
//             )}
//             {micStream && !isSelf && participantId !== localParticipant?.id && (
//                 <audio
//                     autoPlay
//                     ref={(ref) => {
//                         if (ref && micStream) {
//                             ref.srcObject = new MediaStream([micStream.track]);
//                             ref.play().catch((err) => console.error('Audio play error:', err));
//                         }
//                     }}
//                 />
//             )}
//             <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-50 px-2 py-1 rounded">
//                 {displayName || 'Participant'}
//             </div>
//             {!micStream && (
//                 <div className="position-absolute top-0 end-0 bg-danger p-1 rounded-circle">
//                     <Icon icon="mdi:microphone-off" width={16} />
//                 </div>
//             )}
//         </div>
//     );
// });

// MeetingView.displayName = 'MeetingView';
// ParticipantView.displayName = 'ParticipantView'

// export default VideoCall;

'use client';
import { FC, useCallback, useEffect, useState, memo } from 'react';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { Icon } from '@iconify/react';
import useSocket from '@/hooks/useSocket';
import { Socket } from 'socket.io-client';

const VideoCall: FC<{
    isCaller: boolean;
    setIsCaller: (isCaller: boolean) => void;
    userName: string;
    onEnd: () => void;
}> = ({ isCaller, setIsCaller, userName, onEnd }) => {
    const [token, setToken] = useState<string | null>(null);
    const [meetingId, setMeetingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [callStatus, setCallStatus] = useState<'ringing' | 'accepted' | 'rejected' | 'ended'>(isCaller ? 'ringing' : 'ringing');
    const [otherParticipant, setOtherParticipant] = useState<{ name: string; status: string } | null>(null);
    const { socket } = useSocket();
    const thread = useSelector((state: RootState) => state.thread);

    const initiateCall = useCallback(async () => {
        if (!thread?.id || token || meetingId || !socket) {
            console.log('Cannot initiate call:', { threadId: thread?.id, token, meetingId, socketConnected: socket?.connected });
            // setError(
            //     !thread?.id ? 'Thread ID is missing' :
            //         !socket?.connected ? 'Socket not connected' :
            //             'Call already in progress'
            // );
            return;
        }

        console.log('Initiating call with thread:', thread);

        try {
            // Validate thread data
            if (!thread.expertProfile?.user || !thread.task?.requesterProfile?.user) {
                throw new Error('Missing participant data');
            }

            // Extract participants
            const user1 = `${thread.expertProfile.user.firstName || 'Expert'} ${thread.expertProfile.user.lastName || ''}`.trim() || 'Expert User';
            const user2 = `${thread.task.requesterProfile.user.firstName || 'Requester'} ${thread.task.requesterProfile.user.lastName || ''}`.trim() || 'Requester User';
            const participants = [
                { name: user1 },
                { name: user2 },
            ];

            console.log('Participants:', participants);

            if (participants.length < 2) {
                throw new Error('At least two participants are required');
            }

            const other = participants.find((p) => p.name !== userName);
            if (!other) {
                throw new Error('No other participant found');
            }

            // Fetch VideoSDK room
            const response = await axios.post('/api/videosdk', { threadId: thread.id });
            if (!response.data.token || !response.data.roomId) {
                throw new Error('Invalid VideoSDK response');
            }

            setToken(response.data.token);
            setMeetingId(response.data.roomId);
            setOtherParticipant({ name: other.name, status: 'ringing' });

            socket.emit('initiate_call', {
                threadId: thread.id,
                roomId: response.data.roomId,
                receiverName: other.name,
                callerName: userName,
            });
        } catch (error: any) {
            console.error('Error initiating call:', error.message);
            setError(error.message || 'Failed to start call');
            setIsCaller(false);
            onEnd();
        }
    }, [socket, thread, token, meetingId, userName, setIsCaller, onEnd]);

    useEffect(() => {
        if (isCaller) {
            initiateCall();
        }
    }, [isCaller, initiateCall]);

    useEffect(() => {
        if (!socket || !thread?.id) return;

        const handleCallRinging = async (data: { threadId: number; roomId: string; callerName: string }) => {
            console.log('VideoCall received call_ringing:', data);
            if (data.threadId === thread.id && !isCaller) {
                try {
                    // Fetch token for receiver
                    const response = await axios.post('/api/videosdk', { threadId: thread.id });
                    if (!response.data.token || !response.data.roomId) {
                        throw new Error('Invalid VideoSDK response for receiver');
                    }

                    setToken(response.data.token);
                    setMeetingId(data.roomId);
                    setOtherParticipant({ name: data.callerName, status: 'ringing' });
                    setCallStatus('ringing');
                } catch (error: any) {
                    console.error('Error handling call_ringing:', error.message);
                    setError(error.message || 'Failed to prepare incoming call');
                    setIsCaller(false);
                    onEnd();
                }
            }
        };

        const handleCallAccepted = (data: { threadId: number; participantName: string }) => {
            console.log('Received call_accepted:', data);
            if (data.threadId === thread?.id) {
                setCallStatus('accepted');
                setOtherParticipant((prev) => (prev ? { ...prev, status: 'joined' } : null));
            }
        };

        const handleCallRejected = (data: { threadId: number }) => {
            console.log('Received call_rejected:', data);
            if (data.threadId === thread?.id) {
                setCallStatus('rejected');
                setIsCaller(false);
                onEnd();
            }
        };

        const handleCallEnded = (data: { threadId: number }) => {
            console.log('Received call_ended:', data);
            if (data.threadId === thread?.id) {
                setCallStatus('ended');
                setIsCaller(false);
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
    }, [socket, thread, isCaller, onEnd, setIsCaller]);

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark">
            {error && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Error</h5>
                                <button type="button" className="btn-close" onClick={() => { setError(null); onEnd(); }} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-danger">{error}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => { setError(null); onEnd(); }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {(!token || !meetingId) && (
                <div className="d-flex justify-content-center align-items-center vh-100 bg-dark bg-opacity-75 position-absolute top-0 start-0 w-100">
                    <div className="text-white fs-4">Loading video call...</div>
                </div>
            )}
            {(token && meetingId) && (
                <MeetingProvider
                    config={{
                        meetingId,
                        micEnabled: callStatus === 'accepted',
                        webcamEnabled: callStatus === 'accepted',
                        name: userName,
                    }}
                    token={token}
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
                            if (!thread?.id) {
                                setError('Thread ID is missing');
                                return;
                            }
                            setCallStatus('accepted');
                            if (socket?.connected) {
                                socket.emit('call_accepted', { threadId: thread.id, participantName: userName });
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
    callStatus: 'ringing' | 'accepted' | 'rejected' | 'ended';
    setCallStatus: (status: 'ringing' | 'accepted' | 'rejected' | 'ended') => void;
    userName: string;
    otherParticipant: { name: string; status: string } | null;
    socket: Socket | null;
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

        useEffect(() => {
            if (callStatus === 'accepted' && !hasJoined) {
                join();
                setHasJoined(true);
            }
        }, [callStatus, hasJoined, join]);

        useEffect(() => {
            let timer: NodeJS.Timeout;
            if (callStatus === 'accepted') {
                timer = setInterval(() => {
                    setCallDuration((prev) => prev + 1);
                }, 1000);
            }
            return () => clearInterval(timer);
        }, [callStatus]);

        const participantIds: string[] = Array.from(participants.keys());
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

        const formatDuration = (seconds: number): string => {
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        };

        if (callStatus === 'ringing' && !isCaller) {
            return (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
                    <div className="text-center">
                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px', fontSize: '48px' }}>
                            {otherParticipant?.name?.charAt(0) || '?'}
                        </div>
                        <h1 className="h3 mb-2">Incoming Call</h1>
                        <p className="h5">{otherParticipant?.name || 'Unknown'}</p>
                        <p className="mt-2">Calling...</p>
                    </div>
                    <div className="d-flex gap-3 mt-4">
                        <button className="btn btn-success btn-lg" onClick={handleAcceptCall} title="Accept Call">
                            <Icon icon="material-symbols:check" width={24} />
                        </button>
                        <button className="btn btn-danger btn-lg" onClick={handleRejectCall} title="Reject Call">
                            <Icon icon="material-symbols:close" width={24} />
                        </button>
                    </div>
                </div>
            );
        }

        if (callStatus === 'rejected' || callStatus === 'ended') {
            return (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-white">
                    <div className="text-center">
                        <h1 className="h3 mb-4">{callStatus === 'rejected' ? 'Call Rejected' : 'Call Ended'}</h1>
                        <button className="btn btn-danger" onClick={onEnd}>
                            Close
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column bg-dark text-white">
                <div className="p-3 bg-secondary d-flex justify-content-between align-items-center">
                    <span className="fw-medium">
                        {callStatus === 'ringing' ? 'Calling...' : `In Call ${formatDuration(callDuration)}`}
                    </span>
                    <span>{otherParticipant?.name || 'Participant'}</span>
                </div>
                <div className="flex-grow-1 position-relative">
                    <div className="position-absolute top-0 start-0 w-100 h-100">
                        {callStatus === 'accepted' && otherParticipantId ? (
                            <ParticipantView participantId={otherParticipantId} />
                        ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary">
                                <div className="text-center">
                                    <div className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                                        {otherParticipant?.name?.charAt(0) || '?'}
                                    </div>
                                    <p className="h5">{otherParticipant?.name || 'Participant'}</p>
                                    <p className="mt-2">{callStatus === 'ringing' ? 'Ringing...' : 'Waiting...'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {localParticipant?.id && (
                        <div
                            className={`position-absolute bottom-0 end-0 rounded shadow ${callStatus === 'ringing' && isCaller ? 'shadow-lg' : ''}`}
                            style={{ width: '120px', height: '90px' }}
                        >
                            <ParticipantView participantId={localParticipant.id} isSelf />
                        </div>
                    )}
                </div>
                {(callStatus === 'accepted' || (callStatus === 'ringing' && isCaller)) && (
                    <div className="p-3 bg-secondary d-flex justify-content-center gap-3">
                        <button
                            className={`btn ${micOn ? 'btn-secondary' : 'btn-danger'}`}
                            onClick={handleToggleMic}
                            title={micOn ? 'Mute' : 'Unmute'}
                        >
                            <Icon icon={micOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={24} />
                        </button>
                        <button
                            className={`btn ${webcamOn ? 'btn-secondary' : 'btn-danger'}`}
                            onClick={handleToggleWebcam}
                            title={webcamOn ? 'Turn Off Video' : 'Turn On Video'}
                        >
                            <Icon icon={webcamOn ? 'mdi:video' : 'mdi:video-off'} width={24} />
                        </button>
                        <button className="btn btn-danger" onClick={handleEndCall} title="End Call">
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
            <div className="position-relative w-100 h-100 bg-secondary rounded d-flex align-items-center justify-content-center text-white">
                No Participant
            </div>
        );
    }

    return (
        <div className="position-relative w-100 h-100 bg-secondary rounded overflow-hidden">
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
                    className="w-100 h-100 object-fit-cover"
                />
            ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white">
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
            <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-50 px-2 py-1 rounded">
                {displayName || 'Participant'}
            </div>
            {!micStream && (
                <div className="position-absolute top-0 end-0 bg-danger p-1 rounded-circle">
                    <Icon icon="mdi:microphone-off" width={16} />
                </div>
            )}
        </div>
    );
});

MeetingView.displayName = 'MeetingView';
ParticipantView.displayName = 'ParticipantView';

export default VideoCall;