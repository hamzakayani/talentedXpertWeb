"use client";
import useSocket from "@/hooks/useSocket";
import { Icon } from "@iconify/react";
import React, { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ImageFallback from "../ImageFallback/ImageFallback";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import NoFound from "../NoFound/NoFound";
import { setThread } from "@/reducers/ThreadSlice";
// import defaultUserImg from "../../../../public/assets/images/default-user.jpg";
import { getTimeago } from "@/services/utils/util";
import { useNavigation } from "@/hooks/useNavigation";
import GlobalLoader from "../GlobalLoader/GlobalLoader";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { useFetchDashboardData } from "@/hooks/dashboard/useDashboard";

interface NotificationProps {
  isDashboard: boolean
}

const Notifications:FC<NotificationProps> = ({ isDashboard }) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [notification, setNotification] = useState<any>();
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const { navigate } = useNavigation();
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const { refetch: refetchDashboard } = useFetchDashboardData({
    enabled: false, // we only trigger manually here
  });

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target)&&
        !bellRef.current?.contains(event.target as Node)
      ) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const NotificationRoutes = (noti: any) => {
    if (socket && !noti?.isRead) {
      socket.emit("markNotificationAsRead", { notificationId: noti?.id });
      getNotifications();
    }
    if (noti?.type == "MESSAGE") {
      getMessageThread(noti?.metadata?.threadId, noti);
    }
    if (noti.type == "TASK") {
      navigate(`/dashboard/tasks/${noti?.metadata?.taskId}`);
    }
    if (noti?.type == "PROPOSAL") {
      navigate(
        `/dashboard/tasks/${noti?.metadata?.taskId}/proposals/${noti?.metadata?.proposalId}`
      );
    }
    if (noti?.type == "CONTRACT") {
      navigate(`/dashboard/tasks/${noti?.metadata?.taskId}`);
    }
  };

  const getNotifications = async () => {
    try {
      const response = await apiCall(
        requests.notifications,
        {},
        "get",
        false,
        dispatch,
        user,
        router
      );
      setNotification(response?.data?.data?.notifications || []);
    } catch (error) {
      // console.warn("Error fetching tasks:", error);
    }
  };

  const getMessageThread = async (threadId: any, notificationId: any) => {
    try {
      const response = await apiCall(
        requests.getThread,
        {},
        "get",
        false,
        dispatch,
        user,
        router
      );
      const matchingThread = response?.data?.threads?.find(
        (thread: any) => thread?.id === threadId
      );
      if (matchingThread) {
        dispatch(setThread(matchingThread));
        navigate(`/dashboard/messages/${matchingThread?.id}`);
      }
    } catch (error) {
      console.warn("Error fetching threads", error);
    }
    getNotifications();
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      const notificationHandler = (notification: any) => {
        // If it's a message, update dashboard stats
        if (notification?.type === "MESSAGE") {
          refetchDashboard(); // fetch updated unread message count
        }
        getNotifications();
        toast(`You have a new ${notification?.type?.toLowerCase()}`, {
          type: "info",
          autoClose: 5000,
        });
      };

      socket.on("notification", notificationHandler);

      // return () => {
      //   socket.off("notification", notificationHandler);
      // };
    }
  }, [socket]);

  const unreadCount =
    notification?.filter((noti: any) => !noti.isRead)?.length || 0;

  // // Handle notification click
  // const handleNotificationClick = (noti: any) => {
  //   if (socket && !noti.isRead) {
  //     socket.emit("markNotificationAsRead", { notificationId: noti.id });
  //     getNotifications();
  //   }

  //   switch (noti.type) {
  //     case "MESSAGE":
  //       getMessageThread(noti.metadata.threadId, noti);
  //       break;
  //     case "TASK":
  //     case "CONTRACT":
  //       navigate(`/dashboard/tasks/${noti.metadata.taskId}`);
  //       break;
  //     case "PROPOSAL":
  //       navigate(
  //         `/dashboard/tasks/${noti.metadata.taskId}/proposals/${noti.metadata.proposalId}`
  //       );
  //       break;
  //     default:
  //       break;
  //   }
  //   setIsPanelOpen(false);
  // };

  const togglePanel = () => setIsPanelOpen((prev) => !prev);

  if (isDashboard) {
    return (
      <>
        <div
          className="notifications mt-auto pb-3 pt-5"
          ref={bellRef}
          onClick={togglePanel}
          style={{ cursor: "pointer" }}
        >
          <div className="position-relative">
            {unreadCount > 0 && (
              <span
                className="position-absolute translate-middle badge rounded-2 fw-normal"
                style={{
                  background: "linear-gradient(270deg, #FF0000 0%, #FF7E47 100%)",
                  color: "#fff",
                  padding: "4px 6px",
                  lineHeight: "1",
                  top: "-12px",
                  left: "15px",
                }}
              >
                {unreadCount}+
              </span>
            )}
            <HugeiconsIcon icon={Notification01Icon} />
            <span
              className="position-absolute translate-right p-1 rounded-circle"
              style={{
                background: "linear-gradient(270deg, #FF0000 0%, #FF7E47 100%)",
                top: "5px",
                right: "0px",
              }}
            ></span>
          </div>
        </div>

        {typeof window !== "undefined" &&
          isPanelOpen && 
          createPortal(
            <div
              className="dashboard-notifications-popup"
              ref={notificationPanelRef}
              style={{
                position: "absolute",
                width: "40vmin",
                height: "43vmin",
                backgroundColor: "var(--neutral-800)",
                color: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                overflowY: "auto",
                padding: "1rem",
                zIndex: 99999,
                transform: "translateX(10%) translateY(-10%)",
                transition: "all 0.25s ease",
                top:
                  bellRef.current?.getBoundingClientRect().top! -
                  window.scrollY -
                  300, // popup above bell
                left:
                  bellRef.current?.getBoundingClientRect().left! +
                  bellRef.current?.offsetWidth! / 2,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="m-0 text-white">Notifications</h6>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setIsPanelOpen(false)}
                >
                  ✕
                </button>
              </div>
              {notification?.length > 0 ? (
                notification?.map((noti:any) => (
                  <div
                    key={noti.id}
                    className="d-flex align-items-center mb-2 p-2 rounded"
                    style={{
                      backgroundColor: noti.isRead
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.15)",
                      borderLeft: noti.isRead
                        ? "none"
                        : "3px solid #007bff",
                      cursor: "pointer",
                    }}
                  >
                    <ImageFallback
                      src={noti?.senderProfile?.user?.profilePicture?.fileUrl}
                      alt="user"
                      width={40}
                      height={40}
                      className="rounded-circle"
                      style={{ objectFit: "cover" }}
                      loading="lazy"
                      userName={`${noti.senderProfile.user.firstName} ${noti.senderProfile.user.lastName}`}
                    />
                    <div className="ms-3 flex-grow-1">
                      <p className="m-0 fw-semibold text-white">
                        {noti.senderProfile.user.firstName}{" "}
                        {noti.senderProfile.user.lastName}
                      </p>
                      <small className="text-white">{noti.type}</small>
                    </div>
                    <small className="text-white">
                      {getTimeago(noti.createdAt)}
                    </small>
                  </div>
                ))
              ) : (
                <NoFound message="No notifications available" />
              )}
            </div>,
            document.body
          )}
      </>
    );
  }

  return (
    <div className="d-lg-block noti-bell mt-3 position-relative">
      <button
        className="btn"
        type="button"
        onClick={togglePanel}
      >
        <Icon
          icon="iconamoon:notification-fill"
          className={`text-dark ms-2 mb-2 ${unreadCount === 0 ? 'me-3 ' : ''}`}
          width="24"
          height="24"
        />
        {unreadCount > 0 && (
          <span className="noti-msg-count translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {isPanelOpen && (
        <div
          className="dropdown-menu dropfix show"
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-10%)",
            marginTop: "10px",
            zIndex: 1000,
          }}
          ref={notificationPanelRef}
        >
          <div className="notification-container">
            <div className="notifi-header">
              <a className="dropdown-item" href="#">
                Notifications
              </a>
            </div>
            {notification?.length > 0 ? (
              notification?.map((noti: any) => (
                <li
                  className="group notifi-main d-flex justify-content-between mx-3"
                  key={noti?.id}
                  onClick={() => {
                    NotificationRoutes(noti);
                    setIsPanelOpen(false);
                  }}
                  style={{
                    padding: "5px",
                    cursor: "pointer",
                    backgroundColor: noti?.isRead ? "#ffffff" : "#f0f8ff",
                    borderLeft: noti?.isRead ? "none" : "4px solid #007bff",
                  }}
                >
                  <div className="d-flex cursor">
                    <div className="avatar">
                      <ImageFallback
                        src={noti?.senderProfile?.user?.profilePicture?.fileUrl}
                        alt="user"
                        className="user-img img-round"
                        width={40}
                        height={40}
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                        userName={
                          noti?.senderProfile?.user
                            ? `${noti?.senderProfile?.user?.firstName} ${noti?.senderProfile?.user?.lastName}`
                            : null
                        }
                      />
                    </div>
                    <div className="namedescription m-0 ms-3">
                      <p className="GroupName">
                        {noti?.senderProfile?.user?.firstName}{" "}
                        {noti?.senderProfile?.user?.lastName}
                      </p>
                      <div className="d-flex">
                        <p className="GroupDescrp fs-12">{noti?.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="progres text-end">
                    <p className="GroupDescrp fs-10 text-muted">
                      {getTimeago(noti?.createdAt)}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <NoFound message={"No notifications available"} />
            )}
          </div>
        </div>
      )}
    </div>
  );
  // return (
  //   <>
  //     <button
  //       className="btn position-relative"
  //       type="button"
  //       onClick={() => setIsPanelOpen(!isPanelOpen)}
  //     >
  //       <Icon
  //         icon="iconamoon:notification-fill"
  //         className={`text-dark ms-2 mb-2 ${unreadCount === 0 ? 'me-3 ' : ''}`}
  //         width="24"
  //         height="24"
  //       />
  //       {unreadCount > 0 && (
  //         <span className="noti-msg-count translate-middle badge rounded-pill bg-danger">
  //           {unreadCount}
  //         </span>
  //       )}
  //     </button>

  //     {/* Overlay */}
  //     {isPanelOpen && (
  //       <div
  //         className="notification-overlay"
  //         onClick={() => setIsPanelOpen(false)}
  //       ></div>
  //     )}

  //     {/* Notification Drawer */}
  //     <div
  //       ref={panelRef}
  //       className={`notification-drawer ${isPanelOpen ? "open" : ""}`}
  //     >
  //       <div className="notification-header d-flex justify-content-between align-items-center p-3 border-bottom">
  //         <h5 className="m-0">Notifications</h5>
  //         <button
  //           className="btn-close"
  //           onClick={() => setIsPanelOpen(false)}
  //         ></button>
  //       </div>

  //       <div className="notification-body p-3">
  //         {notification?.length > 0 ? (
  //           notification?.map((noti:any) => (
  //             <div
  //               key={noti.id}
  //               onClick={() => handleNotificationClick(noti)}
  //               className={`d-flex align-items-center p-2 mb-2 rounded cursor-pointer ${
  //                 noti.isRead ? "bg-light" : "bg-primary bg-opacity-10"
  //               }`}
  //               style={{
  //                 borderLeft: noti.isRead ? "none" : "4px solid #007bff",
  //               }}
  //             >
  //               <ImageFallback
  //                 src={
  //                   noti.senderProfile?.user?.profilePicture?.fileUrl ||
  //                   defaultUserImg
  //                 }
  //                 alt="user"
  //                 width={40}
  //                 height={40}
  //                 className="rounded-circle"
  //                 userName={
  //                   noti.senderProfile?.user
  //                     ? `${noti.senderProfile.user.firstName} ${noti.senderProfile.user.lastName}`
  //                     : null
  //                 }
  //               />
  //               <div className="ms-2 flex-grow-1">
  //                 <p className="mb-0 fw-semibold text-capitalize">
  //                   {noti.senderProfile?.user?.firstName}{" "}
  //                   {noti.senderProfile?.user?.lastName}
  //                 </p>
  //                 <small className="text-muted">{noti.type}</small>
  //               </div>
  //               <small className="text-muted">{getTimeago(noti.createdAt)}</small>
  //             </div>
  //           ))
  //         ) : (
  //           <NoFound message="No notifications available" />
  //         )}
  //       </div>
  //     </div>

  //     {/* 💅 Drawer Styles */}
  //     <style jsx>{`
  //       .notification-overlay {
  //         position: fixed;
  //         top: 0;
  //         left: 0;
  //         width: 100vw;
  //         height: 100vh;
  //         background: rgba(0, 0, 0, 0.3);
  //         z-index: 1040;
  //       }

  //       .notification-drawer {
  //         position: fixed;
  //         top: 0;
  //         right: 0;
  //         height: 100vh;
  //         width: 350px;
  //         background: #fff;
  //         box-shadow: -4px 0 10px rgba(0, 0, 0, 0.15);
  //         transform: translateX(100%);
  //         transition: transform 0.3s ease-in-out;
  //         z-index: 1050;
  //         display: flex;
  //         flex-direction: column;
  //       }

  //       .notification-drawer.open {
  //         transform: translateX(0);
  //       }

  //       .notification-body {
  //         overflow-y: auto;
  //         flex-grow: 1;
  //       }

  //       .cursor-pointer {
  //         cursor: pointer;
  //       }
  //     `}</style>
  //   </>
  // );
};

export default Notifications;