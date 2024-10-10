'use client'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { addtaskSchema } from '@/schemas/addtask-schema/addtaskSchema';
import { z } from 'zod';
import Questions from './Questions';
import { dataForServer } from '@/models/taskModel/taskModel';
import toast from 'react-hot-toast';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';


type FormSchemaType = z.infer<typeof addtaskSchema>

export const FormTask = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
    const [questionsArr, setQuestionsArr] = useState<any>([])
    const [categories, setcategories] = useState<any>([])
    const user = useSelector((state: RootState) => state.user)

    const { register, handleSubmit, setValue, formState: { errors, }, reset, watch } = useForm<FormSchemaType>({
        defaultValues: {
            name: '',
            amount: '',
            details: '',
            startDate: '',
            endDate: '',
            amountType: '',
            taskType: '',
            status: 'POSTED',
            documents: '',
            interviewQuestions: [],
            city: '',
            state: '',
            zip: '',
            street: '',
            country: '',
            address: '',
            // addInterview: false,
            categoryId: '',
            industryId: '',
            requesterProfileId: user?.profile?.id?.toString() || '',

        },
        resolver: zodResolver(addtaskSchema),
        mode: 'all',
    });

    // const addInterviewChecked = watch('addInterview')

    useEffect(() => { 
        getCategory(1)     
    }, [])
    
    const getCategory = async (level:number) => {
        await apiCall(`${requests.getCategory}?level=${level}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setcategories(res?.data || [])
            
        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        if (user?.profile[0]?.id) {
            setValue('requesterProfileId', user?.profile[0]?.id?.toString())
        }
    }, [user])

    


    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setIsFormSubmitted(true)

        const formData = dataForServer(data)

        await apiCall(requests.addtask, formData, 'post', true, dispatch, user, router).then((res: any) => {
            let message:any; 
            if (res?.error) {
                message = res?.error?.message;
                
                if (Array.isArray(message)) {
                    message?.map((msg: string) => (toast.error(msg ? msg : 'Something went wrong, please try again')));
                } else {
                    toast.error(message ? message : 'Something went wrong, please try again')
                }
                setIsFormSubmitted(false)
            } else {
                setIsFormSubmitted(false)
                reset({})
                // router.push('/dashboard/viewTasks')

            }
        }).catch(err => {
            setIsFormSubmitted(false)
            console.warn(err)
        })
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
                                                        {
                                                            errors.name && (
                                                                <div className="text-danger pt-2">{errors.name.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlTextarea1" className="form-label text-light fs-12">Task Details :</label>
                                                        <textarea {...register('details')} className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="Task details"></textarea>
                                                        {
                                                            errors.details && (
                                                                <div className="text-danger pt-2">{errors.details.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className='mb-3'>
                                                        <label className="form-label text-light fs-12">Task Details :</label>
                                                        <div className="d-grid gap-2">
                                                            <button className="btn bg-dark text-light fs-12" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <div className='mb-3'>
                                                        <div className='d-flex align-items-center '>
                                                            <label className='text-light fs-12 me-2'>Amount :</label>
                                                            <div className="form-check me-3">
                                                                <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                                    <input {...register('amountType')} className="form-check-input" value={"FIXED"} type="radio" name="amountType" id="amountType" />
                                                                    Fixed
                                                                </label>
                                                            </div>
                                                            <div className="form-check me-3">
                                                                <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                                    <input {...register('amountType')} className="form-check-input" value="HOURLY" type="radio" name="amountType" id="amountType" />
                                                                    Hourly
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {
                                                            errors.amountType && (
                                                                <div className="text-danger pt-2">{errors.amountType.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Amount :</label>
                                                        <input {...register('amount')} type="number" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Add amount" />
                                                        {
                                                            errors.amount && (
                                                                <div className="text-danger pt-2">{errors.amount.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task Start Date :</label>
                                                        <input {...register('startDate')} type="date" className="form-control bg-dark border-0" id="exampleFormControlInput1" />
                                                        {
                                                            errors.startDate && (
                                                                <div className="text-danger pt-2">{errors.startDate.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task End Date :</label>
                                                        <input {...register('endDate')} type="date" className="form-control bg-dark border-0" id="exampleFormControlInput1" />
                                                        {
                                                            errors.endDate && (
                                                                <div className="text-danger pt-2">{errors.endDate.message}</div>
                                                            )
                                                        }
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
                                                            <option value={''}>Category Type</option>
                                                            {categories.map((data:any) => <option value={data?.id} key={data?.id}>{data?.name}</option>)}
                                                        

                                                        </select>
                                                        {
                                                            errors.categoryId && (
                                                                <div className="text-danger pt-2">{errors.categoryId.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">Sub-task category 1 :</label>
                                                        <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                            <option value={''}>Task Category</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <h6 className='text-light fs-14'>Industry</h6>
                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">Major Industry :</label>
                                                        <select {...register('industryId')} className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                            <option value={''}>industry</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                        {
                                                            errors.industryId && (
                                                                <div className="text-danger pt-2">{errors.industryId.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">Sub-industry 1 :</label>
                                                        <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                            <option value={''}>industry</option>
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
                                            <div className='mb-3'>
                                                <div className='d-flex align-items-center'>
                                                    <label className='text-light fs-12 me-2'>Task location :</label>
                                                    <div className="form-check me-3">
                                                        <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                            <input {...register('taskType')} className="form-check-input" value={"ONLINE"} type="radio" name="taskType" id="flexRadioDefault2" />
                                                            Online
                                                        </label>
                                                    </div>
                                                    <div className="form-check me-3">
                                                        <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                            <input {...register('taskType')} className="form-check-input" value={"ONSITE"} type="radio" name="taskType" id="flexRadioDefault2" />
                                                            Onsite
                                                        </label>
                                                    </div>
                                                </div>
                                                {
                                                    errors.taskType && (
                                                        <div className="text-danger pt-2">{errors.taskType.message}</div>
                                                    )
                                                }
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
                                                        {
                                                            errors.city && (
                                                                <div className="text-danger pt-2">{errors.city.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">Country :</label>
                                                        <select {...register('country')} className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                            <option value={''}>Country</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                        {
                                                            errors.country && (
                                                                <div className="text-danger pt-2">{errors.country.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Address :</label>
                                                        <input {...register('address')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Address" />
                                                        {
                                                            errors.address && (
                                                                <div className="text-danger pt-2">{errors.address.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">State/Province :</label>
                                                        <select {...register('state')} className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                            <option value={''}>State</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                        {
                                                            errors.state && (
                                                                <div className="text-danger pt-2">{errors.state.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">ZIP Code/ Postal Code :</label>
                                                        <select {...register('zip')} className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                            <option value={''}>Zip Code</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                        {
                                                            errors.zip && (
                                                                <div className="text-danger pt-2">{errors.zip.message}</div>
                                                            )
                                                        }
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
                                            {/* <div className='d-flex align-items-center mb-3'>
                                                <input {...register('addInterview')} type='checkbox' className='text-light fs-14 me-2' />
                                                <label className='text-light fs-14 me-2'>Add interview questions</label>
                                            </div> */}
                                            
                                                <Questions questionsArr={questionsArr} setQuestionArr={setQuestionsArr} setValue={setValue} errors={errors} />
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=' text-end'>
                            <button type="submit" disabled={isFormSubmitted} className="btn btn-info btn-sm rounded-pill">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
