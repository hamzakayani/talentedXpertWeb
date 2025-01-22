'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MsgSidebar from './MsgSIdebar';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';
import FileUpload from '@/components/common/upload/FileUpload';
import Link from 'next/link';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import defaultImg from "../../../../public/assets/images/localhost-file-not-found-480x480.avif"


const Message = () => {
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
    const [toSend, setToSend] = useState<string>('');
    const [sendChat, setSendChat] = useState<boolean>(false);
    const [chat, setChat] = useState<any>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [documents, setDocuments] = useState<any>([])
    const [recieverDetail, setRecieverDetail] = useState<any>([])

    const user = useSelector((state: RootState) => state.user);
    const thread = useSelector((state: RootState) => state.thread)
    const [messageLimit, setMessageLimit] = useState<number>(10);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const receiverId = user?.profile[0].type === 'TR'
        ? thread?.expertProfile?.id
        : thread?.task?.requesterProfileId
    const userId = user?.profile[0].type === 'TR'
        ? thread?.expertProfile?.userId
        : thread?.task.requesterProfile?.userId
    // console.log('thread', thread)

    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const getUserDetail = async () => {
        try {
            const response = await apiCall(requests.getUserInfo + userId, {}, 'get', false, dispatch, user, router);
            // console.log('detail', response)
            setRecieverDetail(response?.data);
            // response?.data?.threads?.length > 0 ? router.push(
            //     `/dashboard/messages/?threadid=${response?.data?.threads[0].id}&personid=${response?.data?.threads[0].expertProfile.id}`
            // ) : null
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMessages = async () => {
        const data = {
            "threadId": Number(thread?.id),
            "limit": messageLimit,
        };
        try {
            const response = await apiCall(requests.getMsg, data, 'get', true, dispatch, user, router);
            const orderedMessages = response?.data?.data.reverse();
            setChat(orderedMessages);
            setSendChat(true);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };


    const getFileType = (fileName: string) => {

        if (!fileName || typeof fileName !== 'string') {
            return "Invalid file name";
        }

        const parts = fileName.split('.');
        const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
        // console.log('extension', extension)

        const fileTypes = {
            image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'],
            pdf: ['pdf'],
            document: ['doc', 'docx', 'txt', 'odt', 'rtf'],
            spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
            presentation: ['ppt', 'pptx', 'odp'],
            video: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'],
            audio: ['mp3', 'wav', 'aac', 'flac', 'ogg'],
            archive: ['zip', 'rar', '7z', 'tar', 'gz'],
            code: ['html', 'css', 'js', 'ts', 'json', 'xml', 'py', 'java', 'cpp', 'c'],
        };


        for (const [type, extension] of Object.entries(fileTypes)) {
            if (extension.includes(String(extension))) {
                return type;
            }
        }
        return "file";
    }
    useEffect(() => {
        console.log(getFileType('dp.png'))

    }, [])


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
    const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
        const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, false) : 0
        const temp: any = [...documents, ...uploadedFileIds];
        setDocuments(temp)

        return uploadedFileIds;

    }

    useEffect(() => {
        getUserDetail();
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
                        <MsgSidebar />
                    </div>
                    <div className='col-md-8'>
                        {sendChat && thread?.id ? (
                            <div className='card bg-gray mt-1 me-3 px-3 msg-main '>
                                <div className="ChatHead">
                                    <li className="group">
                                        <div className="avatar"><img src="imgs/Asset 1.svg" alt="" /></div>
                                        <p className="GroupName text-white mb-0">{user?.profile[0]?.type === 'TR' ? thread?.expertProfile?.user?.firstName : thread?.task?.requesterProfile?.user?.firstName} {user?.profile[0].type === 'TR' ? thread?.expertProfile?.user?.lastName : thread?.task?.requesterProfile?.user?.lastName}</p>
                                        {/* {recieverDetail?.firstName} {recieverDetail?.lastName} */}
                                    </li>
                                    <div className="callGroupicon d-flex align-items-center">
                                        <div className="search-boxx">
                                            <button className="btn-search">
                                                <Icon className='text-info m-1' icon="weui:search-outlined" />
                                            </button>
                                            <input type="text" className="input-search" placeholder="Type to Search..." />
                                        </div>
                                        <Icon className='text-info m-1 fs-24' icon="material-symbols-light:call-outline-sharp" />
                                        <Icon className='text-info m-1 fs-24' icon="carbon:video" />
                                        <Icon className='text-info m-1 fs-24' icon="mage:dots" />
                                    </div>
                                </div>
                                <div
                                    className='msg-body right-message'
                                    style={{ maxHeight: '400px', overflow: 'none auto' }}
                                    ref={chatContainerRef}
                                >
                                    {chat?.map((message: any) => {
                                        return (
                                            <div key={message.id} className="row">
                                                <div className={message?.senderProfileId === user?.profile[0]?.id ? 'col-6 ms-auto' : 'col-6'}>
                                                    <div className={message?.senderProfileId === user?.profile[0]?.id ? 'answer' : 'question'}>
                                                        <div className="text">
                                                            <p>{message?.text} </p>
                                                            {message?.documents?.length > 0 && <div>
                                                                {message.documents.map((doc: any) => {
                                                                    const fileType = getFileType(doc?.key);
                                                                    return (

                                                                        <>
                                                                            {fileType === 'image' ?
                                                                                <ImageFallback
                                                                                    src={doc.fileUrl || defaultImg}
                                                                                    alt="img"
                                                                                    className="img-fluid mb-3"
                                                                                    width={255}
                                                                                    height={255}
                                                                                    loading='lazy'
                                                                                    blurDataURL={profileImageBlurDataURL}
                                                                                />
                                                                                : <Link href={doc?.fileUrl} target='_blank'>
                                                                                    {doc?.key}
                                                                                </Link>}
                                                                        </>
                                                                    );
                                                                })}
                                                            </div>}
                                                        </div>
                                                        <span>{new Date(message.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={chatEndRef} />
                                </div>
                                <div className='d-flex mt-5'>
                                    <div className='typing-area d-flex align-items-center w-100'>
                                        <div className="chat-area-actions d-flex align-items-center w-100">
                                            {/* <Icon className='attach-icon' icon="fluent:attach-16-regular"/> */}
                                            <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="msg" />

                                            {documents?.length > 0 && documents.map((doc: any) => (
                                                <Link className={'file'} href={doc?.fileUrl} target='_blank'>
                                                    {doc?.key}
                                                </Link>))}

                                            <textarea
                                                className="chat-area-input w-100 px-5 pt-2"
                                                rows={2}
                                                placeholder="Write a message"
                                                value={toSend}
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => setToSend(e.target.value)}

                                            />
                                            <Icon className='send-icon' icon="bi:send" onClick={handleSend} />

                                        </div>
                                    </div>
                                    <div className='voice-icon m-2'>
                                        <Icon icon="icon-park-outline:voice" />
                                    </div>
                                </div>
                            </div>
                        ) : ('')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
