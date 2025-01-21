'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/Store';
import { RootState } from '@/reducers/Reducer';
import { clearToken, saveToken, setAuthState } from '@/reducers/AuthSlice';
import { setUser } from '@/reducers/UserSlice';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { setThread } from '@/reducers/ThreadSlice';
import defaultUserImg from "../../../../public/assets/images/default-user.jpg"
import RatingStar from '@/components/common/RatingStar/RatingStar';


const Sidebar = () => {
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);

    const isActive = useCallback(
        (path: string) => pathname === path,
        [pathname]
    );

    useEffect(() => {
        fetchBlurDataURL();
    }, [user]);

    const fetchBlurDataURL = async () => {
        if (user?.profilePicture?.fileUrl) {
            const blurUrl = await dynamicBlurDataUrl(user?.profilePicture?.fileUrl);
            setProfileImageBlurDataURL(blurUrl);
        }
    };

    const handleLogout = () => {
        dispatch(saveToken(null))
        dispatch(setAuthState(false))
        dispatch(setThread(null));
        dispatch(clearToken())
        dispatch(setUser(null))
        localStorage.clear()
        router.push('/signin')
    }

    const handleSwitch = () => {
        const type = localStorage.getItem('profileType');
        type === 'TR'
            ? localStorage.setItem('profileType', 'TE')
            : localStorage.setItem('profileType', 'TR');
        getUserDetails();
        router.push('/dashboard');
    };

    const getUserDetails = async () => {
        await apiCall(requests.getUserInfo, {}, 'get', false, dispatch, user, router)
            .then((res: any) => {
                if (res?.error) {
                    return;
                } else {
                    dispatch(setUser(res?.data));
                }
            })
            .catch(err => console.warn(err));
    };

    return (
        <div className='col-auto p-0 p-lg-2'>
            <div className="offcanvas-lg offcanvas-start sidebar-offcanvas" tabIndex={-1} id="offcanvasResponsive" aria-labelledby="offcanvasResponsiveLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close bg-light" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body px-0 py-0">
                    <div className='sidebar'>
                        <div className='text-center py-4'>
                            <ImageFallback
                                src={user?.profilePicture?.fileUrl || defaultUserImg}
                                fallbackSrc={'/assets/images/profile-img.png'}
                                className=" user-img img-round"
                                width={90}
                                height={90}
                                alt="img"
                                loading='lazy'
                                blurDataURL={profileImageBlurDataURL}
                            />
                            <h2>{user?.firstName} {user?.lastName}</h2>
                            {user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' ? (<p>I am Talent Requester</p>) : (<p>I am Talented Xpert</p>)}
                            {user?.profile?.length> 0 && <RatingStar rating={user.profile[0].averageRating}/>}
                        </div>
                        <div className='form-switch-button my-3'>
                            <button className="btn rounded-pill btn-outline-info ms-4 ls" onClick={handleSwitch}>Switch Profile</button>
                        </div>
                        <div className='sidebar-link'>
                            <ul>
                                <Link href="/dashboard">
                                    <li className={isActive('/dashboard') ? 'text-dark bg-primary' : 'text-white'}>Home</li>
                                </Link>
                                <Link href="/dashboard/tasks">
                                    <li className={isActive('/dashboard/tasks') ? 'text-dark bg-primary' : 'text-white'}>Tasks</li>
                                </Link>
                                {user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' ? (
                                    <Link href="/dashboard/talented-xperts">
                                        <li className={isActive('/dashboard/talented-xperts') ? 'text-dark bg-primary' : 'text-white'}>TalentXperts</li>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/dashboard/talented-requestors">
                                            <li className={isActive('/dashboard/talented-requestors') ? 'text-dark bg-primary' : 'text-white'}>TalentRequestor</li>
                                        </Link>
                                        <Link href="/dashboard/articles">
                                            <li className={isActive('/dashboard/articles') ? 'text-dark bg-primary' : 'text-white'}>Articles</li>
                                        </Link>
                                    </>
                                )}
                                <Link href="/dashboard/message">
                                    <li className={isActive('/dashboard/message') ? 'text-dark bg-primary' : 'text-white'}>Messages</li>
                                </Link>
                                <Link href="/dashboard/payment">
                                    <li className={isActive('/dashboard/payment') ? 'text-dark bg-primary' : 'text-white'}>Payments</li>
                                </Link>
                                <Link href="/dashboard/dispute">
                                    <li className={isActive('/dashboard/dispute') ? 'text-dark bg-primary' : 'text-white'}>Disputes</li>
                                </Link>
                                <Link href="/dashboard/profile-setting">
                                    <li className={isActive('/dashboard/profile-setting') ? 'text-dark bg-primary' : 'text-white'}>Settings</li>
                                </Link>
                                {/* {user?.profile?.length> 0 && user?.profile[0]?.type !== 'TR' && (
                                    <Link href="/dashboard/reviews">
                                        <li className={isActive('/dashboard/reviews') ? 'text-dark bg-primary' : 'text-white'}>Reviews</li>
                                    </Link>
                                )} */}
                                <li onClick={handleLogout}><a>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
