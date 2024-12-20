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
            taskId: taskId ,

        },
        resolver: zodResolver(disputeSchema),
        mode: 'all'
    })

    const getDispute = async (taksId: number) => {
        const data={
            'taskId': taksId
        }

        await apiCall(requests.dispute, data, 'get', false, dispatch, user, router).then((res: any) => {
            console.log('dispute',res)
            setDisputeDetail(res?.data?.data?.disputes || [])
            if(res?.data?.data?.disputes) {
                setValue('description', res?.data?.data?.disputes[0]?.description)
                setValue('documents', res?.data?.data?.disputes[0]?.documents)
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

        const formData = dataForServer(data)

        await apiCall(`${type? requests.editDispute : requests.dispute}`, formData, `${type?'patch':'post' }`, true, dispatch, user, router).then((res: any) => {
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
                            <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Add Dispute</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            {/* <div className="mb-3">
                  <label htmlFor="exampleFormControlInput1" className="form-label">Reason</label>
                  <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Reason" />
                </div> */}
                            <div className="mb-3 ">
                                <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                                <textarea {...register('description')}className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>
                            </div>

                            {/* <div className="d-grid gap-2">
                                <button className="btn bg-dark text-light fs-12" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
                            </div> */}
                            <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="task" />
                            <div>
                                {documents?.map((data: any, index: number) => (
                                    <div key={index}>
                                        <p className="form-label text-light fs-12">{data.key}</p>
                                        <button type="button" className="btn btn-outline-info btn-sm" onClick={() => handleDeleteFile(data.fileUrl)}>
                                            <Icon icon="ri:close-line" />
                                        </button>
                                    </div>
                                ))}

                            </div>

                        </div>
                        <div className="modal-footer">
                            <div className="d-grid gap-2">

                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                    </form>  
                </div>
            </div>





        </div>
    )
}

export default DisputeModal
