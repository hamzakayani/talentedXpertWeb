'use client'
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import ImageFallback from "../../common/ImageFallback/ImageFallback";
import defaultUserImg from "../../../../public/assets/images/default-user.jpg";
import { useAppDispatch } from "@/store/Store";
import { setCallThread, startCall } from "@/reducers/CallSlice";
import { useNavigation } from "@/hooks/useNavigation";
import { toast } from "react-toastify";
import axios from "axios";

const ChatHeader = ({ user, thread }: any) => {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();
  const [permissionGrants, setPermissionGrants] = useState<boolean>(false);

  // Modal state for meeting link  
  const [showModal, setShowModal] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const createMeeting = async () => {
    const res = await axios.post('/api/videosdk', { threadId: thread.id });

    if (!res.data.token || !res.data.roomId) {
      throw new Error('Invalid VideoSDK response');
    }

    const { roomId } = res.data;
    return `${roomId}?token=${res.data.token}`;
  };

  const handleCreateMeeting = async () => {
    const meetingId = await createMeeting();
    const meetingURL = `${window.location.origin}/meeting/${meetingId}`;
    window.open(meetingURL, "_blank");
    setShowModal(false)
  };

  const handleJoinMeeting = () => {
    const meetingId = meetingLink.split("/").pop();
    if (meetingId) {     
      const meetingURL = `${window.location.origin}/meeting/${meetingId}`;
      window.open(meetingURL, "_blank");
      setMeetingLink("")
      setShowModal(false)
    } else {
      alert("Enter a valid meeting link");
    }
  };

  const handleStartCall = async (thread: any) => {
    if (!thread?.id) {
      toast.error("Thread ID is missing. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    if (!permissionGrants) {
      // Permissions not granted, try requesting them
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGrants(true); // Update state after granting permissions
      } catch (error: any) {
        console.error("Error accessing media devices:", error);
        let message =
          "An error occurred while accessing media devices. Please try again.";
        if (error.name === "NotAllowedError") {
          message =
            "Please allow access to your microphone and webcam to start the call.";
        } else if (error.name === "NotFoundError") {
          message =
            "No microphone or webcam found. Please connect a device and try again.";
        }
        toast.error(message, {
          position: "top-center",
          autoClose: false,
          closeButton: true,
        });
        return; // Stop execution if permissions are not granted
      }
    }

    // Permissions are granted, proceed with starting the call
    try {
      dispatch(setCallThread(thread));
      dispatch(startCall());
    } catch (error: any) {
      console.error("Error starting call:", error);
      toast.error("Failed to start the call. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="ChatHead">
      <li className="group">
        <div className="avatar me-2">
          <ImageFallback
            src={
              thread?.expertProfile?.userId === user?.id
                ? thread?.task?.requesterProfile?.user?.profilePicture?.fileUrl
                : thread?.expertProfile?.user?.profilePicture?.fileUrl
            }
            fallbackSrc={defaultUserImg}
            alt="img"
            className="user-img img-round"
            width={40}
            height={40}
            userName={
              thread?.expertProfile?.userId === user?.id
                ? `${thread?.task?.requesterProfile?.user?.firstName || thread?.team?.name} ${thread?.task?.requesterProfile?.user?.lastName != undefined && thread?.task?.requesterProfile?.user?.lastName}`
                : `${thread?.expertProfile?.user?.firstName || thread?.team?.name} ${thread?.task?.requesterProfile?.user?.lastName != undefined && thread?.expertProfile?.user?.lastName}`
            }
          />
        </div>
        <div>
          <p className="GroupName text-white mb-0">
            {thread?.expertProfile?.userId === user?.id
              ? (thread?.task?.requesterProfile?.user?.firstName && thread?.task?.requesterProfile?.user?.lastName
                ? `${thread?.task?.requesterProfile?.user?.firstName} ${thread?.task?.requesterProfile?.user?.lastName}`
                : thread?.team?.name)
              : (thread?.expertProfile?.user?.firstName && thread?.expertProfile?.user?.lastName
                ? `${thread?.expertProfile?.user?.firstName} ${thread?.expertProfile?.user?.lastName}`
                : thread?.team?.name)}
          </p>
          <p
            style={{ fontSize: "12px", cursor: "pointer" }}
            className="GroupName text-white mb-0"
            onClick={() => navigate(`/dashboard/tasks/${thread.task?.id}`)}
          >
            {thread?.task?.name}
          </p>
        </div>
      </li>
      <div className="callGroupicon d-flex align-items-center">
        <div className="search-boxx">
          <button className="btn-search">
            <Icon className="text-white m-1" icon="weui:search-outlined" />
          </button>
          <input
            type="text"
            className="input-search"
            placeholder="Type to Search..."
          />
        </div>
        <button
          className="btn btn-sm rounded-pill ms-2"
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #00BBFF, #5947FF)',
            color: '#ffffff',
            border: 'none',
            padding: '4px 20px'
          }}
        >Meet</button>
        {showModal && (
          <div className="ad-dispute">
            <div className="modal-backdrop fade show"></div>
            <div className="modal show d-block" tabIndex={-1} role="dialog">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                  <div className="modal-header" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
                    <h5 className="modal-title" style={{ color: '#ffffff' }}>Meet</h5>
                    <button type="button" className="btn-close bg-light" onClick={() => setShowModal(false)} />
                  </div><div className="modal-body d-flex flex-column align-items-center" style={{ backgroundColor: '#1a1a1a' }}>
                    <button
                      className="btn btn-primary w-100 mb-3"
                      onClick={handleCreateMeeting}
                      style={{ background: 'linear-gradient(135deg, #00BBFF, #5947FF)',color: '#ffffff', border: 'none' }}
                    >
                      Create Meeting
                    </button>

                    <div className="d-flex align-items-center w-100 mb-3">
                      <hr className="flex-grow-1" style={{ borderColor: '#333' }} />
                      <span className="mx-2" style={{ color: '#ffffff' }}>or</span>
                      <hr className="flex-grow-1" style={{ borderColor: '#333' }} />
                    </div>

                    <input
                      type="text"
                      placeholder="Paste Meeting Link"
                      className="form-control w-100 mb-3"
                      style={{ 
                        backgroundColor: '#2a2a2a', 
                        color: '#ffffff', 
                        border: '1px solid #444'
                      }}
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                    />
                    <style jsx>{`
                      input::placeholder {
                        color: #888 !important;
                        opacity: 1;
                      }
                    `}</style>

                    <button
                      className="btn btn-success w-100"
                      onClick={handleJoinMeeting}
                      disabled={!meetingLink.trim()}
                    >
                      Join Meeting
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/*<Icon
          className="text-info m-1 fs-24 cursor"
          icon="material-symbols-light:call-outline-sharp"
          onClick={() => handleStartCall(thread)}
        />
        <Icon
          className="text-info m-1 fs-24 cursor"
          icon="carbon:video"
          onClick={() => handleStartCall(thread)}
        />
        <Icon className="text-info m-1 fs-24" icon="mage:dots" />
        */}
      </div>
    </div>
  );
};

export default ChatHeader;
