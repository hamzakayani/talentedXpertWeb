import useSocket from '@/hooks/useSocket';
import { useEffect, useState } from "react";
import { MeetingProvider, useMeeting, useParticipant, MeetingConsumer } from "@videosdk.live/react-sdk";

const VideoCall = () => {
    const { socket } = useSocket(); 
    const [userId] = useState("user1"); 
    const [toUserId] = useState("user2"); 
    const [meetingId, setMeetingId] = useState<any>(null); 

    const { leave, meeting } = useMeeting();
    const { participants, join } = meeting;

    // Register user with the WebSocket server
    useEffect(() => {
        if (socket && userId) {
            socket.emit("register", userId);
        }
    }, [socket, userId]);

    // Handle incoming call (receiver side)
    useEffect(() => {
        if (socket) {
            socket.on("incoming-call", (data) => {
                const { fromUserId } = data;
                alert(`Incoming call from ${fromUserId}`);
            });

            socket.on("call-accepted", (data) => {
                const { fromUserId } = data;
                console.log(`Call accepted by ${fromUserId}`);

                // Create a unique meeting ID (this can be based on the user IDs or another method)
                const generatedMeetingId = `${userId}-${toUserId}`;
                setMeetingId(generatedMeetingId);
            });
        }
    }, [socket, userId]);

    // Start a call (caller side)
    const startCall = () => {
        socket?.emit("call", { toUserId, fromUserId: userId });
    };

    // Accept call (receiver side)
    const acceptCall = () => {
        socket?.emit("accept-call", { toUserId, fromUserId: userId });
    };

    // Reject call
    const rejectCall = () => {
        socket?.emit("reject-call", { toUserId, fromUserId: userId });
    };

    // Render the meeting
    const renderMeeting = () => {
        return (
            <div>
                <h1>Video Call</h1>
                <div>
                    {participants?.map((participant:any) => {
                        return (
                            <div key={participant.id}>
                                <h2>{participant.id}</h2>
                                <video
                                    id={`participant-video-${participant.id}`}
                                    autoPlay
                                    muted={participant.id === userId}
                                    ref={(ref) => participant.setVideoRef(ref)}
                                />
                            </div>
                        );
                    })}
                </div>
                <button onClick={leaveMeeting}>Leave Meeting</button>
            </div>
        );
    };

    return (
        <div>
            {!isMeetingJoined ? (
                <>
                    <button onClick={startCall}>Start Call</button>
                    <button onClick={acceptCall}>Accept Call</button>
                    <button onClick={rejectCall}>Reject Call</button>
                </>
            ) : (
                <MeetingProvider meetingId={meetingId}>
                    {renderMeeting()}
                </MeetingProvider>
            )}
        </div>
    );
};

export default VideoCall;
