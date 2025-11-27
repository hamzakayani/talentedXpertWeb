"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/Store";
import { useRouter } from "next/navigation";
import MsgSidebar from "./MsgSIdebar";
import Link from "next/link";
import ImageFallback from "@/components/common/ImageFallback/ImageFallback";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";
import defaultImg from "../../../../public/assets/images/localhost-file-not-found-480x480.avif";
import dynamic from "next/dynamic";
import ChatFooter from "./ChatFooter";

import useSocket from "@/hooks/useSocket";
import { handleDownloadFile, getFileType } from "@/services/utils/util";
import { useFetchDashboardData } from "@/hooks/dashboard/useDashboard";

const ChatHeader = dynamic(() => import("./ChatHeader"), { ssr: false });

// TypeScript interfaces
interface Thread {
  id: number;
  expertProfile?: {
    id: number;
    userId: number;
    user?: {
      firstName: string;
      lastName: string;
      profilePicture?: { fileUrl: string };
    };
  };
  task?: {
    requesterProfileId: number;
    requesterProfile?: { user?: { profilePicture?: { fileUrl: string } } };
  };
}

interface Message {
  id: string | number;
  senderProfileId: number;
  text?: string;
  documents?: Document[];
  createdAt: string;
  metadata?: any;
  senderUser?: any;
  type?: string;
  isRead?: boolean;
}

interface Document {
  key: string;
  fileUrl: string;
  presignedUrl?: string;
}

interface MsgSidebarProps {
  setLoadingChat: React.Dispatch<React.SetStateAction<boolean>>;
  getThreads: () => Promise<void>;
  threads: Thread[];
}

interface ChatFooterProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  toSend: string;
  setToSend: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => Promise<void>;
}

const Message = () => {
  const [profileImageBlurDataURL, setProfileImageBlurDataURL] =
    useState<string>("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [toSend, setToSend] = useState<string>("");
  const [sendChat, setSendChat] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [chat, setChat] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messageLimit, setMessageLimit] = useState<number>(10);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user);
  const thread = useSelector((state: RootState) => state.thread) as
    | Thread
    | undefined;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { socket } = useSocket();

  const receiverId =
    user?.profile?.[0]?.type === "TR"
      ? thread?.expertProfile?.id
      : thread?.task?.requesterProfileId;

  const { refetch: refetchDashboard } = useFetchDashboardData({
    enabled: !!user?.id,
  });

  // Fetch blur data URL for profile image
  useEffect(() => {
    const fetchBlurDataURL = async () => {
      if (user?.profilePicture?.fileUrl) {
        try {
          const blurUrl = await dynamicBlurDataUrl(user.profilePicture.fileUrl);
          setProfileImageBlurDataURL(blurUrl);
        } catch (error) {
          console.warn("Error fetching blur data URL:", error);
        }
      }
    };
    fetchBlurDataURL();
  }, [user?.profilePicture?.fileUrl]);

  // Fetch threads
  const getThreads = useCallback(async () => {
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
      setThreads((response?.data?.threads || []) as Thread[]);
    } catch (error) {
      console.warn("Error fetching threads:", error);
      setThreads([]);
    }
  }, [dispatch, user, router]);

  // Fetch messages (initial load) - optimized for smooth UX
  const fetchMessages = useCallback(async () => {
    if (!thread?.id) {
      setChat([]);
      setSendChat(false);
      return;
    }

    setLoadingChat(true);
    try {
      const response = await apiCall(
        requests.getMsg,
        { threadId: Number(thread.id), limit: messageLimit },
        "get",
        true,
        dispatch,
        user,
        router
      );
      const orderedMessages = (response?.data?.data?.reverse() ||
        []) as Message[];

      // Process documents in parallel for better performance
      const documentPromises = orderedMessages.flatMap(
        (message) =>
          message.documents?.map(async (doc) => {
            if (getFileType(doc.key) === "image") {
              try {
                const res = await apiCall(
                  `${requests.downloadFile}?fileUrl=${doc.fileUrl}`,
                  {},
                  "get",
                  false,
                  dispatch,
                  user,
                  router
                );
                if (res?.data?.presignedUrl) {
                  doc.presignedUrl = res.data.presignedUrl;
                }
              } catch (err) {
                console.warn("Error fetching presigned URL:", err);
              }
            }
            return doc;
          }) || []
      );

      await Promise.all(documentPromises);

      setChat(orderedMessages);
      setSendChat(true);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setChat([]);
    } finally {
      setLoadingChat(false);
    }
  }, [thread?.id, messageLimit, dispatch, user, router]);

  // Load more previous messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!thread?.id || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      // Increase the limit first, then fetch with new limit
      const newLimit = messageLimit + 10;
      setMessageLimit(newLimit);

      const response = await apiCall(
        requests.getMsg,
        { threadId: Number(thread.id), limit: newLimit },
        "get",
        true,
        dispatch,
        user,
        router
      );
      const allMessages = (response?.data?.data?.reverse() || []) as Message[];

      // Process documents in parallel for better performance
      const documentPromises = allMessages.flatMap(
        (message) =>
          message.documents?.map(async (doc) => {
            if (getFileType(doc.key) === "image") {
              try {
                const res = await apiCall(
                  `${requests.downloadFile}?fileUrl=${doc.fileUrl}`,
                  {},
                  "get",
                  false,
                  dispatch,
                  user,
                  router
                );
                if (res?.data?.presignedUrl) {
                  doc.presignedUrl = res.data.presignedUrl;
                }
              } catch (err) {
                console.warn("Error fetching presigned URL:", err);
              }
            }
            return doc;
          }) || []
      );

      await Promise.all(documentPromises);

      // Replace the entire chat with all messages (including previous ones)
      setChat(allMessages);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [thread?.id, messageLimit, dispatch, user, router, isLoadingMore]);

  // Handle scroll to load more messages
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      // Load more when user scrolls to the very top
      if (scrollTop === 0 && !loadingChat && !isLoadingMore) {
        loadMoreMessages();
      }
    }
  }, [loadingChat, isLoadingMore, loadMoreMessages]); // Download private file
  const getPrivateFile = useCallback(
    async (fileUrl: string, key: string) => {
      if (!fileUrl || !key) {
        console.warn("Invalid fileUrl or key for download");
        return;
      }
      try {
        const res = await apiCall(
          `${requests.downloadFile}?fileUrl=${fileUrl}`,
          {},
          "get",
          false,
          dispatch,
          user,
          router
        );
        if (res?.data?.presignedUrl) {
          handleDownloadFile(res.data.presignedUrl, key);
        }
      } catch (err) {
        console.warn("Error downloading file:", err);
      }
    },
    [dispatch, user, router]
  );

  // Handle sending a message
  const handleSend = useCallback(async () => {
    if (!toSend && documents.length === 0) return;
    if (!thread?.id || !user?.profile?.[0]?.id) return;
    const data = {
      senderProfileId: Number(user.profile[0].id),
      receiverProfileId: Number(receiverId),
      text: toSend?.includes("/meeting/")
        ? `🎥 Join the video call: Meeting ID: ${
            toSend.split("/").pop()?.split("?")[0]
          }`
        : toSend,
      threadId: Number(thread.id),
      documents,
      messageType: "USER",
    };
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}-${Math.random()}`, // Unique temp ID
      senderProfileId: Number(user.profile[0].id),
      text: toSend?.includes("/meeting/")
        ? `🎥 Join the video call: Meeting ID: ${
            toSend.split("/").pop()?.split("?")[0]
          }`
        : toSend,
      documents: documents.map((doc) => ({ ...doc, presignedUrl: undefined })), // No presignedUrl yet
      createdAt: new Date().toISOString(),
    };
    try {
      setChat((prev) => [...prev, optimisticMessage]);
      setLastSentMessageId(optimisticMessage.id as string); // Track sent message for auto-scroll
      setToSend("");
      setDocuments([]);
      if (!socket?.connected) {
        console.warn("Socket not connected, attempting to reconnect...");
        await new Promise((resolve: any) => socket?.once("connect", resolve));
      }
      socket?.emit("newMessage", data);
      await getThreads();
    } catch (error) {
      console.warn("Error sending message:", error);
      setChat((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
    }
  }, [
    toSend,
    documents,
    user?.profile,
    receiverId,
    thread?.id,
    socket,
    getThreads,
  ]);

  const sentMeetingLink = async (link: string) => {
    if (!thread?.id || !user?.profile?.[0]?.id) return;
    const data = {
      senderProfileId: Number(user.profile[0].id),
      receiverProfileId: Number(receiverId),
      text: `🎥 Join the video call: Meeting ID: ${
        link.split("/").pop()?.split("?")[0]
      }`,
      threadId: Number(thread.id),
      documents,
      messageType: "USER",
    };
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}-${Math.random()}`, // Unique temp ID
      senderProfileId: Number(user.profile[0].id),
      text: `🎥 Join the video call: Meeting ID: ${
        link.split("/").pop()?.split("?")[0]
      }`,
      documents: documents.map((doc) => ({ ...doc, presignedUrl: undefined })), // No presignedUrl yet
      createdAt: new Date().toISOString(),
    };
    setChat((prev) => [...prev, optimisticMessage]);
    setLastSentMessageId(optimisticMessage.id as string);

    socket?.emit("newMessage", data);
    await getThreads();
  };

  // Socket event listener
  useEffect(() => {
    if (!socket || !thread?.id) return;
    const messageHandler = (message: Message) => {
      if (
        message.metadata?.threadId === thread.id &&
        message.senderProfileId !== user?.profile?.[0]?.id
      ) {
        fetchMessages(); // Only fetch for non-user messages
      }
      if (message?.metadata?.threadId !== thread.id) {
        getThreads();
      }

      // If it's a message, update dashboard stats
      if (message?.type === "MESSAGE") {
        refetchDashboard(); // fetch updated unread message count
      }
    };
    socket.on("message", messageHandler);
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      socket.off("message", messageHandler);
    };
  }, [socket, thread?.id, user?.profile, fetchMessages, getThreads]);

  useEffect(() => {
    // Check if we have a valid socket and thread ID
    if (socket && thread?.id && chat?.length) {
      // Find the first unread message in the thread (if any)
      const unreadMessage = chat.find((message) => !message.isRead);

      // If there's an unread message, emit the markMessageAsRead event
      if (unreadMessage) {
        socket.emit("markMessageAsRead", { messageId: unreadMessage.id });
        refetchDashboard(); // fetch updated unread message count
      }
    }
  }, [socket, thread?.id, chat]); // Dependency array checks for changes in the thread or its messages

  // Fetch messages on mount or when thread changes
  useEffect(() => {
    if (isAuth && thread?.id) {
      setMessageLimit(10); // Reset to initial limit for new thread
      fetchMessages();
    }
  }, [isAuth, thread?.id, fetchMessages]);

  // Fetch threads on mount
  useEffect(() => {
    if (isAuth) {
      getThreads();
    }
  }, [isAuth, getThreads]);

  // Add scroll event listener for pagination
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]); // Auto-scroll to bottom ONLY when user sends a new message
  const [lastSentMessageId, setLastSentMessageId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (chatEndRef.current && lastSentMessageId && chat.length > 0) {
      // Only scroll if the last message was sent by the current user
      const lastMessage = chat[chat.length - 1];
      if (lastMessage && lastMessage.id === lastSentMessageId) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        setLastSentMessageId(null); // Reset after scrolling
      }
    }
  }, [chat, lastSentMessageId]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (chat.length === 0 || !chatEndRef.current) return;

    const timeout = setTimeout(() => scrollToBottom("instant"), 200);
    return () => clearTimeout(timeout);
  }, [thread?.id]);

  useEffect(() => {
    if (chat.length === 0 || !chatEndRef.current) return;

    const timeout = setTimeout(() => scrollToBottom("smooth"), 200);
    return () => clearTimeout(timeout);
  }, [chat.length]);

  // Handle Enter key for sending messages
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // Message rendering component
  const MessageItem = ({ message }: { message: Message }) => {
    const isSender = message.senderProfileId === user?.profile?.[0]?.id;
    return (
      <div style={{ paddingRight: "10px" }} key={message.id} className="row">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: isSender ? "flex-end" : "flex-start",
          }}
          className={isSender ? "col-6 ms-auto" : "col-6"}
        >
          <div
            style={{ width: "80%" }}
            className={isSender ? "answer" : "question"}
          >
            {message.documents?.map((doc, idx) => {
              const fileType = getFileType(doc.key);
              return (
                <div
                  className={`${fileType !== "image" && "text"} mb-3`}
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                    padding: "5px",
                    cursor: fileType !== "text" ? "pointer" : "default",
                  }}
                  onClick={
                    fileType !== "image"
                      ? () => getPrivateFile(doc.fileUrl, doc.key)
                      : undefined
                  }
                >
                  {!isSender && (
                    <div className="avatar me-2">
                      <ImageFallback
                        src={
                          message?.senderUser
                            ? message?.senderUser?.profilePicture?.fileUrl
                            : thread?.expertProfile?.userId === user?.id
                            ? thread?.task?.requesterProfile?.user
                                ?.profilePicture?.fileUrl
                            : thread?.expertProfile?.user?.profilePicture
                                ?.fileUrl
                        }
                        alt="img"
                        className="user-img img-round"
                        width={40}
                        height={40}
                        userName={
                          message?.senderUser
                            ? `${message?.senderUser?.firstName} ${message?.senderUser?.lastName}`
                            : thread?.expertProfile?.user
                            ? `${thread.expertProfile.user.firstName} ${thread.expertProfile.user.lastName}`
                            : undefined
                        }
                      />
                    </div>
                  )}
                  {fileType === "image" && doc.presignedUrl ? (
                    <Link
                      href={doc.presignedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ImageFallback
                        src={doc.presignedUrl}
                        fallbackSrc={defaultImg}
                        alt="img"
                        className="img-fluid"
                        width={255}
                        height={255}
                        loading="lazy"
                        blurDataURL={profileImageBlurDataURL}
                      />
                    </Link>
                  ) : (
                    <div
                      style={{
                        width: "fit-content",
                        color: "#ffffff",
                        background: isSender
                          ? "linear-gradient(135deg, #00BBFF, #5947FF)"
                          : "#000000",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        display: "inline-block",
                      }}
                      className="text-dark"
                    >
                      <Icon
                        icon={fileType}
                        width={48}
                        height={48}
                        className="me-2"
                        style={{ color: "#ffffff" }}
                      />
                      <span style={{ color: "#ffffff" }}>{doc.key}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {message.text && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: isSender ? "flex-end" : "flex-start",
                }}
              >
                {!isSender && (
                  <div className="avatar me-2">
                    <ImageFallback
                      src={
                        message?.senderUser
                          ? message?.senderUser?.profilePicture?.fileUrl
                          : thread?.expertProfile?.userId === user?.id
                          ? thread?.task?.requesterProfile?.user?.profilePicture
                              ?.fileUrl
                          : thread?.expertProfile?.user?.profilePicture?.fileUrl
                      }
                      alt="img"
                      className="user-img img-round"
                      width={40}
                      height={40}
                      userName={
                        message?.senderUser
                          ? `${message?.senderUser?.firstName} ${message?.senderUser?.lastName}`
                          : thread?.expertProfile?.user
                          ? `${thread.expertProfile.user.firstName} ${thread.expertProfile.user.lastName}`
                          : undefined
                      }
                    />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "80%",
                    background: isSender
                      ? "linear-gradient(135deg, #00BBFF, #5947FF) !important"
                      : "#000000",
                  }}
                  className="text"
                >
                  <p
                    style={{
                      width: "100%",
                      color: "#ffffff",
                      margin: 0,
                      background: isSender
                        ? "linear-gradient(135deg, #00BBFF, #5947FF)"
                        : "#000000",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      display: "inline-block",
                    }}
                  >
                    {message.text
                      ?.split(/(https?:\/\/[^\s]+)/)
                      .map((part, index) => {
                        // More robust URL detection regex - handles URLs with or without leading characters
                        if (part.match(/^https?:\/\/[^\s]+$/)) {
                          console.log("Link detected:", part); // Debug log
                          console.log("Rendering link element for:", part); // Additional debug
                          return (
                            <a
                              key={index}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                wordBreak: "break-all",
                                color: "#ffffff",
                                textDecoration: "underline",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(part, "_blank");
                              }}
                            >
                              {part}
                            </a>
                          );
                        }
                        // Handle cases where URL might have characters before it (like @)
                        if (
                          part.includes("https://") ||
                          part.includes("http://")
                        ) {
                          const urlMatch = part.match(/(https?:\/\/[^\s]+)/);
                          if (urlMatch) {
                            const url = urlMatch[0];
                            const beforeUrl = part.substring(
                              0,
                              part.indexOf(url)
                            );
                            const afterUrl = part.substring(
                              part.indexOf(url) + url.length
                            );
                            console.log(
                              "Link detected with prefix:",
                              url,
                              "Prefix:",
                              beforeUrl
                            );
                            return (
                              <span key={index}>
                                {beforeUrl}
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    wordBreak: "break-all",
                                    color: "#ffffff",
                                    textDecoration: "underline",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(url, "_blank");
                                  }}
                                >
                                  {url}
                                </a>
                                {afterUrl}
                              </span>
                            );
                          }
                        }
                        return part;
                      })}
                  </p>
                </div>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: isSender ? "flex-end" : "flex-start",
                padding: "5px",
              }}
            >
              <span
                style={{ color: "#ffffff", fontSize: "12px", opacity: 0.8 }}
              >
                {new Date(message.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="card border-0 message_card"
      style={{ backgroundColor: "#141414" }}
    >
      <div className="card-bodyy my-active-task position-relative ml-0">
        <div className="row">
          <div className="col-md-4 p-0">
            <div style={{ height: "600px" }}>
              <MsgSidebar
                setLoadingChat={setLoadingChat}
                getThreads={getThreads}
                threads={threads}
              />
            </div>
          </div>
          <div className="col-md-8 ml-3">
            {sendChat && thread?.id ? (
              <div
                className="card rounded-4 border-radius-0 bg-transparent px-3 msg-main d-flex flex-column"
                style={{ height: "600px" }}
              >
                <ChatHeader
                  user={user}
                  thread={thread}
                  sentMeetingLink={sentMeetingLink}
                />
                <div
                  className="msg-body right-message flex-grow-1 hide-scrollbar"
                  style={{
                    overflowY: "auto",
                    minHeight: "0",
                    scrollbarWidth: "none" /* Firefox */,
                    msOverflowStyle: "none" /* IE and Edge */,
                  }}
                  ref={chatContainerRef}
                >
                  {/* Single loading indicator */}
                  {(loadingChat || isLoadingMore) && (
                    <div className="text-center py-3">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          {loadingChat
                            ? "Loading..."
                            : "Loading more messages..."}
                        </span>
                      </div>
                    </div>
                  )}

                  {chat.length > 0 ? (
                    chat.map((message) => (
                      <MessageItem key={message.id} message={message} />
                    ))
                  ) : !loadingChat ? (
                    <p className="text-center mt-3">No messages yet</p>
                  ) : null}
                  <div ref={chatEndRef} />
                </div>

                {/* ChatFooter - always fixed at bottom */}
                <div className="chat-footer mt-auto">
                  <ChatFooter
                    documents={documents}
                    setDocuments={setDocuments}
                    toSend={toSend}
                    setToSend={setToSend}
                    handleKeyDown={handleKeyDown}
                    handleSend={handleSend}
                  />
                </div>
              </div>
            ) : (
              <div
                className="card bg-gray mt-1 me-3 px-3 msg-main text-white border-0 d-flex justify-content-center align-items-center"
                style={{ height: "600px" }}
              >
                {/* Check if threads exist but none selected */}
                {threads.length > 0 ? (
                  <p className="text-center mt-3">
                    Select a thread to start chatting
                  </p>
                ) : (
                  <p className="text-center mt-3">
                    No threads available. Please create or select a thread to
                    start chatting.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
