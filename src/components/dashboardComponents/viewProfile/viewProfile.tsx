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
import defaultUserImg from "../../../../public/assets/images/default-user.jpg"


const ViewProfile = () => {
    const [details, setDetails] = useState<any>({})
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const { id } = useParams()

    const getUser = async (id: number) => {
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

                <div className='bg-black p-3'>
                    <div className=' my-active-task py-2 bg-gray b-r'>
                        <div className='profile-header d-md-flex justify-content-between mx-md-5 p-4'>
                            <div className='profile-left d-md-flex'>
                                <div className='d-flex justify-content-around me-md-5'>
                                    <Image
                                        src={details?.profilePicture?.fileUrl || defaultUserImg}
                                        alt="img"
                                        className=" user-img img-round mb-3"
                                        width={100}
                                        height={100}
                                        priority
                                    />
                                </div>
                                <div className='profile-detail d-grid'>
                                    <h5><b>{details.firstName} {details.lastName}</b></h5>
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
                                    <p className='m-0'>95% Task Success</p>
                                </div>
                                <div className='d-flex align-items-center py-1'>
                                    <Image
                                        src="/assets/images/verifid.svg"
                                        alt="img"
                                        className="me-2"
                                        width={25}
                                        height={25}
                                        priority
                                    />
                                    <p className='m-0'>Verified</p>
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

                                </div>
                            </div>
                        </div>


                        <div className='about mx-2 mx-md-4 p-3'>
                            <h4>About</h4>
                            <p>{details.about}</p>
                        </div>

                        <div className='about  mx-2 mx-md-4 p-3 my-3'>
                            <h4>Education</h4>
                            <p>{details.about}</p>
                        </div>
                        <div className='about  mx-2 mx-md-4 p-3'>
                            <h4>Experience</h4>
                            <div className='d-flex'>
                                <div className=''> <Image
                                    src={details?.profilePicture?.fileUrl || defaultUserImg}
                                    alt="img"
                                    className=" user-img img-round me-3"
                                    width={40}
                                    height={40}
                                    priority
                                /></div>
                                <div className=''><p>{details.about}</p></div>

                            </div>

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
                            <div className='d-flex justify-content-between  flex-column flex-md-row'>
                                <div className='articles-card promoted_card me-2 mt-2 '>

                                    <h4>Don’t forget text has a starring role in video...</h4>
                                    <span>12 hours ago</span>
                                    <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                                </div>
                                <div className='articles-card promoted_card me-2 mt-2'>

                                    <h4>Don’t forget text has a starring role in video...</h4>
                                    <span>12 hours ago</span>
                                    <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                                </div>
                                <div className='articles-card promoted_card me-2 mt-2 '>

                                    <h4>Don’t forget text has a starring role in video...</h4>
                                    <span>12 hours ago</span>
                                    <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                                </div>
                            </div>
                            <div className='text-end mt-3'>
                                <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/talentxpertEX/Articlelist'} >View All<Icon icon="ic:sharp-arrow-forward" /></Link>
                            </div>
                        </div>

                        {/* Review start */}
                        <h3 className='my-2 ms-2 review-heading' >Customer Reviews</h3>
                        <div className='review mx-2 mx-md-4 p-3 mt-3'>

                            <div className='d-flex'>
                                <div className=''> <Image
                                    src={details?.profilePicture?.fileUrl || defaultUserImg}
                                    alt="img"
                                    className=" user-img img-round me-3"
                                    width={40}
                                    height={40}
                                    priority
                                /></div>
                                <div className='text-light d-flex justify-content-between'>
                                    <div className=''>
                                        <h6>Marry Hill</h6>
                                        <span>2 Day Ago</span>
                                        <p className='text-light'>{details.about}</p>
                                    </div>
                                    <div className='ms-3'>
                                        <div className='star d-flex align-items-center'>
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                        </div>
                                    </div>


                                </div>

                            </div>

                        </div>

                        <div className='review mx-2 mx-md-4 p-3 mt-3 mb-2'>

                            <div className='d-flex'>
                                <div className=''> <Image
                                    src={details?.profilePicture?.fileUrl || defaultUserImg}
                                    alt="img"
                                    className=" user-img img-round me-3"
                                    width={40}
                                    height={40}
                                    priority
                                /></div>
                                <div className='text-light d-flex justify-content-between'>
                                    <div className=''>
                                        <h6>Marry Hill</h6>
                                        <span>2 Day Ago</span>
                                        <p className='text-light'>{details.about}</p>
                                    </div>
                                    <div className='ms-3'>
                                        <div className='star d-flex align-items-center'>
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                        </div>
                                    </div>


                                </div>

                            </div>

                        </div>

                        {/* Review End */}

                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewProfile