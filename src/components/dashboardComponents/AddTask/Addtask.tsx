'use client'
import React, { useState } from 'react'
import { Icon } from '@iconify/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { addtaskSchema } from '@/schemas/addtask-schema/addtaskSchema';
import { z } from 'zod';


type FormSchemaType = z.infer<typeof addtaskSchema>

export const Addtask = () => {
    const [formData, setFormData] = useState<any>({});
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormSchemaType>({
        defaultValues: {
            name : '',
            amount : 0,
            taskDetails : '',
            startDate: '', 
            endDate: '',
            amountType: 'FIXED',
            taskType: 'ONLINE', 
            status: 'CLOSED', 
            documents: '', 
            interviewQuestions: [],
            city: '',
            state: '',
            zip: '',
            street: '',
            country: '',
            address: '',
            addInterview :false,
            categoryId: '',
            industryId: '',
        },
        resolver: zodResolver(addtaskSchema),
        mode: 'all',
      });
      const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {

      }


    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    Add New Task
                </div>
                <div className="card-body bg-gray">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item mb-2 border-dark border-2">
                            <h2 className="accordion-header">
                                <button className="accordion-button bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Task Info
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div className="accordion-body bg-gray">
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task Name :</label>
                                                    <input {...register('name')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Task name" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlTextarea1" className="form-label text-light fs-12">Task Details :</label>
                                                    <textarea {...register('taskDetails')} className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="Task details"></textarea>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="form-label text-light fs-12">Task Details :</label>
                                                    <div className="d-grid gap-2">
                                                        <button className="btn bg-dark text-light fs-12" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className='d-flex align-items-center mb-3'>
                                                    <label className='text-light fs-12 me-2'>Amount :</label>
                                                    <div className="form-check me-3">
                                                        <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                            <input {...register('amountType')} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                                                            Fixed
                                                        </label>
                                                    </div>
                                                    <div className="form-check me-3">
                                                        <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                            <input {...register('amountType')} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                            Hourly
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Amount :</label>
                                                    <input {...register('amount')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Add amount" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task Start Date :</label>
                                                    <input {...register('startDate')} type="date" className="form-control bg-dark border-0" id="exampleFormControlInput1" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task End Date :</label>
                                                    <input {...register('endDate')}type="date" className="form-control bg-dark border-0" id="exampleFormControlInput1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item mb-2 border-dark border-2">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Category
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body bg-gray">
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <h6 className='text-light fs-14'>Category</h6>
                                                <div className="mb-3">
                                                    <label className="form-label text-light fs-12">Major task category :</label>
                                                    <select {...register('categoryId')} className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                        <option selected>Category Type</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-light fs-12">Sub-task category 1 :</label>
                                                    <select  className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                        <option selected>Task Category</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <h6 className='text-light fs-14'>Industry</h6>
                                                <div className="mb-3">
                                                    <label {...register('categoryId')} className="form-label text-light fs-12">Major Industry :</label>
                                                    <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                        <option selected>industry</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-light fs-12">Sub-industry 1 :</label>
                                                    <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                        <option selected>industry</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item mb-2 border-dark border-2">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Task Location
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body bg-gray">
                                    <div className='container'>
                                        <div className='d-flex align-items-center mb-3'>
                                            <label className='text-light fs-12 me-2'>Task location :</label>
                                            <div className="form-check me-3">
                                                <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                    <input {...register('taskType')}className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                                                    Online
                                                </label>
                                            </div>
                                            <div className="form-check me-3">
                                                <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                    <input {...register('taskType')} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                                                    Onsite
                                                </label>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Pin Your Location :</label>
                                                    <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Pin Location" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">City :</label>
                                                    <input {...register('city')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="City" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-light fs-12">Country :</label>
                                                    <select {...register('country')} className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                        <option selected>Country</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Address :</label>
                                                    <input {...register('address')}type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Address" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-light fs-12">State :</label>
                                                    <select {...register('state')}className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                        <option selected>State</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-light fs-12">Zip Code :</label>
                                                    <select {...register('zip')} className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                        <option selected>Zip Code</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item mb-2 border-dark border-2">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapsefour" aria-expanded="false" aria-controls="collapsefour">
                                    Would you like to add interview questions?
                                </button>
                            </h2>
                            <div id="collapsefour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body bg-gray">
                                    <div className='container'>
                                        <div className='d-flex align-items-center mb-3'>
                                            <label className='text-light fs-14 me-2'>Would you like to add interview questions?</label>
                                            <div className="form-check me-3">
                                                <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                    <input {...register('addInterview')} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="form-check me-3">
                                                <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                    <input {...register('addInterview')} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"  />
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                        <p className='text-light fs-12'>In case the user select’s “yes”, the system will display interview questions form</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                </div>

            </div>
        </section>
    )
}
