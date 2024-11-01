'use client'
import React, { useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import MsgSIdebar from './MsgSIdebar';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter, useSearchParams } from 'next/navigation';


const Message = () => {

    const [Tosend, setToSend] = useState<string>('')
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useAppDispatch();
    const router = useRouter()
    console.log('user', user)
    const searchParams = useSearchParams();


    const threadId = searchParams.get('threadid');
    const receiverId = searchParams.get('personid');


    let data = {
        "senderProfileId": Number(user.id),
        "receiverProfileId": Number(threadId),
        "text": String(Tosend),
        "threadId":Number(threadId)
    }
    console.log('datathread',data)
    const handleSend = () => {
        const response = apiCall(requests.sendMsg, data, 'post', true, dispatch, user, router)
        console.log('response', response)

    }


    return (
        <div className='card'>
            <div className='card first-card card-header'>
                <h3>Message</h3>
            </div>
            <div className='card-bodyy my-active-task py-2 '>
                <div className='row'>
                    <div className='col-md-4'>
                        <MsgSIdebar />
                    </div>
                    <div className='col-md-8'>
                        <div className='card bg-gray mt-1 me-3 p-3 right-message'>
                            <div className="ChatHead">
                                <li className="group">
                                    <div className="avatar"><img src="imgs/Asset 1.svg" alt="" /></div>
                                    <p className="GroupName">David Johnson</p>
                                </li>
                                <div className="callGroupicon d-flex align-items-center">


                                    <div className="search-boxx ">
                                        <button className="btn-search"> <Icon className='text-info m-1' icon="weui:search-outlined" /></button>
                                        <input type="text" className="input-search" placeholder="Type to Search..." />
                                    </div>


                                    <Icon className='text-info m-1 fs-24' icon="material-symbols-light:call-outline-sharp" />
                                    <Icon className='text-info m-1 fs-24' icon="carbon:video" />
                                    <Icon className='text-info m-1 fs-24' icon="mage:dots" />

                                </div>
                            </div>
                            <div className='msg-body'>

                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='question'>
                                            <div className='text'>
                                                <p>How are You?</p>
                                            </div>
                                            <span>Today,8:30pm</span>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6 ms-auto'>
                                        <div className='answer'>
                                            <div className='text'>
                                                <p>i am fine and how are you?</p>
                                            </div>
                                            <span>Today,8:34pm</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='question'>
                                            <div className='text'>
                                                <p>I am doing well, Can we meet tomorrow?</p>
                                            </div>
                                            <span>Today,8:36pm</span>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6 ms-auto'>
                                        <div className='answer'>
                                            <div className='text'>
                                                <p>Yes Sure!</p>
                                            </div>
                                            <span>Today,8:58pm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='question'>
                                            <div className='text'>
                                                <p>I am doing well, Can we meet tomorrow?</p>
                                            </div>
                                            <span>Today,8:36pm</span>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6 ms-auto'>
                                        <div className='answer'>
                                            <div className='text'>
                                                <p>Yes Sure!</p>
                                            </div>
                                            <span>Today,8:58pm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='question'>
                                            <div className='text'>
                                                <p>I am doing well, Can we meet tomorrow?</p>
                                            </div>
                                            <span>Today,8:36pm</span>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6 ms-auto'>
                                        <div className='answer'>
                                            <div className='text'>
                                                <p>Yes Sure!</p>
                                            </div>
                                            <span>Today,8:58pm</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex mt-5'>

                                    <div className='typing-area  d-flex align-items-center w-100'>
                                        <div className="chat-area-actions d-flex align-items-center w-100">
                                            <Icon className='attach-icon' icon="fluent:attach-16-regular" />
                                            <textarea className="chat-area-input w-100 px-5 pt-2" rows={2} placeholder="Write a message" onChange={(e) => setToSend(e.target.value)}></textarea>
                                            <Icon className='send-icon' icon="bi:send" onClick={handleSend} />
                                        </div>
                                    </div>
                                    <div className='voice-icon m-2'>
                                        <Icon icon="icon-park-outline:voice" />
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message