'use client'
import React, { useState } from 'react'
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


const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);
    const isActive = (path: string) => {
        if (pathname === path)
            return true
    }



    const handleLogout = () => {
        dispatch(saveToken(null))
        dispatch(setAuthState(false))
        dispatch(clearToken())
        dispatch(setUser(null))
        localStorage.clear()
        router.push('/signin')
    }

    return (
        <>
            <div className='col-lg-2 col-md-3'>
                <div className='sidebar'>
                    <div className='text-center py-4'>
                        <Image
                            src="/assets/images/profile-img.png"
                            alt="img"
                            className="img-fluid user-img img-round"
                            width={90}
                            height={90}
                            priority
                        />
                        <h2>{user?.firstName} {user?.lastName}</h2>
                        {user?.profile[0]?.type === 'TR' ? (<p>I am Talented  Requestor </p>) : (<p>I am Talented  Xpert </p>)}
                        <Icon icon="ic:baseline-star" className='text-warning' />
                        <Icon icon="ic:baseline-star" className='text-warning' />
                        <Icon icon="ic:baseline-star" className='text-warning' />
                        <Icon icon="mdi-light:star" className='text-light' />
                        <Icon icon="mdi-light:star" className='text-light' />

                    </div>
                    <div className='form-switch-button'>
                        <ul>
                            <li> <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Switch Profile</label>
                            </div></li>
                        </ul>
                    </div>




                    <div className='sidebar-link'>
                        <ul>
                            <li className={isActive("/dashboard") ? 'active' : ''}><Link href="/dashboard"> Home</Link></li>
                            <li className={isActive("/dashboard/tasks") ? 'active' : ''}><Link href="/dashboard/tasks"> Tasks</Link></li>
                            {user?.profile[0]?.type === 'TR' ?
                                <li  className={isActive("/dashboard/talented-xperts") ? 'active' : ''}><Link href={"/dashboard/talented-xperts"}> TalentXperts</Link></li>
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
                            <li onClick={handleLogout}>Logout</li>
                            <button className="btn rounded-pill btn-outline-info ms-4 ls">SmartDash</button>

                        </ul>


                    </div>

                </div>

            </div>
        </>
    )
}

export default Sidebar
