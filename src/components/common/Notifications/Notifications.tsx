import useSocket from '@/hooks/useSocket'
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ImageFallback from '../ImageFallback/ImageFallback';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import NoFound from '../NoFound/NoFound';
import Link from 'next/link';
import { setThread } from '@/reducers/ThreadSlice';
import defaultUserImg from "../../../../public/assets/images/default-user.jpg"
import { getTimeago } from '@/services/utils/util';
import { emit } from 'process';
import { Socket } from 'socket.io-client';


const Notifications = () => {
    const { socket } = useSocket()
    const dispatch = useAppDispatch();
    const router = useRouter()
    const user = useSelector((state: RootState) => state.user)
    const [notification, setNotification] = useState<any>()
    const [isOpen, setIsOpen] = useState<boolean>(false)


    const NotificationRoutes = (noti:any) => {

        if (socket && !noti?.isRead) {
            socket.emit('markNotificationAsRead', { notificationId: noti?.id });
        }
         if(noti?.type == 'MESSAGE' ){
            getMessageThread(noti?.metadata?.threadId, noti)
         }
         if(noti.type == 'TASK'){
            router.push(`/dashboard/tasks/${noti?.metadata?.taskId}`)
           
         }
         else{
            return
         }

    }

    const getNotifications = async () => {
        try {
            const response = await apiCall(requests.notifications, {}, 'get', false, dispatch, user, router);
            setNotification(response?.data?.data?.notifications || []);
        } catch (error) {
            // console.warn("Error fetching tasks:", error);
        }
    };

    const getMessageThread = async (threadId: any, notificationId: any) => {
        // if (socket && !notificationId?.isRead) {
        //     socket.emit('markNotificationAsRead', { notificationId: notificationId?.id });
        // }
        try {
            const response = await apiCall(requests.getThread, {}, 'get', false, dispatch, user, router);
            const matchingThread = response?.data?.threads?.find((thread: any) => thread?.threadId === threadId);
            if (matchingThread) {
                dispatch(setThread(matchingThread))
                router.push(
                    `/dashboard/messages/${matchingThread?.id}`
                );
            }
        } catch (error) {
            console.warn('Error fetching threads', error);
        }
        getNotifications();
    }

    useEffect(() => {
        getNotifications();
    }, [])

    useEffect(() => {
        if (socket) {
            const notificationHandler = (notification: any) => {

                getNotifications()
                toast(notification.message, {
                    type: 'info',
                    // position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                });
            };

            socket.on("notification", notificationHandler);

            return () => {
                socket.off("notification", notificationHandler);
            };
        }
    }, [socket])

    return (
        <div className="d-none d-lg-block d-lg-flex align-items-" style={{ marginLeft: 'auto' }}>
            {/* <Icon icon="ep:message" className="text-dark" width="24" height="24" /> */}
            <div className="dropdown noti-bell ">
                <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Icon icon="iconamoon:notification-fill" className="text-dark ms-2 mb-2" width="24" height="24" />
                    {/* {notification?.filter((noti: any) => !noti.isRead).length > 0 && ( */}
                        <span className="noti-msg-count translate-middle badge rounded-pill bg-danger">
                            {notification?.filter((noti: any) => !noti.isRead).length > 0 || 0}
                        </span>
                    {/* )} */}
                </button>
                <ul className="dropdown-menu dropfix">
                    <div className="notification-container">
                        <div className="notifi-header">
                            <a className="dropdown-item" href="#">Notifications</a>
                        </div>
                        {notification?.length > 0 ?
                            notification?.map((noti: any) => (
                                <li className="group notifi-main d-flex justify-content-between mx-3 " key={noti?.id}>
                                    {/* <Link href={''}> */}
                                    <div onClick={() => NotificationRoutes(noti)} className="d-flex cursor ">
                                        <div className="avatar">
                                            <ImageFallback
                                                src={noti?.senderProfile?.user?.profilePicture?.fileUrl || defaultUserImg}
                                                alt="img"
                                                className=" user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                                userName={noti?.senderProfile?.user ? `${noti?.senderProfile?.user?.firstName} ${noti?.senderProfile?.user?.lastName}` : null}

                                            />
                                        </div>
                                        <div className='namedescription m-0 ms-3 '>
                                            <p className="GroupName">{noti?.senderProfile?.user?.firstName} {noti?.senderProfile?.user?.lastName}</p>
                                            <div className="d-flex ">
                                                {/* <p className="GroupDescrp fs-12">Wordpress Developer</p> */}
                                                <p className="GroupDescrp fs-12">{noti?.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* </Link> */}
                                    <div className='progres text-end'>
                                        {/* <Icon icon="system-uicons:cross" className="text-black" /> */}
                                        <p className="GroupDescrp fs-10 ">{getTimeago(noti?.createdAt)}</p>
                                    </div>
                                </li>
                            )) :
                            <NoFound message={'No notifications available'} />
                        }

                    </div>
                </ul>
            </div>
        </div>
    )
}

export default Notifications