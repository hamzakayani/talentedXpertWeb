'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { setIsAccessed } from '@/reducers/AccessSlice';
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

const Sidebar = () => {
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);
    const isActive = (path: string) => {
        if (pathname === path)
            return true
    }

    useEffect(() => {
        fetchBlurDataURL()
    }, [user])

    const fetchBlurDataURL = async () => {
        if (user?.profilePicture) {
            const blurUrl = await dynamicBlurDataUrl(user?.profilePicture);
            setProfileImageBlurDataURL(blurUrl);
        }
    }

    const handleLogout = () => {
        dispatch(saveToken(null))
        dispatch(setAuthState(false))
        dispatch(clearToken())
        dispatch(setUser(null))
        localStorage.clear()
        router.push('/signin')
    }
    const handleSwitch = () => {
        const type = localStorage.getItem('profileType');
        type==='TR'? localStorage.setItem('profileType', 'TE'): localStorage.setItem('profileType', 'TR')
        getUserDetails()
        router.push('/dashboard')
    }

    const getUserDetails = async () => {
        await apiCall(requests.getUserInfo, {}, 'get', false, dispatch, user, router).then((res: any) => {
          if (res?.error) {
            return;
          } else {
            dispatch(setUser(res?.data))
          }
        }).catch(err => console.warn(err))
    }

    return (
        <>
            <div className='col-auto p-0 p-lg-2'>
                <div className="offcanvas-lg offcanvas-start sidebar-offcanvas" tabIndex={-1} id="offcanvasResponsive" aria-labelledby="offcanvasResponsiveLabel">
                    <div className="offcanvas-header">
                        <button type="button" className="btn-close bg-light" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body px-0 py-0">
                        <div className='sidebar '>
                            <div className='text-center py-4'>

                                <ImageFallback
                                    src={user?.profilePicture || '/assets/images/profile-img.png'}
                                    fallbackSrc={'/assets/images/profile-img.png'}
                                    className="img-fluid user-img img-round"
                                    width={90}
                                    height={90}
                                    alt="img"
                                    loading='lazy'
                                    blurDataURL={profileImageBlurDataURL}
                                />
                                <h2>{user?.firstName} {user?.lastName}</h2>
                                {user?.profile[0]?.type === 'TR' ? (<p>I am Talent  Requester </p>) : (<p>I am Talented  Xpert </p>)}
                                <Icon icon="ic:baseline-star" className='text-warning' />
                                <Icon icon="ic:baseline-star" className='text-warning' />
                                <Icon icon="ic:baseline-star" className='text-warning' />
                                <Icon icon="mdi-light:star" className='text-light' />
                                <Icon icon="mdi-light:star" className='text-light' />

                            </div>
                            {/* <div className='form-switch-button'>
                                <ul>
                                    <li> <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Switch Profile</label>
                                    </div></li>
                                </ul>
                            </div> */} 
                            <div className='form-switch-button  my-3'>
                                <button className="btn rounded-pill btn-outline-info ms-4 ls text-dark" onClick={handleSwitch}>Switch Profile</button>
                            </div>


                            <div className='sidebar-link'>
                                <ul>
                                    <li className={isActive("/dashboard") ? 'active' : ''}><Link href="/dashboard"> Home</Link></li>
                                    <li className={isActive("/dashboard/tasks") ? 'active' : ''}><Link href="/dashboard/tasks"> Tasks</Link></li>
                                    {user?.profile[0]?.type === 'TR' ?
                                        <li className={isActive("/dashboard/talented-xperts") ? 'active' : ''}><Link href={"/dashboard/talented-xperts"}> TalentXperts</Link></li>
                                        : (
                                            <>
                                                <li className={isActive("/dashboard/talented-requestors") ? 'active' : ''}><Link href={"/dashboard/talented-requestors"}> TalentRequestor</Link></li>
                                                <li className={isActive("/dashboard/articles") ? 'active' : ''}><Link href="/dashboard/articles"> Articles</Link></li>
                                            </>
                                        )}
                                    <li className={isActive("/dashboard/message") ? 'active' : ''}><Link href="/dashboard/message"> Message</Link></li>
                                    <li className={isActive("/dashboard/payment") ? 'active' : ''}><Link href="/dashboard/payment"> Payments</Link></li>
                                    <li className={isActive("/dashboard/dispute") ? 'active' : ''}><Link href="/dashboard/dispute"> Dispute</Link></li>
                                    <li className={isActive("/dashboard/profile-setting") ? 'active' : ''}><Link href="/dashboard/profile-setting"> Settings</Link></li>
                                    {user?.profile[0]?.type === 'TR' ? null : (
                                        <li className={isActive("/dashboard/reviews") ? 'active' : ''}><Link href="/dashboard/reviews">Reviews</Link></li>)}
                                    <li onClick={handleLogout}> <a>Logout</a></li>
                                    <button className="btn rounded-pill btn-outline-info ms-4 ls">SmartDash</button>

                                    <li>

                                        <div className="dropdown text-start d-lg-none">
                                            <button className="d-flex align-items-center  border-0 bg-transparent  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <ImageFallback
                                                    src={user?.profilePicture ? user?.profilePicture : '/assets/images/profile-img.png'}
                                                   
                                                    fallbackSrc={'/assets/images/profile-img.png'}
                                                    className="img-fluid user-img img-round"
                                                    width={32}
                                                    height={32}
                                                    alt="User Image"
                                                    loading='lazy'
                                                    blurDataURL={profileImageBlurDataURL}
                                                />
                                                <div className="d-flex ms-2 flex-column text-light ">
                                                    <div className="fs-14 fw-bold text-start ">{user?.firstName} {user?.lastName}</div>
                                                    <div className=" fs-12 truncate ">{user?.email}</div>
                                                </div>
                                            </button>
                                            <ul className="dropdown-menu profile-settings d-none">
                                                <li><a className="dropdown-item" href="/dashboard/profile-setting">Profile Settings</a></li>
                                                <li><a className="dropdown-item" href="#" onClick={handleLogout}>Log out</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>


                            </div>

                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default Sidebar
