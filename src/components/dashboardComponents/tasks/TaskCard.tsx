import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Icon } from '@iconify/react';
import { getTimeago } from '@/services/utils/util';

const TaskCard = ({ task }: any) => {
    console.log('task',task)
    const time = getTimeago(task?.createdAt)

    return (
        <div className='card-bodyy my-active-task py-2 '>
            <div className="box mx-3 my-2  ">
                {task?.disability && <div className="ribbon ribbon-top-right"><span>Disability</span></div>}
                <div className='row'>
                    <div className='col-lg-1 col-2  '>
                        {task?.isPromoted && <Image
                            src="/assets/images/promoted-tag.svg"
                            alt="img"
                            className="img-fluid promoteed-tag-img"
                            width={60}
                            height={60}
                            priority
                        />}
                        <div className='text-lg-end card-profile  mt-4 '>
                            <div className='inerprofile text-end'>
                                <Image
                                    src="/assets/images/profile-img.png"
                                    alt="img"
                                    className="img-fluid user-img img-round"
                                    width={60}
                                    height={60}
                                    priority
                                />
                                <h2>{task?.requesterProfile.user.firstName} {task?.requesterProfile.user.lastName}</h2>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-10 col-9 p-4'>
                        <div className='priceanddate d-flex justify-content-between bordr'>
                            <div className='d-flex align-items-baseline'>
                                <h4>{task?.name}</h4>
                                <button className={`btn ls mt-1 ms-5 ${task?.status === 'POSTED' ? 'btn-warning' :
                                        task?.status === 'INPROGRESS' ? 'btn-blue' :
                                            task?.status === 'COMPLETED' ? 'btn-success' : ''
                                    }`}>{task?.status}</button>
                            </div>
                            <div className='pricedate text-end'>
                                <span>{time}</span>
                                {task?.amountType === 'HOURLY' ? <h5>${task?.amount} / hr</h5> : <h5>${task?.amount}</h5>}
                            </div>
                        </div>
                        <p>{task?.details}
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