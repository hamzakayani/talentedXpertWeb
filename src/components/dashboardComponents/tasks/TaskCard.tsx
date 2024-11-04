'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { getTimeago } from '@/services/utils/util';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import ProfilePicture from '@/components/common/ProfilePicture/ProfilePicture';

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
        <div className='card-bodyy my-active-task py-1 '>
            <div className="box mx-2 mt-2  gg ">
                {task?.disability && <div className="ribbon ribbon-top-right"><span>Disability</span></div>}
                <div className='row'>
                    <div className='col-lg-1 col-md-2 col-sm-2 col-auto mx-auto  '>
                        {task?.isPromoted &&
                            <ImageFallback
                                src="/assets/images/promoted-tag.svg"
                                alt="img"
                                className="img-fluid promoteed-tag-img ms-3"
                                width={60}
                                height={60}
                                priority
                            />
                        }
                        <Link className='text-lg-end card-profile  mt-4 ' href={`/dashboard/talented-xperts/${task?.requesterProfile?.userId}`}>
                            <div className='inerprofile text-center'>
                                <ProfilePicture source={task?.requesterProfile?.user?.profilePicture}/>
                                <h2 className='ms-1'>{task?.requesterProfile.user.firstName} {task?.requesterProfile.user.lastName}</h2>
                            </div>
                        </Link>
                    </div>
                    <div className='col-lg-11 col-md-10 col-sm-10 p-3 pe-4  ps-md-4'>
                        <div className='priceanddate  justify-content-between bordr '>
                            <div className='d-flex align-items-baseline'>
                                <h4>{task?.name}</h4>
                            </div>
                            <div className='stage-buton'>
                            <button className={`btn ls mt-1  ${task?.status === 'POSTED' ? 'btn-warning' :
                                    task?.status === 'INPROGRESS' ? 'btn-blue' :
                                        task?.status === 'COMPLETED' ? 'btn-success' : ''
                                    }`}>{task?.status}</button>
                            </div>
                            <div className='pricedate '>
                                <span>{time}</span>
                                {task?.amountType === 'HOURLY' ? <h5>${task?.amount} / hr</h5> : <h5>${task?.amount}</h5>}
                            </div>
                        </div>
                        <p className='truncate-overflow line-clamp-2 ps-2'>{task?.details}
                        </p>
                        <div className='card-footer d-flex flex-wrap justify-content-between'>
                            <div>
                                <button className="btn btn-black rounded-pill ls mt-2 ">{task?.category.name}</button>
                                {/* <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button> */}
                            </div>
                            <Link className="btn rounded-pill btn-outline-info mt-2" href={`/dashboard/tasks/${task?.id}`} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskCard