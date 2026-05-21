"use client";
import useSocket from "@/hooks/useSocket";
import { Icon } from "@iconify/react";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
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
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMoreNotifications, setHasMoreNotifications] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const loadMoreInFlightRef = useRef(false);
  const highestLoadedPageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const loadingInitialRef = useRef(false);
  const totalPagesRef = useRef(1);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const silentRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadMoreStartedAtRef = useRef<number>(0);

  const syncPaginationRefs = (hasMore: boolean, total: number) => {
    hasMoreRef.current = hasMore;
    totalPagesRef.current = total;
    setHasMoreNotifications(hasMore);
    setTotalPages(total);
  };

  const { refetch: refetchDashboard } = useFetchDashboardData({
    enabled: false, // we only trigger manually here
    profileType: user?.profile?.[0]?.type || null,
  });

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        !bellRef.current?.contains(event.target as Node)
      ) {
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
    // Mark notification as read if socket is connected and notification is unread
    if (socket && socket.connected && !noti?.isRead) {
      try {
        socket.emit("markNotificationAsRead", { notificationId: noti?.id });
        console.log("Emitted markNotificationAsRead for notification:", noti?.id);
      } catch (error) {
        console.error("Error emitting markNotificationAsRead:", error);
      }
    } else {
      // Debug logging to help identify why markNotificationAsRead wasn't called
      if (!socket) {
        console.warn("Socket is null/undefined, cannot mark notification as read");
      } else if (!socket.connected) {
        console.warn("Socket is not connected, cannot mark notification as read. Connection status:", socket.connected);
      } else if (noti?.isRead) {
        console.log("Notification already read, skipping markNotificationAsRead");
      }
    }
    if (noti?.type == "MESSAGE") {
      getMessageThread(noti?.metadata?.threadId, noti);
    }
    if (noti.type == "TASK" || noti.type == "REVIEW") {
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

  const getNotifications = async (page = 1, options?: { silent?: boolean }) => {
    const silent = options?.silent === true;

    if (page === 1) {
      if (!silent && loadingMore) {
        loadMoreInFlightRef.current = false;
        setLoadingMore(false);
      }
      if (!silent) {
        highestLoadedPageRef.current = 0;
        hasMoreRef.current = true;
      }
      if (loadingInitialRef.current && !silent) return;
      if (loadingInitialRef.current && silent) return;
    } else {
      if (
        loadMoreInFlightRef.current ||
        loadingMoreRef.current ||
        loadingInitialRef.current ||
        !hasMoreRef.current
      ) {
        return;
      }
      loadMoreInFlightRef.current = true;
    }

    if (page === 1) {
      if (!silent) {
        loadingInitialRef.current = true;
        setLoadingInitial(true);
      }
    } else {
      loadMoreStartedAtRef.current = Date.now();
      loadingMoreRef.current = true;
      setLoadingMore(true);
    }

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
      const payload = response?.data?.data ?? response?.data ?? {};
      const newNotifications = payload?.notifications || [];
      const pag = payload?.pagination ?? {};
      const totalAvailablePages = Math.max(1, Number(pag?.totalPages ?? 1));
      // Backend pagination.page is 0-based while requests are 1-based.
      const reportedPage =
        typeof pag?.page === "number" ? Math.max(pag.page + 1, page) : page;

      highestLoadedPageRef.current = Math.max(
        highestLoadedPageRef.current,
        reportedPage,
        page
      );
      const hasMore =
        newNotifications.length > 0 &&
        highestLoadedPageRef.current < totalAvailablePages;
      syncPaginationRefs(hasMore, totalAvailablePages);

      const sorted = [...newNotifications].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (page === 1) {
        if (silent) {
          setNotification((prev) => {
            const headIds = new Set(sorted.map((n: any) => n.id));
            const tail = prev.filter((n: any) => !headIds.has(n.id));
            return [...sorted, ...tail].sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        } else {
          setNotification(sorted);
        }
      } else {
        if (newNotifications.length === 0) {
          syncPaginationRefs(false, totalAvailablePages);
        }
        setNotification((prev) => {
          const seen = new Set(prev.map((n: any) => n.id));
          const merged = sorted.filter((n: any) => !seen.has(n.id));
          return [...prev, ...merged];
        });
      }
    } catch (error) {
      // console.warn("Error fetching tasks:", error);
    } finally {
      if (page === 1) {
        if (!silent) {
          loadingInitialRef.current = false;
          setLoadingInitial(false);
        }
      } else {
        loadMoreInFlightRef.current = false;
        const elapsed = Date.now() - loadMoreStartedAtRef.current;
        const minVisibleMs = 350;
        const remaining = Math.max(0, minVisibleMs - elapsed);
        const finishLoadingMore = () => {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        };
        if (remaining > 0) {
          setTimeout(finishLoadingMore, remaining);
        } else {
          finishLoadingMore();
        }
      }
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
    if (!socket) return;

    const notificationHandler = (payload: any) => {
      if (payload?.type === "MESSAGE") {
        refetchDashboard();
      }

      if (
        payload?.id &&
        payload?.message &&
        payload?.receiverProfileId != null &&
        payload?.senderProfile?.user
      ) {
        setNotification((prev) => {
          if (prev.some((n: any) => n.id === payload.id)) return prev;
          return [payload, ...prev].sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }

      if (silentRefreshTimerRef.current) {
        clearTimeout(silentRefreshTimerRef.current);
      }
      silentRefreshTimerRef.current = setTimeout(() => {
        silentRefreshTimerRef.current = null;
        getNotifications(1, { silent: true });
      }, 400);

      toast(`You have a new ${payload?.type?.toLowerCase()}`, {
        type: "info",
        autoClose: 5000,
      });
    };

    socket.on("notification", notificationHandler);

    return () => {
      socket.off("notification", notificationHandler);
      if (silentRefreshTimerRef.current) {
        clearTimeout(silentRefreshTimerRef.current);
        silentRefreshTimerRef.current = null;
      }
    };
  }, [socket, refetchDashboard]);

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

  const togglePanel = () => {
    setIsPanelOpen((prev) => {
      const next = !prev;
      // Avoid re-fetch on every reopen; initial load + realtime updates keep list fresh.
      if (next && notification.length === 0) {
        getNotifications(1);
      }
      return next;
    });
  };

  const loadNextPage = useCallback(() => {
    const nextQueryPage = highestLoadedPageRef.current + 1;
    if (
      loadMoreInFlightRef.current ||
      loadingMoreRef.current ||
      loadingInitialRef.current ||
      !hasMoreRef.current ||
      nextQueryPage > totalPagesRef.current
    ) {
      return;
    }
    getNotifications(nextQueryPage);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const el = e.currentTarget;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 24;
    if (bottom) {
      loadNextPage();
    }
  };

  // Reliable infinite scroll when list bottom enters view
  useEffect(() => {
    if (!isPanelOpen) return;
    const sentinel = loadMoreSentinelRef.current;
    const scrollRoot = (notificationPanelRef.current?.querySelector(
      ".notifi_list"
    ) ||
      notificationPanelRef.current?.querySelector(
        ".notification-container"
      )) as HTMLElement | null;
    if (!sentinel || !scrollRoot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadNextPage();
        }
      },
      { root: scrollRoot, rootMargin: "0px 0px 80px 0px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isPanelOpen, notification.length, loadingMore, hasMoreNotifications, loadNextPage]);

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
              className="dashboard-notifications-popup d-flex flex-column"
              ref={notificationPanelRef}
              style={{
                position: "absolute",
                height: "40lvh",
                maxHeight: "40lvh",
                backgroundColor: "var(--b1-bg)",
                color: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                overflow: "hidden",
                zIndex: 99999,
                transform: "translateX(18%) translateY(0%)",
                transition: "all 0.25s ease",
                top: `${topPosition}px`,
              }}
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
                className="notifi_list flex-grow-1"
                style={{
                  padding: "0 1rem 0.5rem",
                  overflowY: "auto",
                  minHeight: 0,
                }}
                onScroll={handleScroll}
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
                    <div ref={loadMoreSentinelRef} style={{ height: 1 }} />
                    {loadingMore && (
                      <div className="loading-indicator text-center mt-1 mb-2">
                        <div className="spinner"></div>
                        <span>Loading more notifications...</span>
                      </div>
                    )}
                    {!loadingMore && !hasMoreNotifications && notification.length > 0 && (
                      <p className="text-center mb-2" style={{ color: "#8A8A8A", fontSize: 12 }}>
                        No more notifications
                      </p>
                    )}
                  </>
                )  : loadingInitial ? (
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
          <div
            className="notification-container"
            style={{ maxHeight: "360px", overflowY: "auto" }}
            onScroll={handleScroll}
          >
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
                <div ref={loadMoreSentinelRef} style={{ height: 1 }} />
                {loadingMore && (
                  <div className="loading-indicator text-center mt-1 mb-2">
                    <div className="spinner"></div>
                    <span>Loading more notifications...</span>
                  </div>
                )}
                {!loadingMore && !hasMoreNotifications && notification.length > 0 && (
                  <p className="text-center mb-2" style={{ color: "#8A8A8A", fontSize: 12 }}>
                    No more notifications
                  </p>
                )}
              </>
            )  : loadingInitial ? (
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
