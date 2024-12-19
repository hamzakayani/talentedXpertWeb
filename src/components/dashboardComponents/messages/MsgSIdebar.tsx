'use client'
import React, { useEffect, useState } from 'react'
import ImageFallback from '../../common/ImageFallback/ImageFallback'
import { Icon } from '@iconify/react/dist/iconify.js'
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { setThread } from '@/reducers/ThreadSlice';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import NoFound from '@/components/common/NoFound/NoFound';
import Image from 'next/image';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import defaultUserImg from "../../../../public/assets/images/default-user.jpg"

const MsgSidebar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const user = useSelector((state: RootState) => state.user)
    const [threads, setThreads] = useState<any>([])

    const getthreads = async () => {
        try {
            const response = await apiCall(requests.getThread, {}, 'get', false, dispatch, user, router);
            setThreads(response?.data?.threads || []);
                // `/dashboard/message/?threadid=${response?.data?.threads[0].id}&personid=${response?.data?.threads[0].expertProfile.id}`
            // response?.data?.threads?.length > 0 ? router.push(
            //     `/dashboard/message/${response?.data?.threads[0].id}`
            // ) : null
        } catch (error) {
            console.warn("Error fetching tasks:", error);
        }
    }

    useEffect(() => {
        getthreads();
    }, [])

    const threadClick = (thread: any) => {
        dispatch(setThread(thread))
        // console.log(user?.profile[0]?.type, thread.expertProfile.id, thread.task.requesterProfileId)
        router.push(
            `/dashboard/message/${thread.id}`
        );

        `${thread.expertProfile.id}/${thread.expertProfile.userId}`

    }

    return (
        <div className='card bg-gray mt-1 ms-3 p-3 chat-left-card'>
            <div className="searchBar">
                <form className="search-container">
                    <input type="text" className='text-light' id="search-bar" placeholder="Search here" />
                    <a href="#"> <Icon className='search-icon' icon="clarity:search-line" /> </a>
                </form>
            </div>
            <div className='chat-member'>
                <ul>
                    {threads?.length > 0 ? threads?.map((thread: any) => {
                        return (
                            <li className="group d-flex bordr" key={thread?.id} onClick={() => {
                                threadClick(thread)
                            }}>
                                <div className="avatar">
                                    <ImageFallback
                                        src={(thread?.expertProfile?.userId === user?.id
                                            ? thread?.task?.requesterProfile?.user?.profilePicture?.fileUrl
                                            : thread?.expertProfile?.user?.profilePicture?.fileUrl) || defaultUserImg}
                                        alt="img"
                                        className="img-fluid user-img img-round"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <div className='namedescription'>
                                    <HtmlData
                                        data={
                                            thread?.expertProfile?.userId === user?.id
                                                ? `${thread?.task?.requesterProfile?.user?.firstName} ${thread?.task?.requesterProfile?.user?.lastName}`
                                                : `${thread?.expertProfile?.user?.firstName} ${thread?.expertProfile?.user?.lastName}`
                                        }
                                        className="GroupName text-white"
                                    />
                                    {/* <p className="GroupDescrp">Wordpress Developer</p> */}
                                    {/* <HtmlData data={proposal?.details} className='text-white' /> u */}
                                </div>
                                <div className='progres'>
                                    <p className='w-s'>In Progress</p>
                                </div>
                            </li>
                        )
                    })
                        : <NoFound />
                    }
                </ul>
            </div>
        </div>
    )
}

export default MsgSidebar
