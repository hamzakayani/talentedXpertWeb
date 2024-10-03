import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';

const ProfileSetting = () => {
    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    Profile Setting
                </div>
                <div className="card-body bg-gray">





                    <div className='container'>

                        <div className='text-center mb-4 mt-1'>
                            
                                    <Image
                                        src="/assets/images/uploadimg.svg"
                                        alt="img"
                                        className="img-fluid ribbon-img"
                                        width={100}
                                        height={100}
                                        priority
                                    />
                                </div>

                                <div className='row'>

                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">First Name :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="First Name" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Title :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Title" />
                                        </div>

                                        <div className=" mb-3">
                                            <label className="form-label text-light fs-12">About :</label>
                                            <textarea className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="About"></textarea>
                                        </div>


                                    </div>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Last Name :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Last Name" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-light fs-12">Email :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Email" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-light fs-12">Zip Code :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Zip Code" />
                                        </div>
                                    </div>
                                </div>

                                <div className='bordr mt-4'></div>
                                <div className='experience-sec my-4'>
                                    <h3>Experience</h3>
                                </div>


                                <div className='row'>

                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Job Title :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Job Title" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Company Name :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Company Name" />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label text-light fs-12">Start Date :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Start Date" />
                                        </div>
                                        <div className=" mb-3">
                                            <label className="form-label text-light fs-12">Job Description :</label>
                                            <textarea className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="Job Description"></textarea>
                                        </div>



                                    </div>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Employment type :</label>
                                            <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                <option selected>Full-time</option>
                                                <option value="1">Part-time</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-light fs-12">Location type :</label>
                                            <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                <option selected>On-site</option>
                                                <option value="1">Remote</option>
                                            </select>

                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-light fs-12">End Date :</label>
                                            <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="End Date" />
                                        </div>
                                        <div className='button d-flex justify-content-end'>
                                            <div className='mb-3'></div>
                                            <button className="btn rounded-pill btn-outline-info  ls">Discard</button>
                                            <button className="btn btn-info rounded-pill hero-btn ms-4">Save</button>
                                        </div>
                                    </div>



                                </div>











                        </div>

                    </div>

                </div>
        </section>
    )
}

export default ProfileSetting