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

const Notifications = () => {
    const { socket } = useSocket()
    const dispatch = useAppDispatch();
    const router = useRouter()
    const user = useSelector((state: RootState) => state.user)
    const [notification, setNotification] = useState<any>()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const getNotifications = async () => {
        try {
            // setLoading(true);
            const response = await apiCall(requests.notifications,
                {},
                'get',
                false,
                dispatch,
                user,
                router
            );
            console.log('res notification', response)

            setNotification(response?.data?.data?.notifications || []);
        } catch (error) {
            // console.warn("Error fetching tasks:", error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        getNotifications();
    }, [])
    
    useEffect(() => {
        if (socket) {
            const notificationHandler = (notification: any) => {

                toast(notification.message, {
                    type: 'info',
                    // position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000, // Auto close after 5 seconds
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
                    <Icon icon="iconamoon:notification-fill" className="text-dark ms-2 me-2" width="24" height="24" />
                </button>
                <ul className="dropdown-menu dropfix">
                    <div className="notification-container">
                        <div className="notifi-header">
                            <a className="dropdown-item" href="#">Notifications</a>
                        </div>
                        {notification?.length > 0 ?
                            notification?.map((noti: any) => (<li className="group notifi-main d-flex justify-content-between mx-3 " key={noti?.id}>
                                <div className="d-flex">
                                    <div className="avatar">
                                        <ImageFallback
                                            src="/assets/images/profile-img.png"
                                            alt="img"
                                            className=" user-img img-round"
                                            width={40}
                                            height={40}
                                            priority
                                        />
                                    </div>
                                    <div className='namedescription m-0 ms-3 '>
                                        <p className="GroupName">John smith</p>
                                        <div className="d-flex ">
                                            <p className="GroupDescrp fs-12">Wordpress Developer</p>
                                            <p className="GroupDescrp fs-12">{noti?.type}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='progres text-end'>
                                    <Icon icon="system-uicons:cross" className="text-black" />
                                    <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                                </div>
                            </li>)) :
                            <NoFound message={'No notifications available'} />
                        }

                    </div>
                </ul>
            </div>
        </div>
    )
}

export default Notifications