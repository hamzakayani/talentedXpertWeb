import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    MeetingProvider,
    useMeeting,
    // ParticipantView,
} from "@videosdk.live/react-sdk";
import { Icon } from "@iconify/react";
import { useParticipant } from "@videosdk.live/react-sdk";
import { useNavigation } from "@/hooks/useNavigation";


const CONTROL_BTN_CLASS =
    " border rounded-circle d-flex align-items-center justify-content-center";

const CONTROL_BTN_ACTIVE_CLASS = CONTROL_BTN_CLASS + " btn-primary text-white";

function ControlButton({ icon, label, active, onClick }: any) {
    const isLeaveBtn = label?.toLowerCase().includes("leave");

    const classNames = [
        active ? CONTROL_BTN_ACTIVE_CLASS : CONTROL_BTN_CLASS,
        isLeaveBtn ? "custom-danger-btn" : "",
        "me-2"
    ].join(" ");

    return (
        <button
            className={classNames}
            title={label}
            onClick={onClick}
            style={{
                width: 48,
                height: 48,
            }}
            aria-label={label}
        >
            {icon}
        </button>
    );
}

function getRandomColor(seed: string) {
    // Simple hash-based color generator
    const colors = ["#e57373", "#64b5f6", "#81c784", "#ffb74d", "#ba68c8"];
    const index = seed.charCodeAt(0) % colors.length;
    return colors[index];
}

function getOrCreateUserId() {
    let id = localStorage.getItem("userId");
    if (!id) {
        id = crypto.randomUUID(); // generate new UUID
        localStorage.setItem("userId", id);
    }
    return id;
}

function ParticipantVideo({ participantId }: { participantId: string }) {
    const {
        webcamStream,
        webcamOn,
        isLocal,
        displayName,
    } = useParticipant(participantId);

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(console.error);
        }
    }, [webcamStream, webcamOn]);

    const initial = displayName?.charAt(0).toUpperCase() || "?";
    const color = getRandomColor(initial);

    return (
        <div style={{ position: "relative", backgroundColor: "#000", height: "100%" }}>
            {webcamOn && webcamStream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: color,
                        fontSize: 48,
                        fontWeight: "bold",
                        color: "#fff",
                        userSelect: "none",
                    }}
                >
                    {initial}
                </div>
            )}

            {/* Name Tag at Top */}
            <div
                style={{
                    position: "absolute",
                    top: 4,
                    left: 4,
                    color: "white",
                    fontWeight: "600",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontSize: 14,
                }}
            >
                {displayName} {isLocal ? "(You)" : ""}
            </div>
        </div>
    );
}

function ParticipantsPanel({ participants }: any) {
    return (
        <div
            style={{
                width: 250,
                backgroundColor: "#f7f7f7",
                borderLeft: "1px solid #ddd",
                overflowY: "auto",
                color: "#000",
            }}
        >
            <h5 className="p-3 border-bottom">Participants</h5>
            <ul className="list-unstyled px-3">
                {participants.map((p: any) => (
                    <li
                        key={p.id}
                        className="d-flex align-items-center mb-3"
                        style={{ cursor: "default" }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: "#ddd",
                                borderRadius: "50%",
                                marginRight: 12,
                                overflow: "hidden",
                            }}
                        >
                            {/* <ParticipantView participantId={p.id} /> */}
                            {p.camOn && p.camStream ? (
                                <ParticipantVideo participantId={p.id} />
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "bold",
                                        color: "#555",
                                        fontSize: 18,
                                        userSelect: "none",
                                    }}
                                >
                                    {p.displayName?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                        <div>
                            <div style={{ fontWeight: "600" }}>{p.displayName}</div>
                            <small className="text-muted">
                                {p.audioOn ? "🎤 On" : "🔇 Muted"}{" "}
                                {p.isLocal ? "(You)" : ""}
                            </small>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function VideoGrid({ participants, localParticipantId }: any) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    participants.length === 1
                        ? "1fr"
                        : participants.length === 2
                            ? "1fr 1fr"
                            : participants.length <= 4
                                ? "1fr 1fr"
                                : "1fr 1fr 1fr",
                gap: 8,
                flexGrow: 1,
                padding: 8,
                backgroundColor: "#000",
            }}
        >
            {participants.map((p: any) => (
                <div
                    key={p.id}
                    style={{
                        backgroundColor: "#222",
                        borderRadius: 8,
                        overflow: "hidden",
                        position: "relative",
                        border:
                            p.id === localParticipantId ? "3px solid #0d6efd" : "none",
                        height: "100%",
                    }}
                >
                    <ParticipantVideo participantId={p.id} />
                </div>
            ))}
        </div>
    );
}


export default function Meeting({ token, meetingId, participantName }: any) {
    return (
        <MeetingProvider
            token={token}
            config={{
                meetingId,
                name: participantName,
                micEnabled: true,
                webcamEnabled: true,
            }}
            joinWithoutUserInteraction={true} // Auto-join the meeting
        >
            <MeetingInner />
        </MeetingProvider>
    );
}

function MeetingInner() {
    const {
        join,
        leave,
        end,
        participants,
        localParticipant,
        toggleMic,
        toggleScreenShare,
        micEnabled,
        webcamEnabled,
        toggleWebcam,
        isScreenShareOn,
        startRecording,
        stopRecording,
        isRecordingOn,
        meetingState,
        onParticipantJoined,
        onMeetingJoined,
        onMeetingLeft
    } = useMeeting({
        onMeetingJoined: () => console.log("Meeting joined"),
        onMeetingLeft: () => console.log("Meeting left"),
        // onParticipantJoined: (p: any) => console.log("Participant joined:", p),
        onParticipantLeft: (p: any) => console.log("Participant left:", p),
        // onMeetingLeft: () => {
        //     console.log("Meeting left");
        //     setParticipantsMap(new Map());
        //     navigate("/");
        // },
        onParticipantJoined: (p: any) => {
            console.log("Participant joined:", p);
            // setParticipantsMap((prev) => {
            //     if (prev.has(p.id)) return prev; // avoid duplicates
            //     const newMap = new Map(prev);
            //     newMap.set(p.id, p);
            //     return newMap;
            // });
        },
        // onParticipantLeft: (p: any) => {
        //     console.log("Participant left:", p);
        //     setParticipantsMap((prev) => {
        //         const newMap = new Map(prev);
        //         newMap.delete(p.id);
        //         return newMap;
        //     });
        // },
        onMeetingStateChanged: (data: any) => console.log("Meeting state:", data.state),
        onError: (err: any) => console.error("Meeting error:", err),
    });
    console.log("Participants:", micEnabled, webcamEnabled, Array.from(participants.values()), meetingState);

    const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);

    const { navigate } = useNavigation()

    // Join only when state is not yet CONNECTED
    const hasJoinedRef = useRef(false);
    const permissionListenerRef = useRef<(() => void) | null>(null);

    const participantsArray = React.useMemo(() => Array.from(participants.values()), [participants]);
    console.log("ParticipantsArray:", participantsArray);

    // useEffect(() => {
    //     async function init() {
    //         try {
    //             await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    //             console.log("Microphone and camera permission granted");
    //             join({ micEnabled: true, webcamEnabled: true });
    //         } catch (err) {
    //             console.error("Microphone or camera permission denied:", err);
    //         }
    //     }

    //     if (!hasJoinedRef.current && meetingState !== "CONNECTED") {
    //         init();
    //         hasJoinedRef.current = true;
    //     }
    // }, [meetingState, join]);

    useEffect(() => {
        const initMeeting = async () => {
            let permissionGranted = false;
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                permissionGranted = true;
                console.log("Permissions granted—joining with mic & cam");
            } catch {
                console.warn("Permission denied");
            }

            if (!hasJoinedRef.current) {
                hasJoinedRef.current = true;
                await join({
                    micEnabled: permissionGranted,
                    webcamEnabled: permissionGranted,
                });
            }
        };

        initMeeting();
    }, [join]);

    const onToggleParticipants = () => setShowParticipantsPanel((v) => !v);

    const handleToggleMic = useCallback(async () => {
        await toggleMic();
    }, [toggleMic]);

    const handleToggleWebcam = useCallback(async () => {
        await toggleWebcam();
    }, [toggleWebcam]);

    const handleLeave = useCallback(async () => {
        await end(); // or leave()
        hasJoinedRef.current = false; // reset
        // setParticipantsMap(new Map()); // cleanup map
        navigate("/");
    }, [end, navigate]);


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                height: "100vh",
                width: "100vw",
                backgroundColor: "#121212",
                color: "#fff",
                overflow: "hidden",
                fontFamily: "'Google Sans', Arial, sans-serif",
            }}
        >
            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%", // IMPORTANT: constrain height of main column
                }}
            >
                {/* Container to scroll VideoGrid if needed */}
                <div
                    style={{
                        flexGrow: 1,
                        overflowY: "auto", // enable vertical scroll if grid is too tall
                        padding: 8,
                        backgroundColor: "#000",
                        height: "100%",
                    }}
                >
                    <VideoGrid
                        participants={Array.from(participants.values())}
                        localParticipantId={localParticipant?.id}
                    />
                </div>

                {/* Controls */}
                <div
                    style={{
                        padding: 12,
                        backgroundColor: "#202124",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0, // prevent shrinking of controls area
                    }}
                >
                    <ControlButton
                        label={micEnabled ? "Mute Mic" : "Unmute Mic"}
                        active={micEnabled}
                        onClick={handleToggleMic}
                        icon={<Icon icon={micEnabled ? 'mdi:microphone' : 'mdi:microphone-off'} width={20} />}
                    />

                    <ControlButton
                        label={webcamEnabled ? "Turn Off Camera" : "Turn On Camera"}
                        active={webcamEnabled}
                        onClick={handleToggleWebcam}
                        icon={
                            <Icon icon={webcamEnabled ? 'mdi:video' : 'mdi:video-off'} width={20} />
                        }
                    />

                    <ControlButton
                        label={isScreenShareOn ? "Stop Screen Share" : "Start Screen Share"}
                        active={isScreenShareOn}
                        onClick={toggleScreenShare}
                        icon={<Icon icon={isScreenShareOn ? 'mdi:monitor-share-off' : 'mdi:monitor-share'} width={20} />}
                    />

                    {isRecordingOn ? (
                        <ControlButton
                            label="Stop Recording"
                            active={true}
                            onClick={stopRecording}
                            icon={<Icon icon={'mdi:record-circle'} width={20} />}
                        />
                    ) : (
                        <ControlButton
                            label="Start Recording"
                            active={false}
                            onClick={startRecording}
                            icon={<Icon icon={'mdi:record'} width={20} />}
                        />
                    )}

                    <ControlButton
                        label="Participants"
                        active={showParticipantsPanel}
                        onClick={onToggleParticipants}
                        icon={<Icon icon={'mdi:account-multiple'} width={20} />}
                    />

                    <ControlButton
                        label="Leave Call"
                        active={false}
                        onClick={handleLeave}
                        icon={
                            <Icon icon="material-symbols-light:call-end" width={20} />
                            // <BoxArrowRight size={20} />
                        }
                    />
                </div>
            </div>

            {showParticipantsPanel && (
                <ParticipantsPanel participants={Array.from(participants.values())} />
            )}
        </div>
    );
}
