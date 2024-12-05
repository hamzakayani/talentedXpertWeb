'use client'
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MsgSidebar from './MsgSidebar';


const Message = () => {
    const [toSend, setToSend] = useState<string>('');
    const [sendChat, setSendChat] = useState<boolean>(false);
    const [chat, setChat] = useState<any>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const user = useSelector((state: RootState) => state.user);
    const [messageLimit, setMessageLimit] = useState<number>(10);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const threadId = searchParams.get('threadid');
    const receiverId = searchParams.get('personid');

    const fetchMessages = async () => {
        const data = {
            "threadId": Number(threadId),
            "limit": messageLimit,
        };
        try {
            const response = await apiCall(requests.getMsg, data , 'get', true, dispatch, user, router);
            const orderedMessages = response?.data?.data?.reverse();
            setChat(orderedMessages);
            setSendChat(true);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        const data = {
            "senderProfileId": Number(user?.id),
            "receiverProfileId": Number(receiverId),
            "text": String(toSend),
            "threadId": Number(threadId)
        };
        try {
            await apiCall(requests.sendMsg, data, 'post', true, dispatch, user, router);
            setToSend('');
            fetchMessages();
        } catch (error) {
            console.warn("Error sending message", error);
        }
    };

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop } = chatContainerRef.current;
            if (scrollTop === 0) {
                setMessageLimit((prevLimit) => prevLimit + 10);
            }
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [threadId, messageLimit]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

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
    }, [chatContainerRef.current]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='card'>
            <div className='card first-card card-header'>
                <h3>Message</h3>
            </div>
            <div className='card-bodyy my-active-task py-2'>
                <div className='row'>
                    <div className='col-md-4'>
                        <MsgSidebar />
                    </div>
                    <div className='col-md-8'>
                        {sendChat && threadId ? (
                            <div className='card bg-gray mt-1 me-3 p-3 '>
                                <div className="ChatHead">
                                    <li className="group">
                                        <div className="avatar"><img src="imgs/Asset 1.svg" alt="" /></div>
                                        <p className="GroupName">{chat[0]?.receiverProfile?.user?.firstName} {chat[0]?.receiverProfile?.user?.lastName}</p>
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
                                    style={{  maxHeight: '400px', overflow: 'none auto' }}
                                    ref={chatContainerRef}
                                >
                                    {chat.map((message: any) => (
                                        <div key={message.id} className="row">
                                            <div className={message?.senderProfileId === user?.id ? 'col-6 ms-auto' : 'col-6'}>
                                                <div className={message?.senderProfileId === user?.id ? 'answer' : 'question'}>
                                                    <div className="text">
                                                        <p>{message.text}</p>
                                                    </div>
                                                    <span>{new Date(message.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                                <div className='d-flex mt-5'>
                                    <div className='typing-area d-flex align-items-center w-100'>
                                        <div className="chat-area-actions d-flex align-items-center w-100">
                                            <Icon className='attach-icon' icon="fluent:attach-16-regular" />
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
