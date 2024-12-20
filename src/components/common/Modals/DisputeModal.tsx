import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
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

const DisputeModal = ({ taskId, type }: any) => {
    const [documents, setDocuments] = useState<any>([])
    const [disputeDetail, setDisputeDetail] = useState<any>([])
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useAppDispatch();
    const router = useRouter()
    type FormSchemaType = z.infer<typeof disputeSchema>

    useEffect(() => {
        getDispute(taskId)
    }, []);
    const { register, handleSubmit, setValue } = useForm<FormSchemaType>({
        defaultValues: {
            description: '',
            status: 'INITIALIZED',
            taskId: taskId,

        },
        resolver: zodResolver(disputeSchema),
        mode: 'all'
    })

    const getDispute = async (taksId: number) => {
        const data = {
            'taskId': taksId
        }

        await apiCall(requests.dispute, data, 'get', false, dispatch, user, router).then((res: any) => {
            console.log('dispute', res)
            setDisputeDetail(res?.data?.data?.disputes || [])
            if (res?.data?.data?.disputes) {
                setValue('description', res?.data?.data?.disputes[0]?.description)
                setValue('documents', res?.data?.data?.disputes[0]?.documents)
                setDocuments(res?.data?.data?.disputes[0].documents || [])
            }
        }).catch(err => console.warn(err))
    }
    // console.log('errors', errors)




    const handleDeleteFile = (id: any) => {
        console.log('ID to delete:', id);
        console.log('Documents before delete:', documents);
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
        const newData = null
        const formData = dataForServer(data)
        if (disputeDetail[0]?.id) {
            const { taskId, ...other } = formData;
            const newData = other
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
                console.log('post res', res)
                router.push(`/dashboard/tasks`);

            }
        }).catch(err => {
            // setIsFormSubmitted(false)
            console.warn(err)
        })


    }





    return (
        <div className='ad-dispute'>
            <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
                <div className="modal-dialog modal-dialog-centered">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">{disputeDetail[0]?.id ? "Edit Dispute" : "Add Dispute"}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label htmlFor="taskDropdown" className="form-label">Task :</label>
                                    <select className="form-select" id="taskDropdown" defaultValue="">
                                        <option value="" disabled>Select task</option>
                                        <option value="task1">Task 1</option>
                                        <option value="task2">Task 2</option>
                                        <option value="task3">Task 3</option>
                                    </select>
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                                    <textarea {...register('description')} className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>
                                </div>

                                

                                {/* <div className="d-grid gap-2">
                                <button className="btn bg-dark text-light fs-12" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
                            </div> */}
                                <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="task" />
                                <div>
                                    {documents?.map((data: any, index: number) => (
                                        <div key={index}>
                                            <p className="form-label text-light fs-12">{data.key}</p>

                                            <Icon icon="line-md:close" onClick={() => handleDeleteFile(data.fileUrl)} style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                        </div>
                                    ))}

                                </div>

                            </div>
                            <div className="modal-footer">
                                <div className="d-grid gap-2">

                                </div>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>





        </div>
    )
}

export default DisputeModal
