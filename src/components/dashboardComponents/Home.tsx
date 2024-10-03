'use client'
import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Sidebar from './sidebar/sidebar';
// import Img from '../common/ImageFallback/img';

const Home = () => {
    console.log("<<<")
    return (
        <>
            <div className='top-card '>
                <section className="promoted_te_section pb-3">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3 mb-2">
                            <div className="promoted_card">
                                <div className="card_heading top-cards">

                                    <div className="dib">
                                        <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1">
                                            group_add
                                        </span>
                                        <div className="victorimgup"></div>
                                    </div>


                                    <h5>Tasks</h5>


                                </div>

                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3 mb-2">
                            <div className="promoted_card">
                                <div className="card_heading top-cards">

                                    <div className="dib">
                                        <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1 ">
                                            group_add
                                        </span>
                                        <div className="victorimgup"></div>
                                    </div>

                                    <div className="usertext">
                                        <h5>TalentedXpert</h5>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3 mb-2">
                            <div className="promoted_card">
                                <div className="card_heading top-cards">

                                    <div className="dib">
                                        <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1">
                                            group_add
                                        </span>
                                        <div className="victorimgup"></div>
                                    </div>

                                    <div className="usertext">
                                        <h5>Rating</h5>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3 mb-2">
                            <div className="promoted_card">
                                <div className="card_heading top-cards">

                                    <div className="dib">
                                        <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1">
                                            group_add
                                        </span>
                                        <div className="victorimgup"></div>
                                    </div>

                                    <div className="usertext">
                                        <h5>Payments</h5>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

            </div>

            <div className='card'>
                <div className='first-card card-header d-flex justify-content-between px-4 bg-gray'>
                    <div className='card-left-heading'>
                        <h3>My Acitve Task</h3>
                    </div>

                    <div className='card-right-heading d-flex justify-content-between'>
                        <span className='me-3'>Add New Task</span>
                        <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} />
                    </div>

                </div>

                <div className='card-bodyy my-active-task '>

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
                                    <h4>Tech Lead Software Engineer</h4>
                                    <div className='pricedate text-end'>
                                        <span>2 days ago</span>
                                        <h5>$20 / hr</h5>
                                    </div>

                                </div>
                                <p>
                                    {`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}

                                </p>


                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                        <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                    </div>


                                    <button className="btn rounded-pill btn-outline-info mt-2">View Details<Icon icon="ic:sharp-arrow-forward" /></button>


                                </div>

                            </div>

                        </div>
                    </div>

                </div>

                <div className='card-bodyy my-active-task'>

                    <div className="box mx-3 my-2">

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
                                    <h4>Tech Lead Software Engineer</h4>
                                    <div className='pricedate text-end'>
                                        <span>2 days ago</span>
                                        <h5>$20 / hr</h5>
                                    </div>

                                </div>
                                <p>
                                    {`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}

                                </p>


                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                        <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                    </div>


                                    <button className="btn rounded-pill btn-outline-info mt-2">View Details<Icon icon="ic:sharp-arrow-forward" /></button>


                                </div>

                            </div>

                        </div>
                    </div>

                </div>

                <div className='card-bodyy my-active-task'>

                    <div className="box mx-3 my-2">

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
                                    <h4>Tech Lead Software Engineer</h4>
                                    <div className='pricedate text-end'>
                                        <span>2 days ago</span>
                                        <h5>$20 / hr</h5>
                                    </div>

                                </div>
                                <p>
                                    {`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}

                                </p>


                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                        <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                    </div>


                                    <button className="btn rounded-pill btn-outline-info mt-2">View Details<Icon icon="ic:sharp-arrow-forward" /></button>


                                </div>

                            </div>

                        </div>
                    </div>

                </div>










                <div className='pagiandnumber d-flex justify-content-between px-lg-5 px-2 bg-black'>
                    <div className='Numbring d-flex align-items-center'>
                        <span>Show</span>
                        <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                            <option selected>3</option>
                            <option value="1">5</option>
                            <option value="2">20</option>
                            <option value="3">50</option>
                        </select>
                        <span>entries</span>
                    </div>
                    <div className='pagination'>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>






            </div>



        </>
    )
}

export default Home