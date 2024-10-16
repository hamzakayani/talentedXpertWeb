'use client'
import React from 'react'
import { Icon } from '@iconify/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addproposalSchema } from '@/schemas/addproposal-schema/addproposalSchema';
import { z } from 'zod';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { dataForServer } from '@/models/proposalModel/proposalModel';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { toast } from 'react-toastify';


export const Proposalform = () => {

    type FormSchemaType = z.infer<typeof addproposalSchema>
    const user = useSelector((state: RootState) => state.user)
    const { id } = useParams()
    const dispatch = useAppDispatch();
    const router = useRouter() 

    const { register, formState: { errors }, reset, handleSubmit } = useForm<FormSchemaType>({
        defaultValues: {
            details: '',
            amount: '',
            expertProfileId: user?.profile[0]?.id?.toString() || '',
            teamId: '',
            taskId: id?.toString(),
            status: 'SUBMITTED'
        },
        resolver: zodResolver(addproposalSchema),
        mode: 'all'
    })
    console.log('aa')
    console.log('Params ID:', id)
    console.log('user', user)

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        // setIsFormSubmitted(true)

        console.log('aba', data)
        const formData = dataForServer(data)
        console.log('formData', formData)

        await apiCall(requests.addProposal, formData, 'post', true, dispatch, user, router).then((res: any) => {
            let message: any;
            console.log(res)
            if (res?.error) {
                message = res?.error?.message;

                if (Array.isArray(message)) {
                    message?.map((msg: string) => toast.error(msg ? msg : 'Something went wrong, please try again'));
                } else {
                    toast.error(message ? message : 'Something went wrong, please try again')
                }
                // setIsFormSubmitted(false)
            } else {
                // setIsFormSubmitted(false)
                reset({})
                router.push('/dashboard/tasks')

            }
        }).catch(err => {
            // setIsFormSubmitted(false)
            console.warn(err)
        })
    }


    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    <h5 className='mb-0'>Proposal Form</h5>
                </div>
                <div className="card-body bg-gray">
                    <div className="card bg-dark">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label className="form-label text-light fs-12">Description :</label>
                                            <textarea {...register('details')} className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea" rows={6}></textarea>
                                            {
                                                errors.details && (
                                                    <div className="text-danger pt-2">{errors.details.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Amount :</label>
                                            <input {...register('amount')} type="text" className="form-control bg-dark-gray border-0 w-50" id="exampleFormControlInput1" placeholder="$20K" />
                                            {
                                                errors?.amount && (
                                                    <div className="text-danger pt-2">{errors?.amount?.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className='mb-3'>
                                            <label className="form-label text-light fs-12">File Upload :</label>
                                            <div className="d-grid gap-2">
                                                <button className="btn bg-light text-dark fs-12 w-50 rounded-pill" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card bg-dark-gray mb-3">
                                            <div className="card-body bg-gray">
                                                <h6 className='text-light fw-light ms-4 mb-3'>My Articles</h6>
                                                <div className="form-check mb-2">
                                                    <input className="form-check-input bg-transparent border-light" type="checkbox" value="" id="flexCheckDefault" />
                                                    <label className="form-check-label text-light fs-14" htmlFor="flexCheckDefault">
                                                        Write headlines with words that resonate
                                                    </label>
                                                    <div className='border-bottom my-2'></div>
                                                    <p className='text-light fs-12'>It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of ...</p>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input className="form-check-input bg-transparent border-light" type="checkbox" value="" id="flexCheckDefault" />
                                                    <label className="form-check-label text-light fs-14" htmlFor="flexCheckDefault">
                                                        Focus on clarity for web content
                                                    </label>
                                                    <div className='border-bottom my-2'></div>
                                                    <p className='text-light fs-12'>{`Explaining your product or service can get cumbersome, but it shouldn’t if you want the audience to quickly understand...`}</p>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input className="form-check-input bg-transparent border-light" type="checkbox" value="" id="flexCheckDefault" />
                                                    <label className="form-check-label text-light fs-14" htmlFor="flexCheckDefault">
                                                        Write to win over readers
                                                    </label>
                                                    <div className='border-bottom my-2'></div>
                                                    <p className='text-light fs-12'>This ad for the Content Marketing Institute newsletter works well as a sample of website content writing. By ...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <h6 className='text-light mb-3'> Interview Questions</h6>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlTextarea1" className="form-label fs-12 text-light mb-1">What is the question-answer relationship strategy?</label>
                                            <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlTextarea1" className="form-label fs-12 text-light mb-1">What is the question-answer relationship strategy?</label>
                                            <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlTextarea1" className="form-label fs-12 text-light mb-1">What is the question-answer relationship strategy?</label>
                                            <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea>
                                        </div>
                                        {/* <div className='mb-3'>
                                        <p className='text-light fs-12 mb-1'>What is the question-answer relationship strategy?</p>
                                        <p className='answer-proposal text-light fs-12 mb-0'>aaaaaa</p>
                                    </div> */}
                                    </div>
                                    <div className='text-end'>
                                        <button className="btn btn-outline-info text-light fs-12 rounded-pill fw-light" type="submit"> Submit Proposal</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section >

    )
}
