import React from 'react'
import MyActiveTask from '../MyActiveTask'
import { Articlelist } from './Articlelist'
import { Icon } from '@iconify/react';
import Link from 'next/link';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import Tasks from '../tasks';


export const Activeandarticle = () => {
    return (
        <section>
            <div className='row'>
                <div className='col-md-8'>
                    <div className="card">
                        <div className="card-header bg-dark text-light  ">
                            <h5 className='mb-0'>My Active Tasks</h5>
                        </div>
                        <Tasks isactive ={true} />
                        {/* <div className='card-bodyy my-active-task py-2 '>
                            <div className="box mx-3 my-2">
                                <div className='row'>
                                    <div className='col-lg-2 col-2  '>
                                        <div className='text-center card-profile  mt-4 '>
                                            <div className='inerprofile'>                                                
                                            <ImageFallback
                                            src="/assets/images/profile-img.png"
                                            alt="img"
                                            className="img-fluid user-img img-round"
                                            width={60}
                                            height={60}
                                            priority
                                            />
                                            
                                                <h2>John</h2>

                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr align-items-center'>
                                            <div className='d-flex align-items-baseline'>
                                                <h4>Tech Lead Software Engineer</h4>
                                            </div>
                                            <div className='pricedate text-end'>
                                                <span>2 days ago</span>
                                                <h5>$20 / hr</h5>
                                            </div>
                                        </div>
                                        <p className='fs-12'>{
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
                        <div className='card-bodyy my-active-task py-2 '>
                            <div className="box mx-3 my-2">
                                <div className='row'>
                                    <div className='col-lg-2 col-2  '>
                                        <div className='text-center card-profile  mt-4 '>
                                            <div className='inerprofile'>                                               
                                            <ImageFallback
                                            src="/assets/images/profile-img.png"
                                            alt="img"
                                            className="img-fluid user-img img-round"
                                            width={60}
                                            height={60}
                                            priority
                                            />
                                                <h2>John</h2>

                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr align-items-center'>
                                            <div className='d-flex align-items-baseline'>
                                                <h4>Tech Lead Software Engineer</h4>
                                            </div>
                                            <div className='pricedate text-end'>
                                                <span>2 days ago</span>
                                                <h5>$20 / hr</h5>
                                            </div>
                                        </div>
                                        <p className='fs-12'>{
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
                        </div> */}
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className="card">
                        <div className="card-header bg-dark text-light">
                            <h5 className='mb-0'>Articles</h5>
                        </div>
                        <div className="card-body bg-gray">
                            <div className='card bg-dark'>
                                <div className='card-body'>
                                    <label className="form-check-label text-light fs-14" htmlFor="flexCheckDefault">
                                        Write headlines with words that resonate
                                    </label>
                                    <div className='border-bottom my-2'></div>
                                    <p className='text-light fs-12'>It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of ...</p>
                                    <div className='d-flex align-items-center justify-content-around flex-wrap'>
                                        <div className='d-flex flex-wrap mb-2 mb-md-0'>
                                            <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2 mb-2">Networking</button>
                                            <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2 mb-2">Development</button>
                                            <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2 mb-2">AI blockchain</button>
                                        </div>
                                        <div className='d-flex mb-2'>
                                            <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                            <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                            <Icon icon="mdi:twitter" className="me-2 text-light" />
                                            <Icon icon="mdi:youtube" className='me-2 text-light' />
                                        </div>
                                        </div>
                                        <div className='text-end '>
                                            <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                                                View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                            </button>
                                        </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="card-body bg-gray">
                            <div className='card bg-dark'>
                                <div className='card-body'>
                                    <label className="form-check-label text-light fs-14" htmlFor="flexCheckDefault">
                                        Write headlines with words that resonate
                                    </label>
                                    <div className='border-bottom my-2'></div>
                                    <p className='text-light fs-12'>It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of ...</p>
                                    <div className='d-flex align-items-center justify-content-around flex-wrap'>
                                        <div className='d-flex flex-wrap mb-2 mb-md-0'>
                                            <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2 mb-2">Networking</button>
                                            <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2 mb-2">Development</button>
                                            <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2 mb-2">AI blockchain</button>
                                        </div>
                                        <div className='d-flex mb-2'>
                                            <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                            <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                            <Icon icon="mdi:twitter" className="me-2 text-light" />
                                            <Icon icon="mdi:youtube" className='me-2 text-light' />
                                        </div>
                                        
                                    </div>
                                    <div className='text-end'>
                                            <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                                                View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                            </button>
                                        </div>
                                </div>
                                
                            </div>
                            <div className='text-end mt-2' >
                                <button className="btn btn-outline-info rounded-pill text-white fs-12 btn-sm">
                                    View All
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}
