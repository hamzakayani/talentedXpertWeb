'use client'
import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { setIsAccessed } from '@/reducers/AccessSlice';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/Store';
import { RootState } from '@/reducers/Reducer';
import { clearToken, saveToken, setAuthState } from '@/reducers/AuthSlice';
import { setUser } from '@/reducers/UserSlice';


const Sidebar = () => {

    const dispatch = useAppDispatch();

    const router = useRouter()

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
                        <h2>John Smith</h2>
                        <p>i am a TalentedRequester</p>
                        <Icon icon="ic:baseline-star" className='text-warning' />
                        <Icon icon="ic:baseline-star" className='text-warning' />
                        <Icon icon="ic:baseline-star" className='text-warning' />
                        <Icon icon="mdi-light:star" className='text-light' />
                        <Icon icon="mdi-light:star" className='text-light' />
                    </div>

                    <div className='sidebar-link'>
                        <ul>
                            <li className='active'><a>Home</a></li>
                            <li><Link href="/dashboard/tasks"> Tasks</Link></li>
                            <li><Link href="/talented-xperts"> TalentXpert</Link></li>
                            <li><Link href="/dashboard/message"> Message</Link></li>
                            <li><Link href="/dashboard/payment"> Payments</Link></li>
                            <li><Link href="/dashboard/dispute"> Dispute</Link></li>
                            <li><Link href="/dashboard/profile-settings"> Settings</Link></li>
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
