'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    MeetingProvider,
    useMeeting,
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
                                {p.micOn ? "🎤 On" : "🔇 Muted"}{" "}
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
                height: "100%",
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
        // joinWithoutUserInteraction={true} // Auto-join the meeting
        >
            <MeetingInner meetingId={meetingId} />
        </MeetingProvider>
    );
}

function MeetingInner({ meetingId }: { meetingId: string }) {
    const {
        join,
        leave,
        participants,
        localParticipant,
        toggleMic,
        toggleScreenShare,
        localMicOn,
        localWebcamOn,
        toggleWebcam,
        localScreenShareOn,
        startRecording,
        stopRecording,
        isRecording,
    } = useMeeting({
        onMeetingJoined: () => console.log("Meeting joined"),
        onMeetingLeft: () => console.log("Meeting left"),
        onParticipantLeft: (p: any) => console.log("Participant left:", p),
        onParticipantJoined: (p: any) => console.log("Participant joined:", p),
        onMeetingStateChanged: (data: any) => console.log("Meeting state:", data.state),
        onError: (err: any) => console.error("Meeting error:", err),
    });

    const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);

    const { navigate } = useNavigation()

    const hasLeftRef = useRef(false);
    const participantsArray = Array.from(participants.values());


    useEffect(() => {
        const initMeeting = async () => {
            if(hasLeftRef.current) return; // Prevent re-joining if already left
            
            let permissionGranted = false;
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                permissionGranted = true;
                console.log("Permissions granted—joining with mic & cam");
            } catch {
                console.warn("Permission denied");
            }

            const SESSION_KEY = `meeting-joined-${meetingId}`;
            if (!sessionStorage.getItem(SESSION_KEY) && permissionGranted) {
                sessionStorage.setItem(SESSION_KEY, "true");
                await join({
                    localMicOn: permissionGranted,
                    localWebcamOn: permissionGranted,
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

    const handleToggleShare = useCallback(async () => {
        await toggleScreenShare();
    }, [toggleScreenShare]);

    const handleStartRecording = useCallback(async () => {
        await startRecording();
    }, [startRecording]);

    const handleStopRecording = useCallback(async () => {
        await stopRecording();
    }, [stopRecording]);

    const handleLeave = useCallback(async () => {
        hasLeftRef.current = true;
        await leave(); // or leave()
        sessionStorage.removeItem(`meeting-joined-${meetingId}`);
        navigate("/");
    }, [leave, navigate]);

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
                    }}
                >
                    <VideoGrid
                        participants={participantsArray}
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
                        label={localMicOn ? "Mute Mic" : "Unmute Mic"}
                        active={localMicOn}
                        onClick={handleToggleMic}
                        icon={<Icon icon={localMicOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={20} />}
                    />

                    <ControlButton
                        label={localWebcamOn ? "Turn Off Camera" : "Turn On Camera"}
                        active={localWebcamOn}
                        onClick={handleToggleWebcam}
                        icon={
                            <Icon icon={localWebcamOn ? 'mdi:video' : 'mdi:video-off'} width={20} />
                        }
                    />

                    <ControlButton
                        label={localScreenShareOn ? "Stop Screen Share" : "Start Screen Share"}
                        active={localScreenShareOn}
                        onClick={handleToggleShare}
                        icon={<Icon icon={localScreenShareOn ? 'mdi:monitor-share-off' : 'mdi:monitor-share'} width={20} />}
                    />

                    {isRecording ? (
                        <ControlButton
                            label="Stop Recording"
                            active={true}
                            onClick={handleStopRecording}
                            icon={<Icon icon={'mdi:record-circle'} width={20} />}
                        />
                    ) : (
                        <ControlButton
                            label="Start Recording"
                            active={false}
                            onClick={handleStartRecording}
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
                <ParticipantsPanel participants={participantsArray} />
            )}
        </div>
    );
}
