import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';

const Proposals = () => {
  return (
    







    <div className='card'>
        <div className='card first-card card-header'>
            <h3>Proposals</h3>
        </div>
    <div className='card-bodyy my-active-task'>

    <div className="box m-2 ">
                            <div className='row'>
                                <div className=' col-lg-1 col-2  '>
                                    <div className=' card-profile text-end mt-4 '>
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
                                <div className='col-lg-10 col-9 p-4'>
                                    <div className='priceanddate d-flex justify-content-between bordr'>
                                        <div className='stars'>
                                            <h4>Wordpress Project</h4>
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            </div>
                                        <div>
                                            <span>2 days ago</span>
                                            <h5>$20 / hr</h5>
                                        </div>
                                    </div>
                                    <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}
                                    </p>
                                    <div className='card-footer d-flex justify-content-between  p-0 mb-3'>
                                        <div>

                                            <button className="btn btn-dark rounded-pill hero-btn ls ">Wordpress</button>
                                            <button className="btn btn-dark rounded-pill hero-btn mx-2">Angular React</button>

                                        </div>

                                    </div>
                                    <div className='btn-border'>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Reject</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Interview Questions</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">View Details</button>


                                    </div>

                                </div>

                            </div>
                        </div>

                        <div className="box m-2 ">
                            <div className='row'>
                                <div className=' col-lg-1 col-2  '>
                                    <div className=' card-profile text-end mt-4 '>
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
                                <div className='col-lg-10 col-9 p-4'>
                                    <div className='priceanddate d-flex justify-content-between bordr'>
                                        <div className='stars'>
                                            <h4>Wordpress Project</h4>
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            </div>
                                        <div>
                                            <span>2 days ago</span>
                                            <h5>$20 / hr</h5>
                                        </div>
                                    </div>
                                    <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}
                                    </p>
                                    <div className='card-footer d-flex justify-content-between  p-0 mb-3'>
                                        <div>

                                            <button className="btn btn-dark rounded-pill hero-btn ls ">Wordpress</button>
                                            <button className="btn btn-dark rounded-pill hero-btn mx-2">Angular React</button>

                                        </div>

                                    </div>
                                    <div className='btn-border'>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Reject</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Interview Questions</button>
                                        <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={'/dashboard/tasks/proposals/1'}>View Details</Link>


                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="box m-2 ">
                            <div className='row'>
                                <div className=' col-lg-1 col-2  '>
                                    <div className=' card-profile text-end mt-4 '>
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
                                <div className='col-lg-10 col-9 p-4'>
                                    <div className='priceanddate d-flex justify-content-between bordr'>
                                        <div className='stars'>
                                            <h4>Wordpress Project</h4>
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            </div>
                                        <div>
                                            <span>2 days ago</span>
                                            <h5>$20 / hr</h5>
                                        </div>
                                    </div>
                                    <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}
                                    </p>
                                    <div className='card-footer d-flex justify-content-between  p-0 mb-3'>
                                        <div>

                                            <button className="btn btn-dark rounded-pill hero-btn ls ">Wordpress</button>
                                            <button className="btn btn-dark rounded-pill hero-btn mx-2">Angular React</button>

                                        </div>

                                    </div>
                                    <div className='btn-border'>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Reject</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Interview Questions</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">View Details</button>


                                    </div>

                                </div>

                            </div>
                        </div>



   
    
    </div>
    </div>


  )
}

export default Proposals