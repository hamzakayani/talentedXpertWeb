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
import { Cancel01Icon, Notification01Icon } from "@hugeicons/core-free-icons";
import { useFetchDashboardData } from "@/hooks/dashboard/useDashboard";

interface NotificationProps {
  isDashboard: boolean;
}

const Notifications: FC<NotificationProps> = ({ isDashboard }) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [notification, setNotification] = useState<any[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const { navigate } = useNavigation();
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const [popupHeight, setPopupHeight] = useState(280);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMoreNotifications, setHasMoreNotifications] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { refetch: refetchDashboard } = useFetchDashboardData({
    enabled: false, // we only trigger manually here
  });

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        !bellRef.current?.contains(event.target as Node)
      ) {
        console.log("ccc")
        setIsPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    getNotifications(1);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const NotificationRoutes = (noti: any) => {
    if (socket && !noti?.isRead) {
      socket.emit("markNotificationAsRead", { notificationId: noti?.id });
      getNotifications(1);
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

  const getNotifications = async (page = 1) => {
    if (loading || !hasMoreNotifications) return;
    setLoading(true);
    try {
      const response = await apiCall(
        requests.notifications,
        { page },
        "get",
        false,
        dispatch,
        user,
        router
      );
      const newNotifications = response?.data?.data?.notifications || [];
      const totalAvailablePages = response?.data?.data?.pagination?.totalPages || 1;

      setTotalPages(totalAvailablePages);

      if (newNotifications.length === 0 || page >= totalAvailablePages) {
        setHasMoreNotifications(false);
      } else {
        setNotification((prev) => [...prev, ...newNotifications]);
      }
    } catch (error) {
      // console.warn("Error fetching tasks:", error);
    } finally {
      setLoading(false);
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
        (thread: any) => Number(thread?.id) === Number(threadId)
      );
      if (matchingThread) {
        dispatch(setThread(matchingThread));
        navigate(`/dashboard/messages/${matchingThread?.id}`);
      }
    } catch (error) {
      console.warn("Error fetching threads", error);
    }
    getNotifications(1);
  };

  useEffect(() => {
    if (socket) {
      const notificationHandler = (notification: any) => {
        // If it's a message, update dashboard stats
        if (notification?.type === "MESSAGE") {
          refetchDashboard(); // fetch updated unread message count
        }
        getNotifications(1);
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

  useEffect(() => {
    if (notificationPanelRef.current) {
      setPopupHeight(notificationPanelRef.current.offsetHeight);
    }
  }, [notificationPanelRef.current?.offsetHeight]); // re-run if height changes

  const topPosition = bellRef.current
    ? bellRef.current.getBoundingClientRect().top + window.scrollY - popupHeight
    : 0;

  const togglePanel = () => setIsPanelOpen((prev) => !prev);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const bottom =
      e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && !loading && hasMoreNotifications && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      getNotifications(currentPage + 1);
    }
  };

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
                  background:
                    "linear-gradient(270deg, #FF0000 0%, #FF7E47 100%)",
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
                height: "40lvh",
                backgroundColor: "var(--b1-bg)",
                color: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                overflowY: "auto",
                zIndex: 99999,
                transform: "translateX(18%) translateY(0%)",
                transition: "all 0.25s ease",
                top: `${topPosition}px`,
              }}
              onScroll={handleScroll}
            >
              <div
                className="d-flex justify-content-between align-items-center mb-3 sticky top-0"
                style={{
                  position: "sticky",
                  top: "0",
                  background: "var(--b1-bg)",
                  padding: "0 1rem 0",
                  height: "6svh",
                }}
              >
                <h6 className="m-0 text-white fw-semibold">Notifications</h6>
                <button
                  className="btn btn-sm btn-link p-0 rounded-2"
                  onClick={() => setIsPanelOpen(false)}
                  style={{
                    background:
                      "linear-gradient(90deg, #D7E2FF 0%, #E1F9FF 100%)",
                  }}
                >
                  <HugeiconsIcon icon={Cancel01Icon} />
                </button>
              </div>
              <div
                className="notifi_list"
                style={{
                  minHeight: "88svh",
                  maxHeight: "88lvh",
                  padding: "0 1rem",
                  overflow: "auto",
                }}
              >
                {notification?.length > 0 ? (
                  <>
                    {notification?.map((noti: any) => (
                      <div
                        key={noti.id}
                        className="d-flex align-items-center mb-2 p-2 rounded"
                        style={{
                          backgroundColor: noti.isRead
                            ? "rgba(255,255,255,0.05)"
                            : "transparent",
                          borderLeft: noti.isRead ? "none" : "0px solid #007bff",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          NotificationRoutes(noti);
                          setIsPanelOpen(false);
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
                          <small className="" style={{ color: "#8A8A8A" }}>
                            {noti.message}
                          </small>
                        </div>
                        <small className="" style={{ color: "#8A8A8A" }}>
                          {getTimeago(noti.createdAt)}
                        </small>
                      </div>
                    ))}
                    {(loading || !hasMoreNotifications ) &&
                      <div className="loading-indicator text-center mt-1">
                        <div className="spinner"></div>
                        <span>Loading more notifications...</span>
                      </div>
                    }
                  </>
                )  : loading ? (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                  </div>
                ) :  (
                  <NoFound message="No notifications available" />
                )}
              </div>
              {/* <div
                className="viewall"
                style={{
                  background: "rgba(51, 51, 51, 1)",
                  padding: "1rem",
                  textAlign: "center",
                  height: "62px",
                  position: "sticky",
                  bottom: "0",
                }}
              >
                <button className="btn btn-link text-white text-decoration-none">
                  View All
                </button>
              </div> */}
            </div>,
            document.body
          )}
      </>
    );
  }

  return (
    <div className="d-lg-block noti-bell mt-3 position-relative">
      <button className="btn" type="button" onClick={togglePanel}>
        <Icon
          icon="iconamoon:notification-fill"
          className={`text-dark ms-2 mb-2 ${unreadCount === 0 ? "me-3 " : ""}`}
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
          <div className="notification-container" onScroll={handleScroll}>
            <div className="notifi-header">
              <a className="dropdown-item" href="#">
                Notifications
              </a>
            </div>
            {notification?.length > 0 ? (
              <>
                {notification?.map((noti: any) => (
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
                          <p className="GroupDescrp fs-12">{noti?.message}</p>
                        </div>
                      </div>
                    </div>
                    <div className="progres text-end">
                      <p className="GroupDescrp fs-10 text-muted">
                        {getTimeago(noti?.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
                {(loading || !hasMoreNotifications ) &&
                  <div className="loading-indicator text-center mt-1">
                    <div className="spinner"></div>
                    <span>Loading more notifications...</span>
                  </div>
                }
              </>
            )  : loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <span>Loading...</span>
              </div>
            ) :  (
              <NoFound message="No notifications available" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
