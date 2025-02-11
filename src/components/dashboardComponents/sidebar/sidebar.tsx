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
import { toast } from 'react-toastify';


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
        router.push('/')
    }

    const handleSwitch = () => {
        const type = localStorage.getItem('profileType');
        type === 'TR'
            ? localStorage.setItem('profileType', 'TE')
            : localStorage.setItem('profileType', 'TR');
        getUserDetails();
        router.push('/dashboard');
    };

    const createOtherAccount = async () => {
        await apiCall(requests.editUser + user?.id, {profileType: 'BOTH'}, 'put', true, dispatch, user, router).then((res: any) => {
            let message: any;
            if (res?.error) {
                message = res?.error?.message;

                if (Array.isArray(message)) {
                    message?.map((msg: string) => toast.error(msg ? msg : 'Something went wrong, please try again'));
                } else {
                    toast.error(message ? message : 'Something went wrong, please try again')
                }

            } else {
                handleSwitch()
            }
        }).catch(err => {
            console.warn(err)
        })
    }

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
                            <Link className='text-lg-end card-profile  mt-4 ' href={`/dashboard/${user?.profile[0]?.type === 'TR'? 'talented-requestors': 'talented-xperts'}/${user?.id}`}>
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
                            </Link>
                            <h2>{user?.firstName} {user?.lastName}</h2>
                            {user?.profile?.length > 0 && user?.profile[0]?.type === 'TR' ? (<p>I am Talent Requestor</p>) : (<p>I am Talented Xpert</p>)}
                            {user?.profile?.length > 0 && <RatingStar rating={user.profile[0].averageRating} />}
                        </div>
                        <div className='form-switch-button my-3'>
                            <button className="btn rounded-pill btn-outline-info ms-4 ls" 
                                onClick={() => user?.profileType === 'BOTH' ? handleSwitch() : createOtherAccount()}
                            >
                                {user?.profileType === 'BOTH' ? 'Switch Profile' : user?.profileType === 'TE' ? 'Create a TalentRequester Profile' : 'Create a TalentedXpert Profile'}
                            </button>
                        </div>
                        <div className='sidebar-link'>
                            <ul>
                                <Link href="/dashboard">
                                    <li className={isActive('/dashboard') ? 'text-dark bg-primary' : 'text-white'}>Home</li>
                                </Link>
                                <Link href="/dashboard/tasks">
                                    <li className={isActive('/dashboard/tasks') ? 'text-dark bg-primary' : 'text-white'}>Tasks</li>
                                </Link>
                                {user?.profile?.length > 0 && user?.profile[0]?.type === 'TR' ? (
                                    <Link href="/dashboard/talented-xperts">
                                        <li className={isActive('/dashboard/talented-xperts') ? 'text-dark bg-primary' : 'text-white'}>TalentedXperts</li>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/dashboard/talented-requestors">
                                            <li className={isActive('/dashboard/talented-requestors') ? 'text-dark bg-primary' : 'text-white'}>TalentRequestors</li>
                                        </Link>
                                        <Link href="/dashboard/articles">
                                            <li className={isActive('/dashboard/articles') ? 'text-dark bg-primary' : 'text-white'}>Articles</li>
                                        </Link>
                                    </>
                                )}
                                <Link href="/dashboard/messages">
                                    <li className={isActive('/dashboard/messages') ? 'text-dark bg-primary' : 'text-white'}>Messages</li>
                                </Link>
                                <Link href="/dashboard/payments">
                                    <li className={isActive('/dashboard/payments') ? 'text-dark bg-primary' : 'text-white'}>Payments</li>
                                </Link>
                                <Link href="/dashboard/payments/information">
                                    <li className={isActive('/dashboard/payments/information') ? 'text-dark bg-primary' : 'text-white'}>Payment Information</li>
                                </Link>
                                <Link href="/dashboard/payments">
                                    <li className={isActive('/dashboard/payments') ? 'text-dark bg-primary' : 'text-white'}>Transactions</li>
                                </Link>
                                <Link href="/dashboard/disputes">
                                    <li className={isActive('/dashboard/disputes') ? 'text-dark bg-primary' : 'text-white'}>Disputes</li>
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
