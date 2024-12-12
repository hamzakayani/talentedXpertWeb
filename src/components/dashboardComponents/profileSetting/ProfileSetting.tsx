'use client'
import React, { useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const ProfileSetting = () => {
    const [details, setDetails] = useState<any>()
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()

    console.log('use', user)
    




    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    Profile Settings
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
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="First Name" value={user?.firstName} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Title :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Title" />
                                </div>

                                <div className=" mb-3">
                                    <label className="form-label text-light fs-12">About :</label>
                                    <textarea className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="About" value={user?.about}></textarea>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Last Name :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Last Name" value={user?.lastName} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light fs-12">Email :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Email" readOnly value={user?.email} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light fs-12">Zip Code :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Zip Code" value={user?.address?.zip} />
                                </div>
                            </div>
                        </div>
                        <div className='bordr mt-4'></div>
                        <div className='experience-sec my-4'>
                            <h3>Education & Cerfification</h3>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Institution : :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Institution :" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light fs-12">Date :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="28/03/2024" />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-3">
                                    <label className="form-label text-light fs-12">Degree :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Degree" />
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
                               
                            </div>
                        </div>


                        <div className='bordr mt-4'></div>
                        <div className='experience-sec my-4'>
                            <h3>Other</h3>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">About :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="About" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Category :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Category" />
                                </div>
                              
                              
                                <div className='mb-3'>
                          <div className="form-check mb-3 text-light fs-12">
                            <input className="form-check-input bg-transparent border-light" type="checkbox" value="" id="isDisabled" />
                            <label className="form-check-label fw-medium" htmlFor="isDisabled">
                              I declare that I am a person with disability
                            </label>
                          </div>
                        </div>

                        <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Disability Detail :</label>
                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Disability Detail" />
                                </div>

                              
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Skills :</label>
                                    <select className="form-select bg-dark border-0 text-tertiary" aria-label="Skills">
                                        <option selected>Full-time</option>
                                        <option value="1">Part-time</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light fs-12">Sub Category :</label>
                                    <select className="form-select bg-dark border-0 text-tertiary" aria-label="Sub Category">
                                        <option selected>On-site</option>
                                        <option value="1">Remote</option>
                                    </select>
                                </div>
                            
                                <div className='button d-flex justify-content-end mt-5'>
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