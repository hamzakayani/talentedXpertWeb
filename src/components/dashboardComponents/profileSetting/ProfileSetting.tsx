'use client'
import React, { useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';
import FileUpload from '@/components/common/upload/FileUpload';
import { requests } from '@/services/requests/requests';
import apiCall from '@/services/apiCall/apiCall';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { editProfileSchema } from '@/schemas/editProfile-schema/editProfileSchema';
import { zodResolver } from '@hookform/resolvers/zod';

const ProfileSetting = () => {
    type FormSchematype = z.infer<typeof editProfileSchema>
    const [details, setDetails] = useState<any>()
    const [documents, setDocuments] = useState<any>({})
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    console.log('use', user)
    const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
        const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0
        console.log('uploadedFileIds', uploadedFileIds[0])
        setDocuments(uploadedFileIds[0])
        return uploadedFileIds;
    }

    const updateUser = async () => {
        try {
            const response = await apiCall(
                requests.editUser + user?.id,
                {},
                'get',
                false,
                dispatch,
                user,
                router
            );
            console.log('response', response)
        } catch (error) {
            console.warn("Error fetching tasks:", error);
        } finally {
            //   console.log(tasks)
        }
    };
    console.log('doc', documents)
    const { register, setValue } = useForm({
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            about: user?.about,
            confirmPassword: '',
            userType: user?.profileType,
            education: [{
                institution: '',
                degree: '',
                date: '',
            }],
            experience: [{
                companyName: '',
                role: '',
                startDate: '',
                endDate: '',
                description: '',
                id: 0,
            }],
            educationIdsToDelete: [],
            experienceIdsToDelete: [],
            disabilityDetail: '',
            mobile: 0,
            password: '',
            address: ''

        },
        resolver: zodResolver(editProfileSchema),
        mode: 'all',
    })






    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    Profile Settings
                </div>
                <form>
                    <div className="card-body bg-gray">
                        <div className='container'>
                            <div className='text-center mb-4 mt-1'>
                                <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="img" documents={documents} />
                            </div>

                            <div className='row'>

                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">First Name :</label>
                                        <input {...register('firstName')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="First Name" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Title :</label>
                                        <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Title" />
                                    </div>

                                    <div className=" mb-3">
                                        <label className="form-label text-light fs-12">About :</label>
                                        <textarea {...register('about')} className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="About" ></textarea>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Last Name :</label>
                                        <input {...register('lastName')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Last Name" />
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
                            <div className="experience-sec my-4 d-flex align-items-center justify-content-between">
                                <h3 className="mb-0">Experience</h3>
                                <Icon
                                    icon="line-md:plus-square-filled"
                                    width={28}
                                    height={28}
                                    style={{ cursor: 'pointer', color: 'white' }}
                                />
                            </div>
                            {/* <div className='experience-sec my-4'>
                                <h3>Experience</h3>
                            </div> */}
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
                </form>
            </div>
        </section>
    )
}

export default ProfileSetting