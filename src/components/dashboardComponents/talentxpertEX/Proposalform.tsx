'use client'
import React, { FC, useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
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
import { useNavigation } from '@/hooks/useNavigation';
import BackButton from '@/components/common/backButton/BackButton';
import InputField from '@/components/common/InputField/InputField';
import { GenerateAIButton } from '@/components/common/generateAIButton/GenerateAIButton';
const QuillEditor = dynamic(() => import('@/components/common/TextEditor/TextEditor'), { ssr: false });

type FormSchemaType = z.infer<typeof addproposalSchema>

export const Proposalform: FC<any> = ({ type }) => {
    const user = useSelector((state: RootState) => state.user)
    const [editorTxt, setEditorTxt] = useState('');
    const [taskdetail, setTaskDetail] = useState<any>()
    const [documents, setDocuments] = useState<any>([])
    const [articleId, setArticleId] = useState<any>([])
    const [addTeam, setAddTeam] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [teams, setTeams] = useState<any>([]);
    const [showJobDetails, setShowJobDetails] = useState<boolean>(false);
    const [showInterviewQuestions, setShowInterviewQuestions] = useState<boolean>(true);
    const [showArticles, setShowArticles] = useState<boolean>(true);

    const { id, proposalId } = useParams()
    const dispatch = useAppDispatch();
    const router = useRouter()
    const { navigate } = useNavigation()

    const getAllTeams = async () => {
        try {
            setLoading(true);
            const response = await apiCall(
                requests.teams,
                { type: 'created' },
                'get',
                false,
                dispatch,
                user,
                router
            );
            setTeams(response?.data?.data)
        } catch (error) {
            console.warn("Error fetching teams:", error);
        } finally {
            setLoading(false);
        }
    }

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
                if (response?.data?.data?.proposals[0]?.teamId)
                    setAddTeam(true)
                setValue('teamId', response?.data?.data?.proposals[0]?.teamId || '')
                setEditorTxt(response?.data?.data?.proposals[0].details)
            }
        } catch (error) {
            console.warn("Error fetching proposal:", error);
        }
    }

    const { register, formState: { errors }, reset, handleSubmit, setValue, getValues, watch, control } = useForm<FormSchemaType>({
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

    // useEffect(() => {
    //     register('details')
    // }, [register])

    useEffect(() => {
        setValue('details', editorTxt, { shouldValidate: true })
    }, [editorTxt, setValue])

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
            } else {
                toast.success(res?.data?.message)
                reset({})
                type ? navigate(`/dashboard/tasks/${id}/proposals/${proposalId}`) : navigate(`/dashboard/tasks/${id}`);
            }
        }).catch(err => {
            console.warn(err)
        })
    }
    useEffect(() => {
        console.log('errors', errors, getValues())
    }, [errors])

    const getTask = async (id: number) => {
        await apiCall(requests.getTaskId + id, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setTaskDetail(res?.data?.data?.task || [])
        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        getTask(Number(id));
        getAllTeams()
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
            if (response?.data) {
                setEditorTxt(response?.data)
                setValue('details', response?.data || '')
            }
            setLoading(false)
        }
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddTeam(e.target.checked);
    }

    const handleEditorTxt = (value: any) => {
        const cleanValue = value.replace(/<[^>]*>/g, '').trim() !== '' ? value : ''
        setEditorTxt(cleanValue)
        setValue('details', cleanValue, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }

    const toggleJobDetails = () => {
        setShowJobDetails(!showJobDetails)
    }

    const toggleInterviewQuestions = () => {
        setShowInterviewQuestions(!showInterviewQuestions)
    }

    const toggleArticles = () => {
        setShowArticles(!showArticles)
    }

    useEffect(() => {
        taskdetail?.interviewQuestions?.forEach((data: any, index: number) => {
            setValue(`answers.${index}.questionId`, data?.id || 0);
        });
    }, [taskdetail, setValue]);

    return (
        <section style={{
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            color: 'white',
            padding: '20px'
        }}>
            <div>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '30px'
                }}>
                    <BackButton fontSize="24px" color="white" />
                    <h2 style={{ margin: 0, color: 'white' }}>
                        {type ? 'Edit Proposal' : 'Submit Proposal'}
                    </h2>
                </div>

                {/* Job Details Section */}
                <div style={{ marginBottom: '30px' }}>
                    <div
                        style={{
                            width: '100%',
                            height: '43px',
                            borderRadius: showJobDetails ? '8px 8px 0 0' : '8px',
                            backgroundColor: '#333333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 20px',
                            marginBottom: showJobDetails ? '0' : '20px',
                            cursor: 'pointer',
                            border: '1px solid #444',
                            borderBottom: showJobDetails ? 'none' : '1px solid #444'
                        }}
                        onClick={toggleJobDetails}
                    >
                        <h3 style={{
                            margin: 0,
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600'
                        }}>
                            Job Details
                        </h3>
                        <Icon
                            icon={showJobDetails ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                            width="20"
                            color="white"
                        />
                    </div>

                    {showJobDetails && (
                        <div style={{
                            width: '100%',
                            borderRadius: '0 0 8px 8px',
                            backgroundColor: '#333333',
                            borderTop: 'none',
                            padding: '20px',
                            border: '1px solid #444',
                            maxHeight: '70vh',
                            overflowY: 'auto'
                        }}>
                            <div className="mb-3">
                                <h4 style={{ color: 'white', margin: 0 }}>{taskdetail?.name ?? ''}</h4>
                            </div>
                            <div className="d-flex flex-wrap gap-3 mb-3" style={{ color: '#ccc', fontSize: 14 }}>
                                <span>Type: <span style={{ color: 'white' }}>{taskdetail?.amountType || '-'}</span></span>
                                <span>Budget: <span style={{ color: 'white' }}>{taskdetail?.amount ?? '-'}</span></span>
                                {taskdetail?.duration && (
                                    <span>Duration: <span style={{ color: 'white' }}>{taskdetail?.duration}</span></span>
                                )}
                                <span>Platform Fee: <span style={{ color: 'white' }}>{taskdetail?.platformFee ?? '-'}</span></span>
                                <span>Net Earnings: <span style={{ color: 'white' }}>{taskdetail?.earnedNetAmount ?? '-'}</span></span>
                            </div>
                            {Array.isArray(taskdetail?.skills) && taskdetail.skills.length > 0 && (
                                <div className="mb-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {taskdetail.skills.map((sk: any, idx: number) => (
                                        <span key={idx} style={{
                                            padding: '4px 10px',
                                            backgroundColor: '#1B1B1B',
                                            border: '1px solid #444',
                                            borderRadius: 999,
                                            color: '#ddd',
                                            fontSize: 12
                                        }}>{sk?.name || sk}</span>
                                    ))}
                                </div>
                            )}
                            <div>
                                <HtmlData data={taskdetail?.details || ''} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Description Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label text-light fs-14 mb-0">
                                Proposal Description <span style={{ color: 'red' }}>*</span>
                            </label>
                        </div>
                        <QuillEditor
                            className="bg-white text-white invert border-0"
                            style={{ height: '250px', backgroundColor: 'transparent' }}
                            placeholder="Write a clear, concise proposal that addresses the client's needs..."
                            value={editorTxt}
                            setValue={handleEditorTxt}
                        />
                        <div className="d-flex justify-content-between mt-2"> 
                            {errors?.details && (
                                <div className="text-danger fs-12">{errors?.details?.message}</div>
                            )} 
                            <GenerateAIButton 
                                handleClick={handleGenerateAI}
                                disabled={loading}
                                info={"Proposal Description will be generate based on the Task Description"}
                            />                          
                            {/* <button type="button" className="btn btn-outline-info-ai btn-sm rounded-pill d-flex align-items-center gap-1" onClick={handleGenerateAI}>
                                <Icon icon="mdi:sparkles" width="16" />
                                Generate with AI
                            </button> */}
                        </div>
                    </div>

                    {/* Price and Timeline Section */}
                    <div className='mb-3'>
                        <div>
                            <InputField
                                className="inputcontrol"
                                name="amount"
                                control={control}
                                label={'Amount'}
                                variant="outlined"
                                required
                                type="number"
                                placeholder={"Amount"}
                                inputProps={{ maxLength: 50 }}
                            />
                        </div>
                        {watch('amount') && (
                            <>
                                <div className='mt-1'>Bid Amount: <span style={{ color: 'white' }}>{watch('amount') ?? '-'}</span></div>
                                <div>Net Earnings: <span style={{ color: 'white' }}>{watch('amount') ? (Number(watch('amount')) - (Number(watch('amount')) * Number(10 / 100))) : '-'}</span></div>
                            </>
                        )}

                        {/* <div>
                            <label style={{ 
                                display: 'block', 
                                color: 'white', 
                                fontSize: '14px', 
                                marginBottom: '8px',
                                fontWeight: '500'
                            }}>
                                Timeline <span style={{ color: 'red' }}>*</span>
                            </label>
                                                    <input
                                                        type="text"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#2a2a2a',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="2-3 weeks"
                                defaultValue="2-3 weeks"
                            />
                        </div> */}
                    </div>

                    {/* File Upload Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{
                            border: '2px dashed #444',
                            borderRadius: '8px',
                            padding: '40px',
                            textAlign: 'center',
                            cursor: 'pointer'
                        }}>
                            <button
                                type="button"
                                style={{
                                    backgroundColor: 'rgb(26 26 26)',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '14px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    marginBottom: '12px',
                                    border: '0.5px solid #8A8A8A'

                                }}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                Add files
                            </button>
                            <input
                                id="fileInput"
                                type="file"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (files.length > 0) {
                                        handleFileSelect(files, [], () => { });
                                    }
                                }}
                            />
                            <div style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>
                                Upload project briefs, wireframes, references, or other relevant files
                            </div>
                            <div style={{ color: '#888', fontSize: '12px' }}>
                                Supported formats: PDF, DOC, Images, ZIP (Max 10MB each)
                            </div>
                        </div>
                    </div>

                    {/* Attachments Display */}
                    {documents && documents.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <DocumentUploadTable
                                documents={documents}
                                handleDeleteFile={handleDeleteFile}
                                type={'Documents'}
                            />
                        </div>
                    )}

                    {/* Submit as a Team Checkbox */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            color: 'white',
                            fontSize: '14px'
                        }}>
                            <input
                                type="checkbox"
                                checked={addTeam}
                                onChange={handleCheckboxChange}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    backgroundColor: '#2a2a2a',
                                    border: '1px solid #444',
                                    accentColor: 'rgb(0, 123, 255)'
                                }}
                            />
                            Submit as a Team
                        </label>
                    </div>

                    {/* Team Selection */}
                    {addTeam && (
                        <div style={{ marginBottom: '30px' }}>
                            <InputField
                                name="teamId"
                                control={control}
                                label="Team"
                                variant="outlined"
                                select
                                className="inputcontrol"
                                options={teams?.teams?.map((data: any) => ({
                                    id: data?.id,
                                    name: data?.name
                                })) || []}
                            />
                        </div>
                    )}

                    {/* Interview Questions Section */}
                    {taskdetail?.interviewQuestions && taskdetail.interviewQuestions.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '43px',
                                    borderRadius: showInterviewQuestions ? '8px 8px 0 0' : '8px',
                                    backgroundColor: '#333333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0 20px',
                                    marginBottom: showInterviewQuestions ? '0' : '20px',
                                    cursor: 'pointer',
                                    border: '1px solid #444',
                                    borderBottom: showInterviewQuestions ? 'none' : '1px solid #444'
                                }}
                                onClick={toggleInterviewQuestions}
                            >
                                <h3 style={{
                                    margin: 0,
                                    color: 'white',
                                    fontSize: '18px',
                                    fontWeight: '600'
                                }}>
                                    Interview Questions
                                </h3>
                                <Icon
                                    icon={showInterviewQuestions ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                                    width="20"
                                    color="white"
                                />
                            </div>

                            {showInterviewQuestions && (
                                <div style={{
                                    width: '100%',
                                    minHeight: '269px',
                                    marginTop: showInterviewQuestions ? '0' : '20px',
                                    borderRadius: showInterviewQuestions ? '0 0 8px 8px' : '8px',
                                    backgroundColor: '#333333',
                                    borderTop: showInterviewQuestions ? 'none' : '1px solid #444',
                                    padding: '20px',
                                    border: '1px solid #444',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                    gap: '24px'
                                }}>
                                    {taskdetail.interviewQuestions.slice(0, 4).map((data: any, index: number) => (
                                        <div key={index} style={{ marginBottom: '20px' }}>
                                            {data.type === 'TEXT' && (
                                                <InputField
                                                    name={`answers.${index}.answer`}
                                                    control={control}
                                                    label={data.question}
                                                    variant="outlined"
                                                    required
                                                    placeholder="Your Answer..."
                                                    className="inputcontrol"
                                                    inputProps={{ maxLength: 100 }}
                                                    sx={{
                                                        width: '100%',
                                                        '& .MuiInputLabel-root': {
                                                            color: 'white !important',
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            marginBottom: '8px'
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: 'white !important'
                                                        },
                                                        '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                                                            color: 'white !important'
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '79px',
                                                            backgroundColor: 'transparent',
                                                            borderRadius: '8px',
                                                            border: '1px solid #444',
                                                            '& fieldset': {
                                                                border: '1px solid #444'
                                                            },
                                                            '&:hover fieldset': {
                                                                border: '1px solid #555'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                border: '1px solid #007bff'
                                                            },
                                                            '&.Mui-focused:after': {
                                                                display: 'none'
                                                            }
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: 'white',
                                                            fontSize: '14px',
                                                            padding: '12px 14px'
                                                        },
                                                        '& .MuiInputLabel-shrink': {
                                                            backgroundColor: 'transparent'
                                                        }
                                                    }}
                                                />
                                            )}
                                            {data.type === 'TEXTAREA' && (
                                                <InputField
                                                    name={`answers.${index}.answer`}
                                                    control={control}
                                                    label={data.question}
                                                    variant="outlined"
                                                    required
                                                    multiline
                                                    rows={3}
                                                    placeholder="Your Answer..."
                                                    className="inputcontrol"
                                                    inputProps={{ maxLength: 500 }}
                                                    sx={{
                                                        width: '100%',
                                                        '& .MuiInputLabel-root': {
                                                            color: 'white !important',
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            marginBottom: '8px'
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: 'white !important'
                                                        },
                                                        '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                                                            color: 'white !important'
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'transparent',
                                                            borderRadius: '8px',
                                                            border: '1px solid #444',
                                                            '& fieldset': {
                                                                border: '1px solid #444'
                                                            },
                                                            '&:hover fieldset': {
                                                                border: '1px solid #555'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                border: '1px solid #007bff'
                                                            },
                                                            '&.Mui-focused:after': {
                                                                display: 'none'
                                                            }
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: 'white',
                                                            fontSize: '14px',
                                                            padding: '12px 14px'
                                                        },
                                                        '& .MuiInputLabel-shrink': {
                                                            backgroundColor: 'transparent'
                                                        }
                                                    }}
                                                />
                                            )}
                                            {data.type === 'RADIO' && (
                                                <div>
                                                    <label
                                                        style={{
                                                            display: 'block',
                                                            color: 'white',
                                                            fontSize: '14px',
                                                            marginBottom: '8px',
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        {data.question} <span style={{ color: 'red' }}>*</span>
                                                    </label>
                                                    <Controller
                                                        name={`answers.${index}.answer`}
                                                        control={control}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <div>
                                                                {data.options?.map((option: string, optIndex: number) => (
                                                                    <div key={optIndex} style={{ marginBottom: '8px' }}>
                                                                        <label
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '8px',
                                                                                color: 'white',
                                                                                fontSize: '14px',
                                                                                cursor: 'pointer',
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                value={option}
                                                                                checked={field.value === option}
                                                                                onChange={(e) => field.onChange(e.target.value)}
                                                                                style={{
                                                                                    width: '16px',
                                                                                    height: '16px',
                                                                                }}
                                                                            />
                                                                            <HtmlData data={option} className="text-light" />
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                                {errors?.answers?.[index]?.answer && (
                                                                    <div className="text-danger pt-2">{errors?.answers?.[index]?.answer.message}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            )}
                                            {data.type === 'DROPDOWN' && (
                                                <InputField
                                                    name={`answers.${index}.answer`}
                                                    control={control}
                                                    label={data.question}
                                                    variant="outlined"
                                                    required
                                                    select
                                                    className="inputcontrol"
                                                    options={data.options?.map((option: string) => ({
                                                        id: option,
                                                        name: option
                                                    })) || []}
                                                    sx={{
                                                        width: '100%',
                                                        '& .MuiInputLabel-root': {
                                                            color: 'white !important',
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            marginBottom: '8px'
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: 'white !important'
                                                        },
                                                        '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                                                            color: 'white !important'
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '79px',
                                                            backgroundColor: 'transparent',
                                                            borderRadius: '8px',
                                                            border: '1px solid #444',
                                                            '& fieldset': {
                                                                border: '1px solid #444'
                                                            },
                                                            '&:hover fieldset': {
                                                                border: '1px solid #555'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                border: '1px solid #007bff'
                                                            },
                                                            '&.Mui-focused:after': {
                                                                display: 'none'
                                                            }
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: 'white',
                                                            fontSize: '14px',
                                                            padding: '12px 14px'
                                                        },
                                                        '& .MuiInputLabel-shrink': {
                                                            backgroundColor: 'transparent'
                                                        }
                                                    }}
                                                />
                                            )}
                                            {data.type === 'CHECKBOX' && (
                                                <div>
                                                    <label style={{
                                                        display: 'block',
                                                        color: 'white',
                                                        fontSize: '14px',
                                                        marginBottom: '8px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {data.question} <span style={{ color: 'red' }}>*</span>
                                                    </label>
                                                    {data.options?.map((option: string, optIndex: number) => (
                                                        <div key={optIndex} style={{ marginBottom: '8px' }}>
                                                            <label style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                color: 'white',
                                                                fontSize: '14px',
                                                                cursor: 'pointer'
                                                            }}>
                                                                <input
                                                                    type="checkbox"
                                                                    value={option}
                                                                    style={{
                                                                        width: '16px',
                                                                        height: '16px'
                                                                    }}
                                                                />
                                                                <HtmlData data={option} className="text-light" />
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {/* {errors?.answers?.[index]?.answer && (
                                                <div style={{ color: 'red', marginTop: '8px', fontSize: '12px' }}>
                                                    {errors?.answers?.[index]?.answer.message}
                                                </div>
                                            )} */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* My Articles Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <div
                            style={{
                                width: '100%',
                                height: '43px',
                                borderRadius: showArticles ? '8px 8px 0 0' : '8px',
                                backgroundColor: '#333333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 20px',
                                marginBottom: showArticles ? '0' : '20px',
                                cursor: 'pointer',
                                border: '1px solid #444',
                                borderBottom: showArticles ? 'none' : '1px solid #444'
                            }}
                            onClick={toggleArticles}
                        >
                            <h3 style={{
                                margin: 0,
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600'
                            }}>
                                My Articles
                            </h3>
                            <Icon
                                icon={showArticles ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                                width="20"
                                color="white"
                            />
                        </div>

                        {showArticles && (
                            <div style={{
                                width: '100%',
                                borderRadius: '0 0 8px 8px',
                                backgroundColor: '#333333',
                                borderTop: 'none',
                                padding: '20px',
                                border: '1px solid #444'
                            }}>
                                <ListCards
                                    type={'small'}
                                    checkbox={true}
                                    setArticleId={setArticleId}
                                    articleId={articleId}
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div style={{ textAlign: 'right' }}>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '12px 32px',
                                borderRadius: '25px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Icon icon="mdi:send" width="18" />
                            Submit Proposal
                        </button>
                    </div>
                </form>

                {loading && <GlobalLoader />}
            </div>
        </section>
    )
}