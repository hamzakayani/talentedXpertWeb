'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useRef, useState } from 'react'
import FileUpload from '../upload/FileUpload'
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { disputeSchema } from '@/schemas/dispute-schema/disputeSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { dataForServer } from '@/models/disputeModel/disputeModel'
import apiCall from '@/services/apiCall/apiCall'
import { requests } from '@/services/requests/requests'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store/Store'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useNavigation } from '@/hooks/useNavigation'
import ModalWrapper from '../ModalWrapper/ModalWrapper'

const DisputeModal = ({ taskId, type, proposalId, getdisputes, handleClose, parentClose }: any) => {
    const [documents, setDocuments] = useState<any>([])
    const [tasks, setTasks] = useState<any>([])
    const [disputeDetail, setDisputeDetail] = useState<any>([])
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useAppDispatch();
    const router = useRouter()
    const { navigate } = useNavigation()
    type FormSchemaType = z.infer<typeof disputeSchema>

    const closeRef = useRef(null)

    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (type) {
            getTasks()
        } else if (!type && taskId) {
            getDispute(taskId)
        }
        //react-hooks/exhaustive-deps
    }, [type, taskId]);

    const getTasks = async () => {
        let filters = "?status=INPROGRESS"
        filters += '&profileType=' + user?.profile[0]?.type
        try {
            const response = await apiCall(
                `${requests.getTaskOnStatus}${user?.id}${filters}`,
                {},
                'get',
                false,
                dispatch,
                user,
                router
            );
            setTasks(response?.data?.data?.tasks || []);
        } catch (error) {
            console.warn("Error fetching tasks:", error);
        } finally {

        }
    };


    const { register, handleSubmit, setValue, formState: { errors, }, watch, reset } = useForm<FormSchemaType>({
        defaultValues: {
            description: '',
            status: 'INITIALIZED',
            taskId: String(taskId) || '',
        },
        resolver: zodResolver(disputeSchema),
        mode: 'all'
    })

    const getDispute = async (taksId: number) => {
        const data = {
            'taskId': taksId
        }

        await apiCall(requests.dispute, data, 'get', false, dispatch, user, router).then((res: any) => {
            setDisputeDetail(res?.data?.data?.disputes || [])
            if (res?.data?.data?.disputes) {
                setValue('description', res?.data?.data?.disputes[0]?.description)
                setValue('documents', res?.data?.data?.disputes[0]?.documents)
                setDocuments(res?.data?.data?.disputes[0].documents || [])
            }
        }).catch(err => console.warn(err))
    }

    const handleDeleteFile = (id: any) => {
        const updatedDocuments = documents.filter((doc: any) => doc.fileUrl !== id);
        setDocuments(updatedDocuments);
        setValue('documents', updatedDocuments)

    };

    const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
        const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0
        const temp: any = [...documents, ...uploadedFileIds];
        setDocuments(temp)

        if (uploadedFileIds.length > 0) {
            setValue('documents', temp)
        }

        return uploadedFileIds;

    }

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        let newData = null
        const formData = dataForServer(data)
        if (disputeDetail[0]?.id) {
            const { taskId, ...other } = formData;
            newData = other
        }

        await apiCall(`${disputeDetail[0]?.id ? requests.editDispute + disputeDetail[0]?.id : requests.dispute}`, disputeDetail[0]?.id ? newData : formData, `${disputeDetail[0]?.id ? 'patch' : 'post'}`, true, dispatch, user, router).then((res: any) => {
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
                reset()
                const closeButton = document.querySelector('#exampleModalToggle11 .btn-close') as HTMLButtonElement | null
                if (closeButton) {
                    closeButton.click()
                }
                if(parentClose){
                    parentClose()
                }
                handleClose()
                router.push('/dashboard/disputes');
                getdisputes()

            }
        }).catch(err => {
            // setIsFormSubmitted(false)F
            console.warn(err)
        })

    }

    const filteredTasks = tasks.filter((task: any) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='ad-dispute'>
                <ModalWrapper
                    modalId={"exampleModalToggle11"}
                    title={type ? 'Add Dispute' : (disputeDetail[0]?.id ? "Edit Dispute" : "Add Dispute")}
                    closeRef={closeRef}
                    handleClose={handleClose}
                >
                    {type && 
                        <div className="mb-3">
                            <div className="form-floating position-relative">
                                <input
                                    type="text"
                                    className="form-control text-white bg-transparent border border-lightgray"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // small delay so click can register
                                />
                                {showDropdown && filteredTasks.length > 0 && (
                                    <div
                                        className="position-absolute w-100 bg-dark border border-lightgray mt-1 rounded"
                                        style={{ maxHeight: "200px", overflowY: "auto", zIndex: 99999 }}
                                    >
                                        <ul className="list-unstyled m-0 p-2">
                                            {filteredTasks.map((task: any) => (
                                                <li
                                                    key={task.id}
                                                    className="p-2 hover-bg-light cursor-pointer text-white-50"
                                                    onClick={() => {
                                                        setValue("taskId", task.id?.toString()); // react-hook-form value setter
                                                        setSearchTerm(task.name);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    {task.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <label htmlFor="taskDropdown">Task</label>
                            </div>
                            {/* <div className='form-floating'>
                                <select 
                                    {...register('taskId')} 
                                    className="form-select text-white" 
                                    id="taskDropdown" 
                                    defaultValue=""
                                    style={{ 
                                        backgroundColor: '#2a2a2a', 
                                        border: '1px solid #444' 
                                    }}
                                >
                                    <option value="" disabled>Select task</option>
                                    {tasks.map((data: any) => <option value={data?.id} key={data?.id}>{data?.name}</option>)}
                                </select>
                            </div> */}
                            {
                                errors?.taskId && (
                                    <div className="text-danger mt-1">{errors?.taskId?.message}</div>
                                )
                            }
                        </div>
                    }
                    <div className="mb-3 ">
                        <div className="form-floating">
                            <textarea 
                                {...register('description')} 
                                className="form-control" 
                                id="description" 
                                name="description"
                                rows={3}
                                style={{ 
                                    backgroundColor: '#2a2a2a', 
                                    // color: '#ffffff', 
                                    border: '1px solid #444' 
                                }}
                            ></textarea>
                            <label htmlFor="description">Description</label>
                        </div>
                        {
                            errors.description && (
                                <div className="text-danger mt-1">{errors.description.message}</div>
                            )
                        }
                    </div>
                    <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="task" />
                    <div>
                        {documents?.map((data: any, index: number) => (
                            <div key={index} className='d-flex justify-content-between'>
                                <p className="form-label fs-12" style={{ color: '#ffffff' }}>{data.key}</p>
                                <Icon icon="line-md:close" onClick={() => handleDeleteFile(data.fileUrl)} style={{ marginLeft: '8px', cursor: 'pointer', color: '#ffffff' }} />
                            </div>
                        ))}
                    </div>
                    <div className='d-flex justify-content-end mt-3'>
                        <button 
                            type="submit" 
                            className="btn btn-gradient1"
                        >
                            Submit
                        </button>
                    </div>
                </ModalWrapper>
            </div>
        </form>
    )
}

export default DisputeModal
