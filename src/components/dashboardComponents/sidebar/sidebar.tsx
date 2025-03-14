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
import profileImg from "../../../../public/assets/images/profile-img.png"
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
        await apiCall(requests.editUser + user?.id, { profileType: 'BOTH' }, 'put', true, dispatch, user, router).then((res: any) => {
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

    // const getInitials = (str: string) => {
    //     return str && str
    //         .split(' ')
    //         .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    //         .join(' ');
    // };

    const getInitials = (first: string, last?: string) => {
        return `${first.charAt(0)}${last ? last.charAt(0) : ""}`.toUpperCase();
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
                            <Link className='text-lg-end card-profile  mt-4 ' href={`/dashboard/${user?.profile[0]?.type === 'TR' ? 'talent-requestors' : 'talented-xperts'}/${user?.id}`}>
                                {/* {user?.profilePicture?.fileUrl ? <ImageFallback
                                    src={user?.profilePicture?.fileUrl || defaultUserImg}
                                    fallbackSrc={profileImg}
                                    className=" user-img img-round"
                                    width={90}
                                    height={90}
                                    alt="img"
                                    loading='lazy'
                                    blurDataURL={profileImageBlurDataURL}
                                    userName={user?.firstName + ' ' +  user?.lastName}
                                /> :
                                    <div className="user-img img-round">
                                         {getInitials(user?.firstName, user?.lastName)}
                                    </div>} */}
                                <ImageFallback
                                    src={user?.profilePicture?.fileUrl}
                                    fallbackSrc={defaultUserImg}
                                    className=" user-img img-round"
                                    width={90}
                                    height={90}
                                    alt="img"
                                    loading='lazy'
                                    blurDataURL={profileImageBlurDataURL}
                                    userName={user ? `${user?.firstName} ${user?.lastName}` : null}
                                />
                            </Link>
                            <h2>{user?.firstName} {user?.lastName}</h2>
                            {user?.profile?.length > 0 && user?.profile[0]?.type === 'TR' ? (<p>I am Talent Requestor</p>) : (<p>I am Talented Xpert</p>)}
                            {user?.profile?.length > 0 && <RatingStar rating={user.profile[0].averageRating} />}
                        </div>
                        <div className='form-switch-button my-3'>
                            <button className="btn btn-sm w-s rounded-pill btn-outline-info ms-2 "
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
                                        <Link href="/dashboard/talent-requestors">
                                            <li className={isActive('/dashboard/talent-requestors') ? 'text-dark bg-primary' : 'text-white'}>TalentRequestors</li>
                                        </Link>
                                        <Link href="/dashboard/articles">
                                            <li className={isActive('/dashboard/articles') ? 'text-dark bg-primary' : 'text-white'}>Articles</li>
                                        </Link>
                                    </>
                                )}
                                <Link href="/dashboard/messages">
                                    <li className={isActive('/dashboard/messages') ? 'text-dark bg-primary' : 'text-white'}>Messages</li>
                                </Link>
                                {/* <div className="accordion accordion-flush ms-2 " id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header m-0" id="flush-headingThree">
                                            <button className="accordion-button collapsed  border-0 bg-gray text-light ps-4" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                Payments
                                            </button>
                                        </h2>
                                        <div id="flush-collapseThree" className="accordion-collapse collapse bg-gray text-light cursor" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                            <div className='d-flex flex-column '>
                                                <Link href="/dashboard/payments/information" className='pb-2 hov'>  <span className=' text-light ps-4 '>Payment Information</span></Link>
                                                <Link href="/dashboard/payments" className='hov'> <span className='ps-4 text-light '>Transactions</span></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>                              */}
                                {user?.profile?.length > 0 && user?.profile[0]?.type === 'TE' && <Link href="/dashboard/payments/information">
                                    <li className={isActive('/dashboard/payments/information') ? 'text-dark bg-primary' : 'text-white w-s'}>Payment Information</li>
                                </Link>}
                                <Link href="/dashboard/payments">
                                    <li className={isActive('/dashboard/payments') ? 'text-dark bg-primary' : 'text-white'}>Transactions</li>
                                </Link>
                                <Link href="/dashboard/disputes">
                                    <li className={isActive('/dashboard/disputes') ? 'text-dark bg-primary' : 'text-white'}>Disputes</li>
                                </Link>
                                {user?.profile?.length > 0 && user?.profile[0]?.type === 'TE' && <Link href="/dashboard/teams">
                                    <li className={isActive('/dashboard/teams') ? 'text-dark bg-primary' : 'text-white w-s'}>Teams</li>
                                </Link>}
                                <Link href="/dashboard/profile-setting">
                                    <li className={isActive('/dashboard/profile-setting') ? 'text-dark bg-primary' : 'text-white'}>Settings</li>
                                </Link>
                                {user?.profile?.length > 0 && user?.profile[0]?.type !== 'TR' && (
                                    <Link href="/dashboard/reviews">
                                        <li className={isActive('/dashboard/reviews') ? 'text-dark bg-primary' : 'text-white'}>Reviews</li>
                                    </Link>
                                )}
                                <li onClick={handleLogout}><a>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Sidebar;
