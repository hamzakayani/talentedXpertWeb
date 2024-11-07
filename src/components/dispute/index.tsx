import React from 'react'
import { Icon } from '@iconify/react';
import Image from 'next/image';


const Dispute = () => {
    return (
        <div>
            <div className='card'>
                <div className='first-card card-header d-lg-flex d-md-flex d-sm-flex justify-content-between px-4 bg-gray'>
                    <div className='card-left-heading'>
                        <h3>Dispute</h3>
                    </div>

                    <div className='card-right-heading d-flex justify-content-between bg-info dispute-btn card-right-heading bg-info text-white  d-flex justify-content-between add-new ' >
                        <span className='' data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Add New Dispute</span>
                        <Icon icon="line-md:plus-square-filled" className='text-black' width={32} height={32} />
                    </div>
                </div>

                <div className='card-bodyy my-active-task py-1 '>
                    <div className="box mx-3 my-2  ">

                        <div className='row mx-3'>

                            <div className='col-auto ms-0 ps-0'>

                                <div className='text-lg-end card-profile  mt-4 '>
                                    <div className=' text-lg-end'>                                                <Image
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
                            <div className='col pe-4 '>
                                <div className='priceanddate d-flex justify-content-between bordr'>
                                    <div className='d-flex flex-wrap align-items-baseline'>
                                        <h4>Tech Lead Software Engineer</h4>
                                    </div>
                                    <div className=''>
                                    <button className="btn btn-danger ls mt-1 me-2 me-lg-0">Dispute Initiated</button>
                                    </div>

                                    <div className='pricedate text-lg-end'>
                                        <span>2 days ago</span>
                                        <h5>$20 / hr</h5>
                                    </div>

                                </div>
                            

                            </div>

                        </div>

<div className='mx-2 mx-lg-3 truncate-overflow '>

<p>{
                                    `A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}

                                </p>
                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>
                                    </div>
                                    <button className="btn rounded-pill btn-outline-info mt-2" >View Details<Icon icon="ic:sharp-arrow-forward" /></button>

                                </div>
</div>






                    </div>

                </div>
                

               

               
            </div>
            <div className='ad-dispute'>
                <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Add Dispute</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Reason</label>
                                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Reason" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>
                                </div>
                               
                                <div className="d-grid gap-2">
                                                            <button className="btn bg-dark text-light fs-12" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
                                                        </div>

                            </div>
                            <div className="modal-footer">
                                <div className="d-grid gap-2">
                                    
                                </div>
                                <button type="button" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
              



               
            </div>
        </div>





    )
}

export default Dispute
