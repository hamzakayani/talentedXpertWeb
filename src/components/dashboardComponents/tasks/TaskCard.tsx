import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Icon } from '@iconify/react';

const TaskCard = () => {
    return (
        <div className='card-bodyy my-active-task py-2 '>
            <div className="box mx-3 my-2  ">
                <div className="ribbon ribbon-top-right"><span>Disability</span></div>
                <div className='row'>
                    <div className='col-lg-1 col-2  '>
                        <Image
                            src="/assets/images/promoted-tag.svg"
                            alt="img"
                            className="img-fluid promoteed-tag-img"
                            width={60}
                            height={60}
                            priority
                        />
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
                                <h2>John Smith</h2>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-10 col-9 p-4'>
                        <div className='priceanddate d-flex justify-content-between bordr'>
                            <div className='d-flex align-items-baseline'>
                                <h4>Tech Lead Software Engineer</h4>
                                <button className="btn btn-blue ls mt-1 ms-5">in Progress</button>
                            </div>
                            <div className='pricedate text-end'>
                                <span>2 days ago</span>
                                <h5>$20 / hr</h5>
                            </div>
                        </div>
                        <p>{
                            `A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}
                        </p>
                        <div className='card-footer d-flex flex-wrap justify-content-between'>
                            <div>
                                <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>
                            </div>
                            <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskCard