import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    MeetingProvider,
    useMeeting,
    ParticipantView,
} from "@videosdk.live/react-sdk";
import { Icon } from "@iconify/react";


const CONTROL_BTN_CLASS =
    "btn btn-light border rounded-circle d-flex align-items-center justify-content-center";

const CONTROL_BTN_ACTIVE_CLASS = CONTROL_BTN_CLASS + " btn-primary text-white";

function ControlButton({ icon, label, active, onClick }:any) {
    return (
        <button
            className={active ? CONTROL_BTN_ACTIVE_CLASS : CONTROL_BTN_CLASS}
            title={label}
            onClick={onClick}
            style={{ width: 48, height: 48, margin: "0 8px" }}
            aria-label={label}
        >
            {icon}
        </button>
    );
}

function ParticipantsPanel({ participants }:any) {
    return (
        <div
            style={{
                width: 250,
                backgroundColor: "#f7f7f7",
                borderLeft: "1px solid #ddd",
                overflowY: "auto",
            }}
        >
            <h5 className="p-3 border-bottom">Participants</h5>
            <ul className="list-unstyled px-3">
                {participants.map((p:any) => (
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
                                <ParticipantView participantId={p.id} />
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
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <div style={{ fontWeight: "600" }}>{p.name}</div>
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

function VideoGrid({ participants, localParticipantId }:any) {
    // Google Meet style grid: big main speaker, smaller grid below or on side.
    // For simplicity, show all in equal grid for now, highlight local participant.

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
            {participants.map((p:any) => (
                <div
                    key={p.id}
                    style={{
                        backgroundColor: "#222",
                        borderRadius: 8,
                        overflow: "hidden",
                        position: "relative",
                        border:
                            p.id === localParticipantId ? "3px solid #0d6efd" : "none",
                    }}
                    title={p.name + (p.isLocal ? " (You)" : "")}
                >
                    <ParticipantView
                        participantId={p.id}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 4,
                            left: 4,
                            color: "white",
                            fontWeight: "600",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            padding: "2px 6px",
                            borderRadius: 4,
                            userSelect: "none",
                            fontSize: 14,
                        }}
                    >
                        {p.name} {p.isLocal ? "(You)" : ""}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Meeting({ token, meetingId, participantName }:any) {
    return (
        <MeetingProvider
            token={token}
            config={{
                meetingId,
                name: participantName,
            }}
        >
            <MeetingInner />
        </MeetingProvider>
    );
}

function MeetingInner() {
    const {
        join,
        leave,
        participants,
        localParticipant,
        toggleMic,
        toggleCam,
        toggleScreenShare,
        isMicOn,
        isCamOn,
        isScreenShareOn,
        startRecording,
        stopRecording,
        isRecordingOn,
        recordingData,
    } = useMeeting();

    const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);

    useEffect(() => {
        join();
        // return () => leave();
    }, [join, leave]);

    const onToggleParticipants = () => setShowParticipantsPanel((v) => !v);

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
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <VideoGrid
                    participants={Object.values(participants)}
                    localParticipantId={localParticipant?.id}
                />

                {/* Controls */}
                <div
                    style={{
                        padding: 12,
                        backgroundColor: "#202124",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ControlButton
                        label={isMicOn ? "Mute Mic" : "Unmute Mic"}
                        active={isMicOn}
                        onClick={toggleMic}
                        icon={<Icon icon={isMicOn ? 'mdi:microphone' : 'mdi:microphone-off'} width={20} />}
                    />

                    <ControlButton
                        label={isCamOn ? "Turn Off Camera" : "Turn On Camera"}
                        active={isCamOn}
                        onClick={toggleCam}
                        icon={
                            <Icon icon={isCamOn ? 'mdi:video' : 'mdi:video-off'} width={20} />
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
                        icon={<Icon icon={'famicons:people'} width={20} />}
                    />

                    <ControlButton
                        label="Leave Call"
                        active={false}
                        onClick={() => leave()}
                        icon={
                            <Icon icon="material-symbols-light:call-end" width={24} />
                            // <BoxArrowRight size={20} />
                        }
                    />
                </div>
            </div>

            {showParticipantsPanel && (
                <ParticipantsPanel participants={Object.values(participants)} />
            )}
        </div>
    );
}
