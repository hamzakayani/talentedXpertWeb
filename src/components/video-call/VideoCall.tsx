<<<<<<< HEAD
// 'use client';
// import { FC, useCallback, useEffect, useState, memo } from 'react';
// import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { Icon } from '@iconify/react';
// import { Socket } from 'socket.io-client';
// import useSocket from '@/hooks/useSocket';
// import { RootState } from '@/store/Store';

// interface NewVideoCallProps {
//   isCaller: boolean;
//   setIsCaller: (isCaller: boolean) => void;
//   userName: string;
//   onEnd: () => void;
// }

// const VideoCall: FC<NewVideoCallProps> = ({ isCaller, setIsCaller, userName, onEnd }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [meetingId, setMeetingId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [callStatus, setCallStatus] = useState<'ringing' | 'accepted' | 'rejected' | 'ended'>(
//     isCaller ? 'ringing' : 'ringing'
//   );
//   const [otherParticipant, setOtherParticipant] = useState<{ name: string; status: string } | null>(null);
//   const [isInitiating, setIsInitiating] = useState(false);
//   const { socket } = useSocket();
//   const thread = useSelector((state: RootState) => state.thread);

//   const initiateCall = useCallback(async () => {
//     if (!thread?.id || token || meetingId || !socket?.connected || isInitiating) {
//       console.log('Cannot initiate call:', {
//         threadId: thread?.id,
//         token,
//         meetingId,
//         socketConnected: socket?.connected,
//         isInitiating,
//       });
//       return;
//     }

//     console.log('Starting initiateCall');
//     setIsInitiating(true);

//     try {
//       // Validate thread data
//       if (!thread.expertProfile?.user || !thread.task?.requesterProfile?.user) {
//         throw new Error('Missing participant data');
//       }

//       // Extract participants
//       const user1 =
//         `${thread.expertProfile.user.firstName || 'Expert'} ${thread.expertProfile.user.lastName || ''}`.trim() ||
//         'Expert User';
//       const user2 =
//         `${thread.task.requesterProfile.user.firstName || 'Requester'} ${
//           thread.task.requesterProfile.user.lastName || ''
//         }`.trim() || 'Requester User';
//       const participants = [{ name: user1 }, { name: user2 }];

//       console.log('Participants:', participants);

//       if (participants.length < 2) {
//         throw new Error('At least two participants are required');
//       }

//       const other = participants.find((p) => p.name !== userName);
//       if (!other) {
//         throw new Error('No other participant found');
//       }

//       // Fetch VideoSDK room
//       const response = await axios.post('/api/videosdk', { threadId: thread.id });
//       if (!response.data.token || !response.data.roomId) {
//         throw new Error('Invalid VideoSDK response');
//       }

//       setToken(response.data.token);
//       setMeetingId(response.data.roomId);
//       setOtherParticipant({ name: other.name, status: 'ringing' });

//       socket.emit('initiate_call', {
//         threadId: thread.id,
//         roomId: response.data.roomId,
//         receiverName: other.name,
//         callerName: userName,
//       });

//       console.log('initiateCall completed');
//     } catch (error: any) {
//       console.error('Error initiating call:', error.message);
//       setError(error.message || 'Failed to start call');
//       setIsCaller(false);
//       onEnd();
//     } finally {
//       setIsInitiating(false);
//     }
//   }, [socket, thread, token, meetingId, userName, isInitiating, setIsCaller, onEnd]);

//   useEffect(() => {
//     if (isCaller && !isInitiating && socket?.connected) {
//       console.log('Triggering initiateCall for caller');
//       initiateCall();
//     }
//   }, [isCaller, initiateCall, isInitiating, socket]);

//   useEffect(() => {
//     if (!socket || !thread?.id) {
//       console.log('Socket or thread missing in VideoCall:', { socket: !!socket, threadId: thread?.id });
//       return;
//     }

//     const handleCallRinging = async (data: { threadId: number; roomId: string; callerName: string }) => {
//       console.log('VideoCall received call_ringing:', data);
//       if (data.threadId === thread.id && !isCaller) {
//         try {
//           // Fetch token for receiver
//           const response = await axios.post('/api/videosdk', { threadId: thread.id });
//           if (!response.data.token || !response.data.roomId) {
//             throw new Error('Invalid VideoSDK response for receiver');
//           }

//           setToken(response.data.token);
//           setMeetingId(data.roomId);
//           setOtherParticipant({ name: data.callerName, status: 'ringing' });
//           setCallStatus('ringing');
//         } catch (error: any) {
//           console.error('Error handling call_ringing:', error.message);
//           setError(error.message || 'Failed to prepare incoming call');
//           setIsCaller(false);
//           onEnd();
//         }
//       }
//     };

//     const handleCallAccepted = (data: { threadId: number; participantName: string }) => {
//       console.log('Received call_accepted:', data);
//       if (data.threadId === thread?.id) {
//         setCallStatus('accepted');
//         setOtherParticipant((prev) => (prev ? { ...prev, status: 'joined' } : null));
//       }
//     };

//     const handleCallRejected = (data: { threadId: number }) => {
//       console.log('Received call_rejected:', data);
//       if (data.threadId === thread?.id) {
//         setCallStatus('rejected');
//         setIsCaller(false);
//         onEnd();
//       }
//     };

//     const handleCallEnded = (data: { threadId: number }) => {
//       console.log('Received call_ended:', data);
//       if (data.threadId === thread?.id) {
//         setCallStatus('ended');
//         setIsCaller(false);
//         onEnd();
//       }
//     };

//     socket.on('call_ringing', handleCallRinging);
//     socket.on('call_accepted', handleCallAccepted);
//     socket.on('call_rejected', handleCallRejected);
//     socket.on('call_ended', handleCallEnded);

//     return () => {
//       socket.off('call_ringing', handleCallRinging);
//       socket.off('call_accepted', handleCallAccepted);
//       socket.off('call_rejected', handleCallRejected);
//       socket.off('call_ended', handleCallEnded);
//     };
//   }, [socket, thread, isCaller, onEnd, setIsCaller]);

//   return (
//     <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark">
//       {error && (
//         <div className="modal show d-block" tabIndex={-1}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Error</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => {
//                     setError(null);
//                     onEnd();
//                   }}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p className="text-danger">{error}</p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-danger"
//                   onClick={() => {
//                     setError(null);
//                     onEnd();
//                   }}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {(!token || !meetingId) && (
//         <div className="d-flex justify-content-center align-items-center vh-100 bg-dark bg-opacity-75 position-absolute top-0 start-0 w-100">
//           <div className="text-white fs-4">Loading video call...</div>
//         </div>
//       )}
//       {token && meetingId && (
//         <MeetingProvider
//           config={{
//             meetingId,
//             micEnabled: callStatus === 'accepted',
//             webcamEnabled: callStatus === 'accepted',
//             name: userName,
//           }}
//           token={token}
//           joinWithoutUserInteraction={callStatus === 'accepted'}
//         >
//           <MeetingView
//             isCaller={isCaller}
//             callStatus={callStatus}
//             setCallStatus={setCallStatus}
//             userName={userName}
//             otherParticipant={otherParticipant}
//             socket={socket}
//             threadId={thread?.id}
//             onEnd={onEnd}
//             joinMeeting={() => {
//               if (!thread?.id) {
//                 setError('Thread ID is missing');
//                 return;
//               }
//               setCallStatus('accepted');
//               if (socket?.connected) {
//                 socket.emit('call_accepted', { threadId: thread.id, participantName: userName });
//               }
//             }}
//           />
//         </MeetingProvider>
//       )}
//     </div>
//   );
// };

// interface MeetingViewProps {
//   isCaller: boolean;
//   callStatus: 'ringing' | 'accepted' | 'rejected' | 'ended';
//   setCallStatus: (status: 'ringing' | 'accepted' | 'rejected' | 'ended') => void;
//   userName: string;
//   otherParticipant: { name: string; status: string } | null;
//   socket: Socket | null;
//   threadId: number | undefined;
//   onEnd: () => void;
//   joinMeeting: () => void;
// }

// const MeetingView: FC<MeetingViewProps> = memo(
//   ({ isCaller, callStatus, setCallStatus, userName, otherParticipant, socket, threadId, onEnd, joinMeeting }) => {
//     const { participants, leave, join, toggleMic, toggleWebcam, micEnabled, webcamEnabled, localParticipant } =
//       useMeeting();
//     const [micOn, setMicOn] = useState<boolean>(micEnabled);
//     const [webcamOn, setWebcamOn] = useState<boolean>(webcamEnabled);
//     const [hasJoined, setHasJoined] = useState<boolean>(false);
//     const [callDuration, setCallDuration] = useState<number>(0);

//     useEffect(() => {
//       if (callStatus === 'accepted' && !hasJoined) {
//         join();
//         setHasJoined(true);
//       }
//     }, [callStatus, hasJoined, join]);

//     useEffect(() => {
//       let timer: NodeJS.Timeout;
//       if (callStatus === 'accepted') {
//         timer = setInterval(() => {
//           setCallDuration((prev) => prev + 1);
//         }, 1000);
//       }
//       return () => clearInterval(timer);
//     }, [callStatus]);

//     const participantIds: string[] = Array.from(participants.keys());
//     const otherParticipantId = participantIds.find((id) => id !== localParticipant?.id);

//     const handleToggleMic = useCallback(() => {
//       toggleMic();
//       setMicOn((prev) => !prev);
//     }, [toggleMic]);

//     const handleToggleWebcam = useCallback(() => {
//       toggleWebcam();
//       setWebcamOn((prev) => !prev);
//     }, [toggleWebcam]);

//     const handleEndCall = useCallback(() => {
//       leave();
//       setCallStatus('ended');
//       if (socket?.connected && threadId) {
//         socket.emit('call_ended', { threadId });
//       } else {
//         console.warn('Socket not connected or threadId missing, cannot emit call_ended');
//       }
//       onEnd();
//     }, [leave, setCallStatus, socket, threadId, onEnd]);

//     const handleAcceptCall = useCallback(() => {
//       joinMeeting();
//     }, [joinMeeting]);

//     const handleRejectCall = useCallback(() => {
//       setCallStatus('rejected');
//       if (socket?.connected && threadId) {
//         socket.emit('call_rejected', { threadId });
//       } else {
//         console.warn('Socket not connected or threadId missing, cannot emit call_rejected');
//       }
//       onEnd();
//     }, [setCallStatus, socket, threadId, onEnd]);

//     const formatDuration = (seconds: number): string => {
//       const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//       const secs = (seconds % 60).toString().padStart(2, '0');
//       return `${mins}:${secs}`;
//     };

//     if (callStatus === 'ringing' && !isCaller) {
//       return (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
//           <div className="text-center">
//             <div
//               className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3"
//               style={{ width: '100px', height: '100px', fontSize: '48px' }}
//             >
//               {otherParticipant?.name?.charAt(0) || '?'}
//             </div>
//             <h1 className="h3 mb-2">Incoming Call</h1>
//             <p className="h5">{otherParticipant?.name || 'Unknown'}</p>
//             <p className="mt-2">Calling...</p>
//           </div>
//           <div className="d-flex gap-3 mt-4">
//             <button className="btn btn-success btn-lg" onClick={handleAcceptCall} title="Accept Call">
//               <Icon icon="material-symbols:check" width={24} />
//             </button>
//             <button className="btn btn-danger btn-lg" onClick={handleRejectCall} title="Reject Call">
//               <Icon icon="material-symbols:close" width={24} />
//             </button>
//           </div>
//         </div>
//       );
//     }

//     if (callStatus === 'rejected' || callStatus === 'ended') {
//       return (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-white">
//           <div className="text-center">
//             <h1 className="h3 mb-4">{callStatus === 'rejected' ? 'Call Rejected' : 'Call Ended'}</h1>
//             <button className="btn btn-danger" onClick={onEnd}>
//               Close
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column bg-dark text-white">
//         <div className="p-3 bg-secondary d-flex justify-content-between align-items-center">
//           <span className="fw-medium">
//             {callStatus === 'ringing' ? 'Calling...' : `In Call ${formatDuration(callDuration)}`}
//           </span>
//           <span>{otherParticipant?.name || 'Participant'}</span>
//         </div>
//         <div className="flex-grow-1 position-relative">
//           <div className="position-absolute top-0 start-0 w-100 h-100">
//             {callStatus === 'accepted' && otherParticipantId ? (
//               <ParticipantView participantId={otherParticipantId} />
//             ) : (
//               <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary">
//                 <div className="text-center">
//                   <div
//                     className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-3"
//                     style={{ width: '80px', height: '80px', fontSize: '32px' }}
//                   >
//                     {otherParticipant?.name?.charAt(0) || '?'}
//                   </div>
//                   <p className="h5">{otherParticipant?.name || 'Participant'}</p>
//                   <p className="mt-2">{callStatus === 'ringing' ? 'Ringing...' : 'Waiting...'}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//           {localParticipant?.id && (
//             <div
//               className={`position-absolute bottom-0 end-0 rounded shadow ${
//                 callStatus === 'ringing' && isCaller ? 'shadow-lg' : ''
//               }`}
//               style={{ width: '120px', height: '90px' }}
//             >
//               <ParticipantView participantId={localParticipant.id} isSelf />
//             </div>
//           )}
//         </div>
//         {(callStatus === 'accepted' || (callStatus === 'ringing' && isCaller)) && (
//           <div className="p-3 bg-secondary d-flex justify-content-center gap-3">
//             <button
//               className={`btn ${micOn ? 'btn-secondary' : 'btn-danger'}`}
//               onClick={handleToggleMic}
//               title={micOn ? 'Mute' : 'Unmute'}
//             >
//               <Icon icon={micOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={24} />
//             </button>
//             <button
//               className={`btn ${webcamOn ? 'btn-secondary' : 'btn-danger'}`}
//               onClick={handleToggleWebcam}
//               title={webcamOn ? 'Turn Off Video' : 'Turn On Video'}
//             >
//               <Icon icon={webcamOn ? 'mdi:video' : 'mdi:video-off'} width={24} />
//             </button>
//             <button className="btn btn-danger" onClick={handleEndCall} title="End Call">
//               <Icon icon="material-symbols-light:call-end" width={24} />
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// interface ParticipantViewProps {
//   participantId: string;
//   isSelf?: boolean;
// }

// const ParticipantView: FC<ParticipantViewProps> = memo(({ participantId, isSelf = false }) => {
//   const { webcamStream, micStream, displayName } = useParticipant(participantId);
//   const { localParticipant } = useMeeting();

//   if (!participantId) {
//     return (
//       <div className="position-relative w-100 h-100 bg-secondary rounded d-flex align-items-center justify-content-center text-white">
//         No Participant
//       </div>
//     );
//   }

//   return (
//     <div className="position-relative w-100 h-100 bg-secondary rounded overflow-hidden">
//       {webcamStream ? (
//         <video
//           autoPlay
//           muted={isSelf || participantId === localParticipant?.id}
//           ref={(ref) => {
//             if (ref && webcamStream) {
//               ref.srcObject = new MediaStream([webcamStream.track]);
//               ref.play().catch((err) => console.error('Video play error:', err));
//             }
//           }}
//           className="w-100 h-100 object-fit-cover"
//         />
//       ) : (
//         <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white">
//           <span>{displayName || 'No Video'}</span>
//         </div>
//       )}
//       {micStream && !isSelf && participantId !== localParticipant?.id && (
//         <audio
//           autoPlay
//           ref={(ref) => {
//             if (ref && micStream) {
//               ref.srcObject = new MediaStream([micStream.track]);
//               ref.play().catch((err) => console.error('Audio play error:', err));
//             }
//           }}
//         />
//       )}
//       <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-50 px-2 py-1 rounded">
//         {displayName || 'Participant'}
//       </div>
//       {!micStream && (
//         <div className="position-absolute top-0 end-0 bg-danger p-1 rounded-circle">
//           <Icon icon="mdi:microphone-off" width={16} />
//         </div>
//       )}
//     </div>
//   );
// });

// MeetingView.displayName = 'MeetingView';
// ParticipantView.displayName = 'ParticipantView';

// export default VideoCall;

=======
>>>>>>> 658ab244db674980553bba90cea7896065585098
'use client';
import { FC, useCallback, useEffect, useState, memo } from 'react';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
<<<<<<< HEAD
import { Socket } from 'socket.io-client';
import useSocket from '@/hooks/useSocket';
import { RootState } from '@/store/Store';

interface NewVideoCallProps {
    userName: string;
    isCaller: boolean;
    onEnd: () => void;
}

const VideoCall: FC<NewVideoCallProps> = ({ userName, isCaller, onEnd }) => {
    const [token, setToken] = useState<string | null>(null);
    const [meetingId, setMeetingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [callStatus, setCallStatus] = useState<'ringing' | 'accepted' | 'rejected' | 'ended'>('ringing');
    const [otherParticipant, setOtherParticipant] = useState<{ name: string; status: string } | null>(null);
    const [isInitiating, setIsInitiating] = useState(false);
=======
import useSocket from '@/hooks/useSocket';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';

const VideoCall: FC<any> = ({ callActive, setCallActive, onEnd, userName }) => {
    const [token, setToken] = useState<string | null>(null);
    const [meetingId, setMeetingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
>>>>>>> 658ab244db674980553bba90cea7896065585098
    const { socket } = useSocket();
    const thread = useSelector((state: RootState) => state.thread);
    const [invitedParticipants, setInvitedParticipants] = useState<{ name: string; status: string }[]>([]);

<<<<<<< HEAD
    // Ringtone using an online URL
    // https://freesound.org/data/previews/316/316847_4939433-lq.mp3
    const [ringtone] = useState<HTMLAudioElement | undefined>(
        typeof Audio !== 'undefined'
            ? new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3') // Replace with a ringtone URL
            : undefined
    );

    // Play ringtone for receiver
    useEffect(() => {
        if (callStatus === 'ringing' && !isCaller && ringtone) {
            ringtone.loop = true;
            ringtone.volume = 0.5; // Adjust volume (0.0 to 1.0)
            ringtone.play().catch((err) => console.error('Ringtone play error:', err));
        }
        return () => {
            if (ringtone) {
                ringtone.pause();
                ringtone.currentTime = 0;
            }
        };
    }, [callStatus, isCaller, ringtone]);

    const initiateCall = useCallback(async () => {
        if (!thread?.id || token || meetingId || !socket?.connected || isInitiating) {
            console.log('Cannot initiate call:', {
                threadId: thread?.id,
                token,
                meetingId,
                socketConnected: socket?.connected,
                isInitiating,
            });
            return;
        }

        console.log('Starting initiateCall');
        setIsInitiating(true);

        try {
            // Validate thread data
            if (!thread.expertProfile?.user || !thread.task?.requesterProfile?.user) {
                throw new Error('Missing participant data');
            }

            // Extract participants
            const user1 =
                `${thread.expertProfile.user.firstName || 'Expert'} ${thread.expertProfile.user.lastName || ''}`.trim() ||
                'Expert User';
            const user2 =
                `${thread.task.requesterProfile.user.firstName || 'Requester'} ${thread.task.requesterProfile.user.lastName || ''
                    }`.trim() || 'Requester User';
            const participants = [{ name: user1 }, { name: user2 }];

            console.log('Participants:', participants);

            if (participants.length < 2) {
                throw new Error('At least two participants are required');
            }

            const other = participants.find((p) => p.name !== userName);
            if (!other) {
                throw new Error('No other participant found');
            }

            // Fetch VideoSDK room
=======
    const initializeCall = useCallback(async () => {
        if (!thread?.id || token || meetingId) return;

        try {
>>>>>>> 658ab244db674980553bba90cea7896065585098
            const response = await axios.post('/api/videosdk', { threadId: thread.id });
            if (!response.data.token || !response.data.roomId) {
                throw new Error('Invalid response from server');
            }
            setToken(response.data.token);
            setMeetingId(response.data.roomId);

<<<<<<< HEAD
            socket.emit('initiate_call', {
                threadId: thread.id,
                roomId: response.data.roomId,
                receiverName: other.name,
                callerName: userName,
            });

            console.log('initiateCall completed');
        } catch (error: any) {
            console.error('Error initiating call:', error.message);
            setError(error.message || 'Failed to start call');
            onEnd();
        } finally {
            setIsInitiating(false);
        }
    }, [socket, thread, token, meetingId, userName, isInitiating, onEnd]);

    useEffect(() => {
        if (isCaller && !isInitiating && socket?.connected) {
            console.log('Triggering initiateCall for caller');
            initiateCall();
        }
    }, [isCaller, initiateCall, isInitiating, socket]);

    useEffect(() => {
        if (!socket || !thread?.id) {
            console.log('Socket or thread missing in VideoCall:', { socket: !!socket, threadId: thread?.id });
            return;
        }

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
                    onEnd();
=======
            // Fetch invited participants dynamically
            let participants: { name: string; status: string }[] = [];
            try {
                const participantsResponse = await axios.get(`/api/thread/${thread.id}/participants`, { params: thread });
                const participantsData = participantsResponse.data.participants;
                console.log(":::", participantsData)
                if (!Array.isArray(participantsData)) {
                    console.warn('Participants data is not an array, using empty list:', participantsData);
                } else {
                    participants = participantsData.map((p: { name: string }) => ({
                        name: p.name,
                        status: 'not_joined',
                    }));
>>>>>>> 658ab244db674980553bba90cea7896065585098
                }
            } catch (participantsError: any) {
                console.error('Error fetching participants:', participantsError.response?.data || participantsError.message);
            }
            console.log("{{{", participants)
            setInvitedParticipants([
                ...participants.filter((p: { name: string }) => p.name !== userName),
                { name: userName, status: 'joined' },
            ]);

            if (socket) {
                console.log(">>>", socket)
                socket.emit('start_call', { threadId: thread.id, roomId: response.data.roomId, participants: participants.map((p: { name: string }) => p.name) });
            }
            setCallActive(true);
        } catch (error: any) {
            console.error('Error initializing video call:', error.response?.data || error.message);
            setError(`Failed to start video call: ${error.response?.data?.error || error.message}`);
        }
    }, [socket, thread, setCallActive, token, meetingId, userName]);

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
<<<<<<< HEAD
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
=======
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
>>>>>>> 658ab244db674980553bba90cea7896065585098

        return () => {
            socket.off('start_call', handleStartCall);
            socket.off('end_call', handleEndCall);
            socket.off('call_status', handleCallStatus);
        };
<<<<<<< HEAD
    }, [socket, thread, isCaller, onEnd]);

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ zIndex: 1050 }}>
            {error && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Error</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setError(null);
                                        onEnd();
                                    }}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-danger">{error}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        setError(null);
                                        onEnd();
                                    }}
                                >
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
            {token && meetingId && (
=======
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

    return (
        <div className="container-fluid vh-100 p-0 position-absolute top-0 start-0 bg-dark">
            {callActive && token && meetingId && (
>>>>>>> 658ab244db674980553bba90cea7896065585098
                <MeetingProvider
                    config={{
                        meetingId,
                        micEnabled: true,
                        webcamEnabled: true,
                        name: `${userName}`,
                    }}
                    token={token}
                    joinWithoutUserInteraction
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

<<<<<<< HEAD
const MeetingView: FC<MeetingViewProps> = memo(
    ({ isCaller, callStatus, setCallStatus, userName, otherParticipant, socket, threadId, onEnd, joinMeeting }) => {
        const { participants, leave, join, toggleMic, toggleWebcam, micEnabled, webcamEnabled, localParticipant } =
            useMeeting();
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
            if (socket?.connected && threadId) {
                socket.emit('call_ended', { threadId });
            } else {
                console.warn('Socket not connected or threadId missing, cannot emit call_ended');
            }
            onEnd();
        }, [leave, setCallStatus, socket, threadId, onEnd]);

        const handleAcceptCall = useCallback(() => {
            joinMeeting();
        }, [joinMeeting]);

        const handleRejectCall = useCallback(() => {
            setCallStatus('rejected');
            if (socket?.connected && threadId) {
                socket.emit('call_rejected', { threadId });
            } else {
                console.warn('Socket not connected or threadId missing, cannot emit call_rejected');
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
                        <div
                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3"
                            style={{ width: '100px', height: '100px', fontSize: '48px' }}
                        >
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
=======
    useEffect(() => {
        if (!hasJoined && !isMeetingJoined) {
            join();
            setHasJoined(true);
            console.log('Meeting joined');
>>>>>>> 658ab244db674980553bba90cea7896065585098
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
    console.log(":::", invitedParticipants)
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
<<<<<<< HEAD
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
                                    <div
                                        className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-3"
                                        style={{ width: '80px', height: '80px', fontSize: '32px' }}
                                    >
                                        {otherParticipant?.name?.charAt(0) || '?'}
=======
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                        {allParticipants.map((participant: any, index: number) => (
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
>>>>>>> 658ab244db674980553bba90cea7896065585098
                                    </div>
                                )}
                            </div>
<<<<<<< HEAD
                        )}
                    </div>
                    {localParticipant?.id && (
                        <div
                            className={`position-absolute bottom-0 end-0 rounded shadow ${callStatus === 'ringing' && isCaller ? 'shadow-lg' : ''
                                }`}
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
=======
                        ))}
>>>>>>> 658ab244db674980553bba90cea7896065585098
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