'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { getTimeago } from '@/services/utils/util';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import Image from 'next/image';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import defaultUserImg from "../../../../public/assets/images/default-user.jpg"
import RatingStar from '@/components/common/RatingStar/RatingStar';

const TaskCard = ({ task, reviews }: any) => {
    const time = getTimeago(task?.createdAt)
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        fetchBlurDataURL();
    }, [task?.requesterProfile?.user?.profilePicture]);


    const fetchBlurDataURL = async () => {
        if (task?.requesterProfile?.user?.profilePicture?.fileUrl) {
            const blurUrl = await dynamicBlurDataUrl(task?.requesterProfile?.user?.profilePicture.fileUrl);
            setProfileImageBlurDataURL(blurUrl);
        }
    }


    return (
        <div className='card-bodyy my-active-task py-1 pb-3'>
            <div className="box mt-2 mx-3">
                {task?.promoted && <div className="ribbon-1 mb-3">
                    <Image
                        src={"/assets/images/promote.svg"}
                        alt="img"
                        className="img-fluid ribbon-img"
                        width={120}
                        height={130}
                        priority
                    />
                </div>}
                {task?.disability && <div className="ribbon ribbon-top-right"><span>Disability</span></div>}
                <div className='row mx-3 '>
                    <div className='col-auto ms-0 ps-0'>
                        <Link className='text-lg-end card-profile  mt-4 ' href={`/dashboard/talented-requestors/${task?.requesterProfile?.userId}`}>
                            <div className='inerprofile text-center'>
                                <ImageFallback
                                    src={task?.requesterProfile?.user?.profilePicture?.fileUrl || defaultUserImg}
                                    alt="img"
                                    className="img-round"
                                    width={60}
                                    height={60}
                                    loading='lazy'
                                    fallbackSrc={profileImageBlurDataURL}
                                />
                                <h2 className='ms-1'>{task?.requesterProfile?.user?.firstName} {task?.requesterProfile?.user?.lastName}</h2>
                            </div>
                        </Link>
                    </div>
                    <div className='col pe-4  '>
                        <div className='priceanddate  justify-content-between bordr '>
                            <div className='d-flex flex-wrap align-items-baseline'>
                                <div className='priceanddate d-flex justify-content-between '>
                                    <div className='d-flex align-items-baseline'>
                                        <div className='stars mb-2'>
                                            <h4 className='me-3 ms-lg-0'>{task?.name}</h4>
                                            <RatingStar rating={reviews?.length > 0 ? reviews[0]?.rating : 0} />
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className={`badge ms-0 ms-lg-3 ms-md-3 mb-3 
                                           ${task?.status === 'INPROGRESS' ? 'text-bg-warning' :
                                            task?.status === 'COMPLETED' ? 'text-bg-success' :
                                                task?.status === 'POSTED' ? 'text-bg-primary' :
                                                    task?.status === 'CLOSED' ? 'text-bg-danger' : ''}`}
                                >
                                    {task?.status}
                                </span>
                            </div>
                            <div className='pricedate me-4 '>
                                <span>{time}</span>
                                {task?.amountType === 'HOURLY' ? <h5>${task?.amount} / hr</h5> : <h5>${task?.amount}</h5>}
                            </div>
                        </div>
                        <div className=''>
                            <HtmlData data={task?.details} className='truncate-overflow text-white line-clamp-2 mt-3' />
                            <div className='card-footer d-flex flex-wrap justify-content-between pb-4'>
                                <div className='d-flex  justify-content-between category-btns'>
                                    <button className="btn btn-black btn-sm rounded-pill ls mt-2 mx-1 w-s" style={{ pointerEvents: 'none' }}>{task?.categories?.length > 0 && task?.categories[0]?.category?.parentCategory?.name}</button>
                                    {task?.categories?.map((cat: any) => (
                                        <div key={cat.id}>
                                            <button className="btn btn-black btn-sm rounded-pill ls mt-2 mx-1 w-s" style={{ pointerEvents: 'none' }}>{cat?.category?.name}</button>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <Link className="btn rounded-pill btn-outline-info btn-sm mt-2 ls 00 " href={isAuth ? `/dashboard/tasks/${task?.id}` : `/tasks/${task?.id}`} >View Details<Icon icon="ic:sharp-arrow-forward" className='ms-2' /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskCard