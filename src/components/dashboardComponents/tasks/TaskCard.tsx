'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { getTimeago } from '@/services/utils/util';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import ProfilePicture from '@/components/common/ProfilePicture/ProfilePicture';
import Image from 'next/image';
import HtmlData from '@/components/common/HtmlData/HtmlData';

const TaskCard = ({ task }: any) => {
    const time = getTimeago(task?.createdAt)
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');

    

    useEffect(() => {
        fetchBlurDataURL();
    }, [task?.requesterProfile?.user?.profilePicture]);


    const fetchBlurDataURL = async () => {
        if (task?.requesterProfile?.user?.profilePicture) {
            const blurUrl = await dynamicBlurDataUrl(task?.requesterProfile?.user?.profilePicture);
            setProfileImageBlurDataURL(blurUrl);
        }
    }


    return (
        <div className='card-bodyy my-active-task py-1'>
            <div className="box mt-2 mx-3">
                {task?.promoted && <div className="ribbon-1 mb-3">
                    <Image
                        src={task?.requesterProfile?.user?.profilePicture?.fileUrl ||"/assets/images/promote.svg"}
                        alt="img"
                        className="img-fluid ribbon-img"
                        width={150}
                        height={150}
                        priority
                    />
                </div>}
                {task?.disability && <div className="ribbon ribbon-top-right"><span>Disability</span></div>}
                <div className='row mx-3 '>
                    <div className='col-auto ms-0 ps-0'>
                        <Link className='text-lg-end card-profile  mt-4 ' href={`/dashboard/talented-xperts/${task?.requesterProfile?.userId}`}>
                            <div className='inerprofile text-center'>
                                <ProfilePicture source={task?.requesterProfile?.user?.profilePicture !== 'string' && task?.requesterProfile?.user?.profilePicture} />
                                <h2 className='ms-1'>{task?.requesterProfile.user.firstName} {task?.requesterProfile.user.lastName}</h2>
                            </div>
                        </Link>
                    </div>
                    <div className='col pe-4  '>
                        <div className='priceanddate  justify-content-between bordr '>
                            <div className='d-flex flex-wrap align-items-baseline'>
                                <h4 className='me-3 ms-lg-0'>{task?.name}</h4>

                                <span className="badge text-bg-warning ms-0 ms-lg-3 ms-md-3 ">Posted</span>




                                {/* <button className={`btn ls mt-1 ms-4  ${task?.status === 'POSTED' ? 'btn-warning' :
                                    task?.status === 'INPROGRESS' ? 'btn-blue' :
                                        task?.status === 'COMPLETED' ? 'btn-success' : ''
                                    }`}>{task?.status}</button> */}
                            </div>
                           
                            <div className='pricedate me-4 '>
                                <span>{time}</span>
                                {task?.amountType === 'HOURLY' ? <h5>${task?.amount} / hr</h5> : <h5>${task?.amount}</h5>}
                            </div>
                        </div>

                    </div>
                </div>
                <div className='mx-2'>
                    <HtmlData data={task?.details} className='truncate-overflow text-white line-clamp-2 ps-2' /> 
                    {/* <p className='truncate-overflow text-white line-clamp-2 ps-2'>
                        {task?.details}
                    </p> */}
                    <div className='card-footer d-flex flex-wrap justify-content-between pb-4'>
                        <div>
                            <button className="btn btn-black rounded-pill ls mt-2 ">{task?.category?.name}</button>
                            {/* <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button> */}
                        </div>
                        <Link className="btn rounded-pill btn-outline-info mt-2" href={`/dashboard/tasks/${task?.id}`} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TaskCard