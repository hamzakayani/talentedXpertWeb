'use client'
import React, { useEffect, useState } from 'react';
import ImageFallback from '../../common/ImageFallback/ImageFallback';
import { Icon } from '@iconify/react/dist/iconify.js';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { setThread } from '@/reducers/ThreadSlice';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import NoFound from '@/components/common/NoFound/NoFound';
import Image from 'next/image';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import defaultUserImg from "../../../../public/assets/images/default-user.jpg";

const MsgSidebar = ({setLoadingChat}:any) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const thread = useSelector((state: RootState) => state.thread);
    const [threads, setThreads] = useState<any[]>([]);
    const [activeThread, setActiveThread] = useState<string | null>(null);

    const getThreads = async () => {
        try {
            const response = await apiCall(requests.getThread, {}, 'get', false, dispatch, user, router);
            setThreads(response?.data?.threads || []);
        } catch (error) {
            console.warn("Error fetching threads:", error);
        }
    };

    useEffect(() => {
        if(thread){
        setActiveThread(thread?.id); 
        }
        else{
        setActiveThread(threads[0]?.id); 
        dispatch(setThread(threads[0]))

        }
    }, [thread, threads]);


    useEffect(() => {
        getThreads();
    }, []);

    const handleThreadClick = (thread: any) => {
        
        dispatch(setThread(thread));
        setActiveThread(thread?.id); 
        setLoadingChat(true)
        setTimeout(() => {
            setLoadingChat(false)
           
        }, 1200)
    };

    return (
        <div className="card bg-gray mt-1 ms-3 p-3 chat-left-card">
            <div className="searchBar">
                <form className="search-container">
                    <input type="text" className="text-light" id="search-bar" placeholder="Search here" />
                    <a href="#"> <Icon className="search-icon" icon="clarity:search-line" /> </a>
                </form>
            </div>
            <div className="chat-member"> 
                <ul>
                    {threads.length > 0 ? threads.map((thread: any) => {
                        const isActive = thread?.id === activeThread;
                        return (
                            <li
                                className={`chat-list group d-flex bordr ${isActive ? 'active' : ''}`}
                                key={thread?.id}
                                onClick={() => handleThreadClick(thread)}
                            >
                                <div className="avatar">
                                    <ImageFallback
                                        src={(thread?.expertProfile?.userId === user?.id
                                            ? thread?.task?.requesterProfile?.user?.profilePicture?.fileUrl
                                            : thread?.expertProfile?.user?.profilePicture?.fileUrl)}
                                        fallbackSrc={defaultUserImg}
                                        alt="img"
                                        className="user-img img-round"
                                        width={40}
                                        height={40}
                                        userName={thread?.expertProfile?.user ? `${thread?.expertProfile?.user?.firstName} ${thread?.expertProfile?.user?.lastName}` : null}

                                    />
                                </div>
                                <div className="namedescription">
                                    <HtmlData
                                        data={
                                            thread?.expertProfile?.userId === user?.id
                                                ? `${thread?.task?.requesterProfile?.user?.firstName} ${thread?.task?.requesterProfile?.user?.lastName}`
                                                : `${thread?.expertProfile?.user?.firstName} ${thread?.expertProfile?.user?.lastName}`
                                        }
                                        className="GroupName text-white"
                                    />
                                    <p className="GroupDescrp text-white">{thread?.task?.name}</p>
                                </div>
                                <div className="progres">
                                    <p className="w-s mt-2">In Progress</p>
                                </div>
                            </li>
                        );
                    }) : (
                        <NoFound />
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MsgSidebar;
