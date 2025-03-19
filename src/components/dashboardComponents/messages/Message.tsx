'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter, useSearchParams } from 'next/navigation';
import MsgSidebar from './MsgSIdebar';
import Link from 'next/link';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import defaultImg from "../../../../public/assets/images/localhost-file-not-found-480x480.avif"
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import { handleDownloadFile, getFileType } from '@/services/utils/util';
import GlobalLoader from '@/components/common/GlobalLoader/GlobalLoader';


const Message = () => {
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
    const [toSend, setToSend] = useState<string>('');
    const [sendChat, setSendChat] = useState<boolean>(false);
    const [loadingChat, setLoadingChat] = useState<boolean>(false);
    const [firstLoadingDone, setFirstLoadingDone] = useState<boolean>(false);
    const [chat, setChat] = useState<any>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [documents, setDocuments] = useState<any>([])
    const user = useSelector((state: RootState) => state.user);
    const thread = useSelector((state: RootState) => state.thread)
    const [messageLimit, setMessageLimit] = useState<number>(10);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const receiverId = user?.profile[0]?.type === 'TR'
        ? thread?.expertProfile?.id
        : thread?.task?.requesterProfileId
    const userId = user?.profile[0]?.type === 'TR'
        ? thread?.expertProfile?.userId
        : thread?.task.requesterProfile?.userId


    const [scrollPosition, setScrollPosition] = useState<number>(0);

    const getPrivateFile = async (fileUrl: any, key: any) => {
        try {
            const res = await apiCall(
                `${requests.downloadFile}?fileUrl=${fileUrl}`,
                {},
                'get',
                false,
                dispatch,
                user,
                router
            );

            if (res?.data?.presignedUrl) {
                handleDownloadFile(res?.data?.presignedUrl, key);
            }
        } catch (err) {
            console.warn('Error downloading file:', err);
        }
    };



    const fetchMessages = async () => {
        const data = {
            "threadId": Number(thread?.id),
            "limit": messageLimit,
        };
        try {
            // setLoadingChat(true)
            const response = await apiCall(requests.getMsg, data, 'get', true, dispatch, user, router);
            const orderedMessages = response?.data?.data.reverse();
            if (orderedMessages) {
                for (let i = 0; i < orderedMessages.length; i++) {
                    const documents = orderedMessages[i].documents;
                    if (documents) {
                        for (let j = 0; j < documents.length; j++) {
                            const document = documents[j];
                            const fileType = getFileType(document?.key);

                            if (fileType === 'image') {


                                await apiCall(`${requests.downloadFile}?fileUrl=${document?.fileUrl}`, {}, 'get', false, dispatch, user, router).then(res => {
                                    if (res?.data) {
                                        orderedMessages[i].documents[j].presignedUrl = res?.data?.presignedUrl;

                                    }
                                }).catch(err => console.warn(err))
                            }
                        }
                    }
                }
            }
            setChat(orderedMessages);
            setFirstLoadingDone(true)
            setSendChat(true);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        const data = {
            "senderProfileId": user?.profile?.length > 0 ? Number(user?.profile[0]?.id) : undefined,
            "receiverProfileId": Number(receiverId),
            "text": String(toSend),
            "threadId": Number(thread.id),
            "documents": documents
        };
        if (toSend != '' || documents.length > 0) {
            try {
                await apiCall(requests.sendMsg, data, 'post', true, dispatch, user, router);
                setToSend('');
                setDocuments([])
                fetchMessages();
            } catch (error) {
                console.warn("Error sending message", error);
            }
        }
    };

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop } = chatContainerRef.current;
            setScrollPosition(scrollTop);
            if (scrollTop === 0) {
                setMessageLimit((prevLimit) => prevLimit + 10);
            }
        }
    };


    useEffect(() => {
        fetchMessages();
    }, [thread, messageLimit]);

    useEffect(() => {
        if (chatEndRef.current && messageLimit <= 10) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat, messageLimit]);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [chatContainerRef.current, chat]);

    useEffect(() => {
        if (chatContainerRef.current) {
            if (scrollPosition === chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }
    }, [chat]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
            setDocuments([])
        }
    };
    useEffect(() => {
        fetchBlurDataURL();
    }, [user]);

    const fetchBlurDataURL = async () => {
        if (user?.profilePicture?.fileUrl) {
            const blurUrl = await dynamicBlurDataUrl(user?.profilePicture?.fileUrl);
            setProfileImageBlurDataURL(blurUrl);
        }
    };

    return (
        <div className='card'>
            <div className='card first-card card-header'>
                <h3 className='ms-5'>Messages</h3>
            </div>
            <div className='card-bodyy my-active-task py-2'>
                <div className='row'>
                    <div className='col-md-4'>
                        <MsgSidebar setLoadingChat={setLoadingChat} />
                    </div>
                    <div className='col-md-8'>
                        {sendChat && thread?.id ? (
                            <div className='card bg-gray mt-1 me-3 px-3 msg-main '>
                                <ChatHeader user={user} thread={thread} />
                                <div
                                    className='msg-body right-message'
                                    style={{ maxHeight: '', overflow: 'none auto' }}
                                    ref={chatContainerRef}
                                >

                                    {loadingChat ? loadingChat && <GlobalLoader />
                                        : chat?.map((message: any) => {
                                            return (
                                                <div key={message.id} className="row">
                                                    <div className={message?.senderProfileId === user?.profile[0]?.id ? 'col-6 ms-auto' : 'col-6'}>
                                                        <div className={message?.senderProfileId === user?.profile[0]?.id ? 'answer' : 'question'}>

                                                            {message?.documents?.length > 0 && 
                                                                message.documents.map((doc: any, idx:number) => {
                                                                    const fileType = (getFileType(doc?.key));

                                                                    return (
                                                                            <div className={`${fileType !== 'image' && 'text'} mb-3`} key={idx}>
                                                                                {fileType === 'image' ?

                                                                                    <ImageFallback
                                                                                        src={doc?.presignedUrl || defaultImg}
                                                                                        fallbackSrc={defaultImg}
                                                                                        alt="img"
                                                                                        className="img-fluid"
                                                                                        width={255}
                                                                                        height={255}
                                                                                        loading='lazy'
                                                                                        blurDataURL={profileImageBlurDataURL}
                                                                                    /> :
                                                                                    <div className='text-dark' onClick={() => getPrivateFile(doc?.fileUrl, doc?.key)}><Icon icon={fileType} width="48" height="48" className='me-2 text-dark' />{doc?.key}</div>}
                                                                            </div>
                                                                    );
                                                                })
                                                            }
                                                            {message?.text && <div className="text">
                                                                <p>{message?.text}</p>
                                                            </div>}
                                                            <span>{new Date(message.createdAt).toLocaleString()}</span>
                                                        </div>


                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                    <div ref={chatEndRef} />
                                </div>
                                <ChatFooter documents={documents} setDocuments={setDocuments} toSend={toSend} setToSend={setToSend} handleKeyDown={handleKeyDown} handleSend={handleSend} />
                            </div>
                        ) : ('')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
