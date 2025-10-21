"use client";
import React, { useEffect, useState } from "react";
import ImageFallback from "../../common/ImageFallback/ImageFallback";
import { Icon } from "@iconify/react/dist/iconify.js";
import { RootState, useAppDispatch } from "@/store/Store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { setThread } from "@/reducers/ThreadSlice";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import NoFound from "@/components/common/NoFound/NoFound";
import Image from "next/image";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import defaultUserImg from "../../../../public/assets/images/default-user.jpg";
import useSocket from "@/hooks/useSocket";
import insurance from "../../../../public/insurance.png";
import SearchFilter from "../SearchFilter/SearchFilter";
const MsgSidebar = ({ setLoadingChat, getThreads, threads }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const thread = useSelector((state: RootState) => state.thread);
  // const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (thread) {
      setActiveThread(thread?.id);
    } else {
      setActiveThread(threads[0]?.id);
      dispatch(setThread(threads[0]));
    }
  }, [thread, threads]);

  useEffect(() => {
    if (socket) {
      const notificationHandler = (notification: any) => {
        getThreads();
      };

      socket.on("notification", notificationHandler);

      // return () => {
      //   socket.off("notification", notificationHandler);
      // };
    }
  }, [socket]);

  const [threadSearch, setThreadSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoted, setPromoted] = useState(false);
  const [disability, setDisability] = useState(false);

  useEffect(() => {
    getThreads();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      // Hook up to filter threads if backend supports; for now, client-side filter trigger
      // Could pass search to getThreads if it accepts a parameter
      // getThreads(threadSearch)
    }, 600);
    return () => window.clearTimeout(t);
  }, [threadSearch]);

  const handleThreadClick = (thread: any) => {
    dispatch(setThread(thread));
    setActiveThread(thread?.id);
    setLoadingChat(true);
    setTimeout(() => {
      setLoadingChat(false);
    }, 1200);
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "POSTED":
        return "text-bg-primary";
      case "INPROGRESS":
        return "text-bg-warning";
      case "COMPLETED":
        return "text-bg-success";
      case "CLOSED":
        return "text-bg-danger";
      case "TASK":
        return "text-bg-info";
      case "TEAM":
        return "text-bg-purple";
      default:
        return "text-bg-secondary";
    }
  };

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "POSTED":
        return { 
          backgroundColor: '#4dabf7', 
          color: 'white', 
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px'
        };
      case "INPROGRESS":
        return { 
          backgroundColor: '#ffd43b', 
          color: '#000', 
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px'
        };
      case "COMPLETED":
        return { 
          backgroundColor: '#51cf66', 
          color: 'white', 
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px'
        };
      case "CLOSED":
        return { 
          backgroundColor: '#ff6b6b', 
          color: 'white', 
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px'
        };
      case "TASK":
        return { 
          backgroundColor: '#66d9e8', 
          color: 'white', 
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px'
        };
      case "TEAM":
        return { 
          backgroundColor: '#9775fa', 
          color: 'white', 
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px'
        };
      default:
        return { 
          backgroundColor: '#adb5bd', 
          color: 'white', 
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 8px',
          borderRadius: '12px'
        };
    }
  };

  return (
    <div
      className="card bg-gray chat-left-card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div style={{ margin: '20px 12px', }}>
        <SearchFilter
          title="Search Messages"
          onSearch={(q) => setSearchQuery(q)}
          hideFilters={true}
          placeholder="Search messages"
        />
         <div
         className="text-center text-white rounded p-2 w-100"
         style={{
          marginBottom: '12px',
          marginTop: '-5px',
          fontWeight: "lighter",
          // backgroundColor: "black",
          background: 'linear-gradient(135deg, #00BBFF, #5947FF)',
          display: "flex",
          flexDirection: "row", // Ensure the icon and text are in a row
          alignItems: "center", // Center them vertically
          justifyContent: "center", // Center them horizontally
          gap: "10px", // Space between the icon and the text
        }}
      >
        <Icon
          style={{
            color: "white", // or 'black' depending on background
            fontSize: "30px",
          }}
          icon="mdi:shield-check-outline"
          className="me-2 text-white"
          width="40"
          height="30"
        />
        <p
          style={{
            color: "white",
            fontSize: "12px",
            textAlign: "left",
            margin: "0",
          }}
        >
          The messages are monitored by admin for full transparency and privacy
          purposes
        </p>
        </div>
        <div className="chat-member" style={{ width: '100%', }}>
          <ul style={{ padding: '0', margin: '0', listStyle: 'none', width: '100%' }}>
            {threads.length > 0 ? (
              threads.map((thread: any) => {
                const isActive = thread?.id === activeThread;
                return (
                  <li
                    className={`chat-list group d-flex bordr ${isActive ? "active" : ""
                      }`}
                    key={thread?.id}
                    onClick={() => handleThreadClick(thread)}
                    style={{
                      width: '100%',
                      borderBottom: '1px solid #333',
                      paddingTop: '12px',
                      margin: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div className="avatar">
                      <ImageFallback
                        src={
                          thread?.expertProfile?.userId === user?.id
                            ? thread?.task?.requesterProfile?.user
                              ?.profilePicture?.fileUrl
                            : thread?.expertProfile?.user?.profilePicture
                              ?.fileUrl
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
                    <div className="namedescription">
                      <HtmlData
                        data={
                          thread?.expertProfile?.userId === user?.id
                            ? (thread?.task?.requesterProfile?.user?.firstName && thread?.task?.requesterProfile?.user?.lastName
                              ? `${thread?.task?.requesterProfile?.user?.firstName} ${thread?.task?.requesterProfile?.user?.lastName}`
                              : thread?.team?.name)
                            : (thread?.expertProfile?.user?.firstName && thread?.expertProfile?.user?.lastName
                              ? `${thread?.expertProfile?.user?.firstName} ${thread?.expertProfile?.user?.lastName}`
                              : thread?.team?.name)
                        }
                        className="GroupName text-white"
                        style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}
                      />
                      <p 
                        className="GroupDescrp text-white"
                        style={{ fontSize: '12px', fontWeight: '400', opacity: '0.8', margin: '0' }}
                      >
                        {thread?.task?.name}
                      </p>
                    </div>
                    <div className="progres">
                      <span 
                        className="mt-2"
                        style={getStatusStyle(thread?.task?.status || thread?.threadType)}
                      >
                        {thread?.task?.status || thread?.threadType}
                      </span>
                    </div>
                  </li>
                );
              })
            ) : (
              <NoFound />
            )}
          </ul>
        </div>
      </div>
     
    </div>
  );
};

export default MsgSidebar;
