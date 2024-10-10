import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';

const Talentedxperts = () => {
    return (
        <div>
            <div className='card'>
                <div className='card first-card card-header'>
                    <h3>TalentedXperts</h3>
                </div>
                <div className='card-bodyy p-2'>
                    <div className='filtersearch d-flex align-items-center justify-content-between flex-wrap p-2'>

                        <div className='filters d-flex align-items-center '>

                            <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                                <option selected>Disability</option>
                                <option value="1">Promoted</option>
                            </select>

                            <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                                <option selected>Rating</option>
                                <option value="1">2 star</option>
                                <option value="1">4 star</option>

                            </select>
                            <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                                <option selected>Earning</option>
                                <option value="1">$100 to $200</option>
                                <option value="1">$400 to $1000</option>
                            </select>
                            <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                                <option selected>Category 1</option>
                                <option >Category 2</option>

                            </select>


                        </div>

                        <div className="searchBar">
                            <form className="search-container">
                                <input type="text" className='text-light' id="search-bar" placeholder="Search here" />
                                <a href="#"> <Icon className='search-icon' icon="clarity:search-line" /> </a>
                            </form>
                        </div>

                    </div>
                </div>

                <div className='card-bodyy my-active-task py-2 '>


                    <div className='row'>
                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">
                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
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

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}
                                </p>
                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>
                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/message'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>
                                    </div>
                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/talendxperts/viewProfile'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">
                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/talendxperts/viewProfile'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>
                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">






                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />


                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>






















                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>

                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">






                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />


                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>






















                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>
                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">






                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />


                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>






















                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>
                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">






                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />


                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>






















                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>





                    </div>









                </div>


            </div>
        </div>
    )
}

export default Talentedxperts
