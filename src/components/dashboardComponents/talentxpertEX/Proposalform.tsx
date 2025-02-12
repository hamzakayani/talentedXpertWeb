'use client'
import React, { FC, useEffect, useState } from 'react'
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
import FileUpload from '@/components/common/upload/FileUpload';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';
import DocumentUploadTable from '@/components/common/DocumentUploadTable/DocumentUploadTable';
import ListCards from '../Articles/ListCards';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import GlobalLoader from '@/components/common/GlobalLoader/GlobalLoader';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('@/components/common/TextEditor/TextEditor'), { ssr: false });

type FormSchemaType = z.infer<typeof addproposalSchema>

export const Proposalform: FC<any> = ({ type }) => {
    const user = useSelector((state: RootState) => state.user)
    const [editorTxt, setEditorTxt] = useState('');
    const [taskdetail, setTaskDetail] = useState<any>()
    const [documents, setDocuments] = useState<any>([])
    const [articleId, setArticleId] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)

    const { id, proposalId } = useParams()
    const dispatch = useAppDispatch();
    const router = useRouter()


    const getProposal = async () => {
        try {
            const response = await apiCall(requests?.getProposals, { id: Number(proposalId) }, 'get', false, dispatch, user, router);
            if (response?.data?.data?.proposals[0]) {
                setValue('details', response?.data?.data?.proposals[0].details || '');
                setValue('amount', (response?.data?.data?.proposals[0].amount.toString()) || '');
                setValue('answers', response?.data?.data?.proposals[0].answers)
                setValue('documents', response?.data?.data?.proposals[0].documents || [])
                setDocuments(response?.data?.data?.proposals[0].documents || [])
                if (response?.data?.data?.proposals[0]?.articles[0]) {
                    const articleIds = response?.data?.data?.proposals[0]?.articles.map(
                        (article: any) => article?.articleId
                    );
                    setArticleId((prev: any) => [...prev, ...articleIds]);
                }
                setEditorTxt(response?.data?.data?.proposals[0].details )
            }
        } catch (error) {
            console.warn("Error fetching proposal:", error);
        }
    }

    const { register, formState: { errors }, reset, handleSubmit, setValue, getValues, watch } = useForm<FormSchemaType>({
        defaultValues: {
            details: '',
            amount: '',
            expertProfileId: user?.profile[0]?.id?.toString() || '',
            teamId: '',
            taskId: id?.toString(),
            status: 'SUBMITTED',
            answers: []

        },
        resolver: zodResolver(addproposalSchema),
        mode: 'all'
    })

    useEffect(() => {
        if (articleId) {
            setValue('articles', articleId)
        }
    }, [articleId])

    useEffect(() => {
        if (editorTxt) {
            setValue('details', editorTxt)
        }
    }, [editorTxt])

    console.log('err', errors)
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        const formData = dataForServer(data)

        await apiCall(`${type ? requests.updateProposal + proposalId : requests.addProposal}`, formData, `${type ? 'put' : 'post'}`, true, dispatch, user, router).then((res: any) => {
            let message: any;
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
                toast.success(res?.data?.message)
                reset({})
                type ? router.push(`/dashboard/tasks/${id}/proposals/${proposalId}`) : router.push(`/dashboard/tasks/${id}`);

            }
        }).catch(err => {
            // setIsFormSubmitted(false)
            console.warn(err)
        })
    }

    const getTask = async (id: number) => {
        await apiCall(requests.getTaskId + id, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setTaskDetail(res?.data?.data?.task || [])
        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        getTask(Number(id));
        if (type) {
            getProposal()
        }
    }, [])

    const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
        const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0
        const temp: any = [...documents, ...uploadedFileIds];
        setDocuments(temp)
        if (uploadedFileIds.length > 0) {
            setValue('documents', temp)
        }
        return uploadedFileIds;
    }

    const handleDeleteFile = (id: any) => {
        const updatedDocuments = documents.filter((doc: any) => doc.fileUrl !== id);
        setDocuments(updatedDocuments);
        setValue('documents', updatedDocuments)
    };



    const handleGenerateAI = async () => {
        setLoading(true)
        if (taskdetail) {
            const response = await apiCall(requests.createProposalDescription, { prompt: `${taskdetail?.details}` }, 'post', false, dispatch, null, null)
            if (response?.data?.proposal) {
                setEditorTxt(response?.data?.proposal)
                setValue('details', response?.data?.proposal || '')
            }
            setLoading(false)
        }
    }

    const handleEditorTxt = (value: any) => {
        setEditorTxt(value.replace(/<[^>]*>/g, '').trim() !== '' ? value : '')
    }


    useEffect(() => {
        taskdetail?.interviewQuestions?.forEach((data: any, index: number) => {
            setValue(`answers.${index}.questionId`, data?.id || 0);
        });
    }, [taskdetail, setValue]);

    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    <h5 className='mb-0'>{type ? 'Edit Proposal' : 'Submit Proposal'}</h5>
                </div>
                <div className="card-body bg-gray">
                    <div className="card bg-dark">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label className="form-label text-light fs-12">Description <span style={{ color: 'red' }}>*</span></label>
                                            {/* <textarea {...register('details')} className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea" rows={6}></textarea> */}
                                            <QuillEditor
                                                className="text-white invert border-0"
                                                style={{ height: '250px' }}
                                                placeholder="Write your description here..."
                                                value={editorTxt}
                                                setValue={handleEditorTxt}
                                            />
                                            <div className='d-flex justify-content-end align-items-center mt-1 mb-3'>
                                                <p className='btn text-info btn-sm rounded-pill p-0' onClick={handleGenerateAI} >Generate through AI</p>
                                            </div>
                                            {
                                                errors.details && (
                                                    <div className="text-danger pt-2">{errors.details.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Amount <span style={{ color: 'red' }}>*</span></label>
                                            <input {...register('amount')} type="text" className="form-control bg-dark-gray border-0 w-50" id="exampleFormControlInput1" placeholder="$20K" />
                                            {
                                                errors?.amount && (
                                                    <div className="text-danger pt-2">{errors?.amount?.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className='mb-3'>

                                            <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="task" />

                                            {/* <label className="form-label text-light fs-12">File Upload :</label>
                                            <div className="d-grid gap-2">
                                                <button className="btn bg-light text-dark fs-12 w-50 rounded-pill" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
                                            </div> */}
                                        </div>
                                        <DocumentUploadTable documents={documents} handleDeleteFile={handleDeleteFile} type={'Document'} />
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="card bg-dark-gray mb-3">
                                            <div className="card-body bg-gray">
                                                <h6 className='text-light fw-light ms-4 mb-3'>My Articles</h6>
                                                <ListCards type={'small'} checkbox={true} setArticleId={setArticleId} articleId={articleId} />
                                                {/* <div className="form-check mb-2">
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
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        {taskdetail?.interviewQuestions[0]?.id && <h5 className='text-light mb-3'> Interview Questions</h5>}

                                        {taskdetail?.interviewQuestions?.map((data: any, index: number) => (
                                            <div className="mb-3" key={index}>
                                                <label htmlFor="exampleFormControlTextarea1" className="form-label fs-15 text-light mb-1">{data.question}</label>
                                                {data.type === 'TEXT' && (
                                                    <input
                                                        {...register(`answers.${index}.answer`)}
                                                        type="text"
                                                        className="form-control bg-dark-gray border-0"
                                                        placeholder="Your answer"
                                                    />
                                                )}

                                                {/* Textarea */}
                                                {data.type === 'TEXTAREA' && (
                                                    <textarea
                                                        {...register(`answers.${index}.answer`)}
                                                        className="form-control bg-dark-gray border-0"
                                                        placeholder="Write your answer here..."
                                                        rows={4}
                                                    />
                                                )}

                                                {/* Radio Buttons (Single Selection) */}
                                                {data.type === 'RADIO' && (
                                                    <div>
                                                        {data.options?.map((option: string, optIndex: number) => (
                                                            <div key={optIndex} className="form-check form-check-inline">
                                                                <input
                                                                    {...register(`answers.${index}.answer`)}
                                                                    type="radio"
                                                                    value={option}
                                                                    id={`radio-${index}-${optIndex}`}
                                                                    className="form-check-input"
                                                                />
                                                                <label htmlFor={`radio-${index}-${optIndex}`} className="form-check-label">
                                                                    <HtmlData data={option} className="text-white" />
                                                                    {/* {option} */}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Dropdown (Select Menu) */}
                                                {data.type === 'DROPDOWN' && (
                                                    <select {...register(`answers.${index}.answer`)} className="form-control bg-dark-gray border-0">
                                                        <option value="">Select an option</option>
                                                        {data.options?.map((option: string, optIndex: number) => (
                                                            <option key={optIndex} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}

                                                {/* Checkbox (Multiple Selection) */}
                                                {data.type === 'CHECKBOX' && (
                                                    <div>
                                                        {data.options?.map((option: string, optIndex: number) => (
                                                            <div key={optIndex} className="form-check form-check-inline">
                                                                <input
                                                                    // {...register(`answers.${index}.answer`, { valueAsArray: true })}
                                                                    type="checkbox"
                                                                    value={option}
                                                                    id={`checkbox-${index}-${optIndex}`}
                                                                    className="form-check-input"
                                                                />
                                                                <label htmlFor={`checkbox-${index}-${optIndex}`} className="form-check-label">
                                                                    <HtmlData data={option} className="text-white" />
                                                                    {/* {option} */}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* <textarea {...register(`answers.${index}.answer`)} className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea> */}

                                            </div>
                                        ))}
                                        {/* <div className="mb-3">
                                            <label htmlFor="exampleFormControlTextarea1" className="form-label fs-12 text-light mb-1">What is the question-answer relationship strategy?</label>
                                            <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlTextarea1" className="form-label fs-12 text-light mb-1">What is the question-answer relationship strategy?</label>
                                            <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea>
                                        </div> */}
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
                    {loading && <GlobalLoader />}
                </div>
            </div>
        </section >

    )
}
