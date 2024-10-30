'use client'
import React, { useEffect, useState } from 'react'
import ImageFallback from '../../common/ImageFallback/ImageFallback'
import { Icon } from '@iconify/react/dist/iconify.js'
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import NoFound from '@/components/common/NoFound/NoFound';
import Image from 'next/image';

const MsgSIdebar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const user = useSelector((state: RootState) => state.user)
    const [threads, setThreads] = useState<any>([])
    // console.log('user', user)

    const getthreads = async () => {
        try {
            const response = await apiCall(requests.getThread, {}, 'get', false, dispatch, user, router);
            console.log('response', response)
            setThreads(response?.data?.threads || []);
        } catch (error) {
            console.warn("Error fetching tasks:", error);
        }
    }
    console.log('thuser', threads)
    useEffect(() => {
        getthreads();
    }, [])

    return (
        <div className='card bg-gray mt-1 ms-3 p-3 chat-left-card'>
            <div className="searchBar">
                <form className="search-container">
                    <input type="text" className='text-light' id="search-bar" placeholder="Search here" />
                    <a href="#"> <Icon className='search-icon' icon="clarity:search-line" /> </a>
                </form>
            </div>
            <div className='chat-member'>
                <ul>{threads?.length > 0 ? threads?.map((thread: any) => {
                        return (
                            <li className="group d-flex bordr" key={thread?.id}>
                                <div className="avatar">
                                    <ImageFallback
                                        src="/assets/images/profile-img.png"
                                        alt="img"
                                        className="img-fluid user-img img-round"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <div className='namedescription'>
                                    <p className="GroupName">{thread?.expertProfile?.user?.firstName} {thread?.expertProfile?.user?.lastName}</p>
                                    <p className="GroupDescrp">Wordpress Developer</p>
                                </div>
                                <div className='progres'>
                                    <p>In Progress</p>
                                </div>
                            </li>
                        )
                    }) : <NoFound />}
                    
                </ul>
            </div>
        </div>
    )
}

export default MsgSIdebar
