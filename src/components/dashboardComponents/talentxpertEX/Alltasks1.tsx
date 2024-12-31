import React from 'react'
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';


export const Alltasks1 = () => {
    return (
        <div>
            <div className='card'>
                <div className=' tab-card first-card card-header  '>
 
                    <ul className="nav nav-pills mt-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active " id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">All00000000000000000</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">In Progress</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Posted</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Completed</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Closed</button>
                        </li>

                    </ul>

                    <div className='card-bodyy p-2'>
                        <div className='filtersearch d-flex align-items-center justify-content-between flex-wrap p-2'>

                            <div className='filters d-flex align-items-center flex-wrap '>
                                <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example">
                                    <option selected>Disability</option>
                                    <option value="1">Promoted</option>
                                </select>
                                <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example">
                                    <option selected>Price</option>
                                    <option value="1">$20 to $40</option>
                                    <option value="1">$40 to $50</option>
                                    <option value="1">$50 to $100</option>
                                </select>
                                <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example">
                                    <option selected>Category</option>
                                    <option value="1">Wordpress</option>
                                    <option value="1">Angular react</option>
                                </select>


                            </div>

                            <div className="searchBar">
                                <input id="searchQueryInput" type="text" name="searchQueryInput" placeholder="Search" value="" />
                                <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit">
                                    <Icon className='me-4' icon="fluent:search-48-filled" />
                                </button>
                            </div>

                        </div>
                    </div>


                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>


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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                                    <button className="btn btn-success ls mt-1 ms-5">Completed</button>


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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                                    <button className="btn btn-warning ls mt-1 ms-5">Posted</button>


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

                        </div>
                        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>

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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                            <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                            <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                            <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
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

                        </div>
                        <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabIndex={0}>


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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                                    <button className="btn btn-warning ls mt-1 ms-5">Posted</button>


                                                </div>

                                                <div className='pricedate text-end'>
                                                    <span>2 days ago</span>
                                                    <h5>$20 / hr</h5>
                                                </div>

                                            </div>
                                            <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                                    <button className="btn btn-warning ls mt-1 ms-5">Posted</button>


                                                </div>

                                                <div className='pricedate text-end'>
                                                    <span>2 days ago</span>
                                                    <h5>$20 / hr</h5>
                                                </div>

                                            </div>
                                            <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
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
                                                <div className='inerprofile text-end'>                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className=" user-img img-round"
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
                                                    <button className="btn btn-warning ls mt-1 ms-5">Posted</button>


                                                </div>

                                                <div className='pricedate text-end'>
                                                    <span>2 days ago</span>
                                                    <h5>$20 / hr</h5>
                                                </div>

                                            </div>
                                            <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
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

                        </div>

                    </div>


                    <div className='card-right-heading d-flex justify-content-between'>


                    </div>

                </div>













                <div className='pagiandnumber d-flex flex-wrap justify-content-around justify-content-md-between align-items-baseline py-2 px-lg-5 px-2 bg-black'>
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
        </div>
    )
}
