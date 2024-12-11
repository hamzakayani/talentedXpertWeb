'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import ProjectsSlider from '@/components/common/sliders/ProjectsSlider';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';


const ViewProfile = () => {
    const [details, setDetails] = useState<any>({})
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const { id } = useParams()

    const getUser = async (id: number) => {
        console.log(requests.getUserInfo + id, id)
        await apiCall(requests.getUserInfo + id, {}, 'get', false, dispatch, user, router).then((res: any) => {
            console.log("res", res)
            setDetails(res?.data)

        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        getUser(Number(id));
    }, [])
    useEffect(() => {
        console.log('details', details)
    }, [details])
    


    return (
        <>

            <div className='card'>
                <div className='card  card-header bg-gray'>
                    <h3 className='text-white'>View Profile</h3>
                </div>
                <div className='card-bodyy my-active-task py-2 bg-black'>
                    <div className='profile-header d-flex justify-content-around mt-4 p-3'>
                        <div className='profile-left d-flex'>
                            <div className='d-none d-sm-block d-md-block d-lg-block'>
                                <Image
                                    src="/assets/images/profile-img.png"
                                    alt="img"
                                    className="img-fluid user-img img-round me-4"
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </div>
                            <div className='d-grid'>
                                <h5>{details.firstName} {details.lastName}</h5>
                                <p>Wordpress Developer</p>
                                <span>Earnings: <strong>$50K+</strong></span>
                                <span>Total Tasks: <strong>1,873</strong></span>
                            </div>
                        </div>
                        <div className='profile-right '>
                            <div className='d-flex align-items-center'>
                                <Image
                                    src="/assets/images/success.svg"
                                    alt="img"
                                    className="me-2"
                                    width={25}
                                    height={25}
                                    priority
                                />
                                <p>95% Task Success</p>
                            </div>
                            <div className='d-flex align-items-center'>
                                <Image
                                    src="/assets/images/verifid.svg"
                                    alt="img"
                                    className="me-2"
                                    width={25}
                                    height={25}
                                    priority
                                />
                                <p>Verified</p>
                            </div>
                            <div className='d-flex align-items-center'>
                                <Image
                                    src="/assets/images/rated.svg"
                                    alt="img"
                                    className="me-2"
                                    width={25}
                                    height={25}
                                    priority
                                />
                                <div className='star d-flex align-items-center'>
                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                    <Icon icon="mdi-light:star" className='text-light' />
                                    <Icon icon="mdi-light:star" className='text-light' />
                                </div>
                                <p>3.0/5</p>
                            </div>
                        </div>
                    </div>
                    <div className='about mx-4 p-3'>
                        <h4>About</h4>
                        <p>{details.about}</p>
                    </div>


                    {/* <div className='experience m-4  p-3'>
                        <div className='d-flex'>
                            <div className='profile'>
                                <Image
                                    src="/assets/images/profile-img.png"
                                    alt="img"
                                    className="img-fluid user-img img-round me-4"
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </div>
                            <div>
                                <h6> WordPress Developer </h6>
                                <span>1 yrs 02 mos</span>
                            </div>
                        </div>
                        <p>I am Web developer expert with over eight years of experience in Websites Development, frontend developers as well as backend development</p>
                    </div> */}
                    <div className='Projects p-lg-4 p-md-4 p-sm-2  p-3'>
                        <h3 className='my-3 ms-2'>Projects</h3>
                        <ProjectsSlider />
                        <div className='text-end mt-3'>
                            <button className="btn rounded-pill btn-outline-info ms-4 ls">View All</button>
                        </div>
                    </div>

                    <div className='articles  p-3'>
                        <h3 className='my-2 ms-2'>Articles</h3>
                        <div className='d-flex'>
                            <div className='articles-card promoted_card mx-2'>

                                <h4>Don’t forget text has a starring role in video...</h4>
                                <span>12 hours ago</span>
                                <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                            </div>
                            <div className='articles-card promoted_card mx-2'>

                                <h4>Don’t forget text has a starring role in video...</h4>
                                <span>12 hours ago</span>
                                <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                            </div>
                            <div className='articles-card promoted_card mx-2'>

                                <h4>Don’t forget text has a starring role in video...</h4>
                                <span>12 hours ago</span>
                                <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                            </div>
                        </div>
                        <div className='text-end mt-3'>
                            <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/talentxpertEX/Articlelist'} >View All<Icon icon="ic:sharp-arrow-forward" /></Link>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

export default ViewProfile