import useSocket from '@/hooks/useSocket'
import { Icon } from '@iconify/react';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import ImageFallback from '../ImageFallback/ImageFallback';

const Notifications = () => {
    const { socket } = useSocket()

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
                <button className="btn " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Icon icon="iconamoon:notification-fill" className="text-dark ms-2 me-2" width="24" height="24" />
                </button>
                <ul className="dropdown-menu dropfix">
                    <div className="notification-container">
                        <div className="notifi-header">
                            <a className="dropdown-item" href="#">Notifications</a>
                        </div>
                        <li className="group notifi-main d-flex justify-content-between mx-3 ">
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
                                    </div>
                                </div>
                            </div>
                            <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                            </div>
                        </li>
                        <li className="group d-flex justify-content-between mx-3 ">
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
                                    </div>
                                </div>
                            </div>
                            <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                            </div>
                        </li>
                        <li className="group d-flex justify-content-between mx-3 ">
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

                                    </div>

                                </div>

                            </div>

                            <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                            </div>
                        </li>
                        <li className="group d-flex justify-content-between mx-3 ">
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

                                    </div>

                                </div>

                            </div>

                            <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                            </div>
                        </li>
                        <li className="group d-flex justify-content-between mx-3 ">
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

                                    </div>

                                </div>

                            </div>

                            <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                            </div>
                        </li>
                        <li className="group d-flex justify-content-between mx-3 ">
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

                                    </div>

                                </div>

                            </div>

                            <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                            </div>
                        </li>
                        <li className="group d-flex justify-content-between mx-3 ">
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

                                    </div>
                                </div>
                            </div>
                            <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                            </div>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    )
}

export default Notifications