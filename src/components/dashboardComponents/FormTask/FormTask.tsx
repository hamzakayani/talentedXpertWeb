'use client'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { addtaskSchema } from '@/schemas/addtask-schema/addtaskSchema';
import { z } from 'zod';
import Questions from './Questions';
import { dataForServer } from '@/models/taskModel/taskModel';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useParams, useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AmountType, TaskType } from '@/services/enums/enums';
import FileUpload from '@/components/common/upload/FileUpload';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';
import Promotion from '@/components/common/Modals/Promotion';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('@/components/common/TextEditor/TextEditor'), { ssr: false });
import CreatableSelect from 'react-select/creatable';

type FormSchemaType = z.infer<typeof addtaskSchema>

export const FormTask: FC<any> = ({ type }) => {
    const [activeAccordions, setActiveAccordions] = useState<string[]>([]);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [dataToPass, setDataToPass] = useState(null)

    const dispatch = useAppDispatch();
    const router = useRouter()
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
    const [questionsArr, setQuestionsArr] = useState<any>([])
    const [categories, setcategories] = useState<any>([])
    const [task, setTask] = useState<any>([])
    const [subCategories, setSubCategories] = useState<any>([])
    const [documents, setDocuments] = useState<any>([])
    const user = useSelector((state: RootState) => state.user)

    const [catId, setCatId] = useState<number | null>(null)

    const [pop, setPop] = useState<boolean>(false);
    const { id } = useParams()
    const [editorTxt, setEditorTxt] = useState('');

    const { register, handleSubmit, setValue, clearErrors, control, formState: { errors, }, reset, watch } = useForm<FormSchemaType>({
        defaultValues: {
            name: '',
            amount: '',
            details: '',
            startDate: '',
            endDate: '',
            amountType: '',
            taskType: '',
            status: 'POSTED',
            documents: [],
            interviewQuestions: [],
            city: '',
            state: '',
            zip: '',
            street: '',
            country: '',
            address: '',
            // addInterview: false, 
            category: '',
            subCategory: [],
            industryId: '',
            requesterProfileId: user?.profile[0]?.id?.toString() || '',
            promoted: '',
            disability: '',
        },
        resolver: zodResolver(addtaskSchema),
        mode: 'all',
    });

    const taskType = watch('taskType')



    useEffect(() => {
        const fetchData = async () => {
            try {
                await getCategory(1, null);

                await getCategory(2, null);

                if (type) {
                    await getTask();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [type]);

    useEffect(() => {


        if (categories.length > 0) {
            const preSelectedCategory = categories.filter((category: any) =>
                task?.categories?.some((uCat: any) => uCat?.category?.parentCategory?.id === category.id),
            );
            setValue("category", String(preSelectedCategory[0]?.id));

        }
        if (subCategories.length > 0) {
            const preSelectedSubCategory = subCategories.filter((subCategory: any) =>
                task?.categories?.some((uCat: any) => uCat?.category?.id === subCategory.value),
            );
            // console.log('subCategory.id',subCategories[0].id)
            setValue("subCategory", preSelectedSubCategory);

        }

    }, [categories, task]);

    const getCategory = async (level: number, catId: number | null) => {
        await apiCall(`${requests.getCategory}?level=${level}${catId ? `&parentCategoryId=${catId}` : ''}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            if (level === 2) {
                setSubCategories(res?.data?.data?.categories?.map((cat: any) => ({
                    label: cat.name,
                    value: cat.id,
                })) || [])
            } else {
                setcategories(res?.data?.data?.categories || [])
            }
        }).catch(err => console.warn(err))
    }


    useMemo(() => {
        getCategory(2, catId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catId])

    const getTask = async () => {
        await apiCall(requests.getTaskId + id, {}, 'get', false, dispatch, user, router).then((res: any) => {
            if (res?.data?.data?.task) {
                const startformattedDate = new Date(res?.data?.data?.task?.startDate).toISOString().split("T")[0];
                const endformattedDate = new Date(res?.data?.data?.task?.endDate).toISOString().split("T")[0];
                setQuestionsArr(res?.data?.data?.task.interviewQuestions || [])
                setEditorTxt(res?.data?.data?.task?.details || '')
                setTask(res?.data?.data?.task)

                setValue('name', res?.data?.data?.task?.name || '');
                setValue('amount', res?.data?.data?.task?.amount?.toString() || '');
                setValue('details', res?.data?.data?.task?.details || '');
                setValue('startDate', startformattedDate || '');
                setValue('endDate', endformattedDate || '');
                setValue('promoted', res?.data?.data?.task?.promoted.toString() || '')
                setValue('disability', res?.data?.data?.task?.disability?.toString() || '')
                setValue('amountType', res?.data?.data?.task.amountType || '');
                setValue('taskType', res?.data?.data?.task.taskType || '');
                setValue('status', res?.data?.data?.task.status || '');
                setValue('city', res?.data?.data?.task.city || '');
                setValue('state', res?.data?.data?.task.state || '');
                setValue('zip', res?.data?.data?.task.zip || '');
                setValue('street', res?.data?.data?.task.street || '');
                setValue('country', res?.data?.data?.task.country || '');
                setValue('category', res?.data?.data?.task.categoryId?.toString() || '');
                setCatId(res?.data?.data?.task.categoryId || null)
                setValue('industryId', res?.data?.data?.task.industryId?.toString() || '');
                setValue('interviewQuestions', res?.data?.data?.task.interviewQuestions || [])
                setValue('documents', res?.data?.data?.task?.documents || [])
            }
            setDocuments(res?.data?.data?.task.documents || [])




        }).catch(err => console.warn(err))
    }


    useEffect(() => {
        const newActiveAccordions = [];

        if (errors.name || errors.details || errors.amount || errors.startDate || errors.endDate || errors.amountType) {
            newActiveAccordions.push('collapseOne');
        }
        if (errors.category || errors.amountType || errors.industryId) {
            newActiveAccordions.push('collapseTwo');
        }
        if (errors.taskType || errors.city || errors.country || errors.address || errors.state || errors.zip) {
            newActiveAccordions.push('collapseThree');
        }
        if (errors.interviewQuestions) {
            newActiveAccordions.push('collapsefour');
        }

        if (Object.values(errors)?.length === 0) {
            newActiveAccordions.push('collapseOne');
        }

        setActiveAccordions(newActiveAccordions);
    }, [errors])

    const onSubmit: SubmitHandler<FormSchemaType> = async (data: any) => {
        if (activeStep === 0) {
            setPop(true)
            setIsFormSubmitted(true)
            setDataToPass(data)
        }
    }

    const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
        const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0
        const temp: any = [...documents, ...uploadedFileIds];
        setDocuments(temp)

        if (uploadedFileIds.length > 0) {
            setValue('documents', temp)
        }

        return uploadedFileIds;

    }
    
    const getPrivateFile = async (uploadedFile: any) => {
        await apiCall(`${requests.downloadFile}?fileUrl=${uploadedFile?.fileUrl}`, {}, 'get', false, dispatch, user, router).then(res => {
            if (res?.data) {
                window.open(res?.data?.presignedUrl, '_blank')
            }
        }).catch(err => console.warn(err))
    }

    const handleDeleteFile = (id: any) => {
        const updatedDocuments = documents.filter((doc: any) => doc.fileUrl !== id);
        setDocuments(updatedDocuments);
        setValue('documents', updatedDocuments)

    };

    const handleEditorTxt = (value: any) => {
        setEditorTxt(value.replace(/<[^>]*>/g, '').trim() !== '' ? value : '')
        setValue("details", value.replace(/<[^>]*>/g, '').trim() !== '' ? value : '')
        clearErrors("details")
    }

    return (
        <section className='addtask'>
            <div className="card">
                <div className="card first-card card-header bg-dark text-light ad-new">
                    {type ? 'Edit Task' : 'Add New Task'}
                </div>
                <div className="card-bodyy p-3 adtask-ht ">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item mb-2 border-dark border-2">
                                <h2 className="accordion-header">
                                    <button className={`accordion-button py-2 ${activeAccordions.includes('collapseOne') ? '' : 'collapsed'}  bg-dark text-light`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded={activeAccordions.includes('collapseOne')} aria-controls="collapseOne">
                                        Task Info
                                    </button>
                                </h2>
                                <div id="collapseOne" className={`accordion-collapse collapse ${activeAccordions.includes('collapseOne') ? 'show' : ''}`} data-bs-parent="#accordionExample">
                                    <div className="accordion-body bg-gray">
                                        <div className='container'>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task Name :</label>
                                                        <input {...register('name')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Task name" />
                                                        {
                                                            errors.name && (
                                                                <div className="text-danger pt-2">{errors.name.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlTextarea1" className="form-label text-light fs-12">Task Details :</label>
                                                        <QuillEditor className=" bg-white text-white invert border-0" style={{ height: '150px' }} placeholder="Task details" value={editorTxt} setValue={handleEditorTxt} />
                                                        {
                                                            errors.details && (
                                                                <div className="text-danger pt-2">{errors.details.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className='mb-3'>
                                                        <label className="form-label text-light fs-12">File Upload :</label>
                                                        <div className="  gap-2">
                                                            < FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="task" />
                                                            <div className=''>
                                                                {documents?.map((data: any, index: number) => (
                                                                    <div key={index}>
                                                                    
                                                                        <p className="form-label text-light fs-12" >
                                                                            {data.key}
                                                                            <Icon icon="line-md:close" onClick={() => handleDeleteFile(data.fileUrl)} style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                                                        </p>
                                                                       
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                                <div className='col-md-6'>


                                                    <div className='row mb-4'>
                                                        <div className='col-md-4 me-5'>
                                                            <label className='text-light fs-12 me-2'>Type :</label>
                                                            <div className='d-flex align-items-center '>
                                                                {Object.keys(AmountType).map(key => {
                                                                    const value = AmountType[key as keyof typeof AmountType];
                                                                    return (
                                                                        <div className="form-check me-3" key={value}>
                                                                            <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                                                <input {...register('amountType')} className="form-check-input " value={key} type="radio" name="amountType" id="amountType" />
                                                                                {value}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}


                                                            </div>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <label className='text-light fs-12 me-2'>Disability :</label>
                                                            <div className='d-flex align-items-center '>

                                                                <div className="form-check me-3">
                                                                    <label className="form-check-label text-light fs-12" htmlFor="disability">
                                                                        <input {...register('disability')} className="form-check-input" type="radio" value={'true'} name="disability" id="disability"
                                                                        />
                                                                        Yes
                                                                    </label>
                                                                </div>
                                                                <div className="form-check me-3">
                                                                    <label className="form-check-label text-light fs-12" htmlFor="disability">
                                                                        <input {...register('disability')} className="form-check-input text-dark" type="radio" value={'false'} name="disability" id="disability"
                                                                        />
                                                                        No
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>



                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Amount :</label>
                                                        <input {...register('amount')} type="number" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Add amount" />
                                                        {
                                                            errors.amount && (
                                                                <div className="text-danger pt-2">{errors.amount.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task Start Date :</label>
                                                        <input {...register('startDate')} type="date" className="form-control invert text-dark border-0" id="exampleFormControlInput1" />
                                                        {
                                                            errors.startDate && (
                                                                <div className="text-danger pt-2">{errors.startDate.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task End Date :</label>
                                                        <input {...register('endDate')} type="date" className="form-control invert text-dark border-0" id="exampleFormControlInput1" />
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
                                    <button className={`accordion-button py-2 ${activeAccordions.includes('collapseTwo') ? '' : 'collapsed'}  bg-dark text-light`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded={activeAccordions.includes('collapseTwo')} aria-controls="collapseTwo">
                                        Category
                                    </button>
                                </h2>
                                <div id="collapseTwo" className={`accordion-collapse collapse ${activeAccordions.includes('collapseTwo') ? 'show' : ''}`} data-bs-parent="#accordionExample">
                                    <div className="accordion-body bg-gray">
                                        <div className='container'>
                                            <div className='row'>
                                                <div className='col-md-6'>

                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">Major task category :</label>
                                                        <select {...register('category')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" onChange={(e) => setCatId(e?.target?.value !== '' ? Number(e?.target?.value) : null)}>
                                                            <option value={''}>Category Type</option>
                                                            {categories.map((data: any) => <option value={data?.id} key={data?.id}>{data?.name}</option>)}

                                                        </select>
                                                        {
                                                            errors.category && (
                                                                <div className="text-danger pt-2">{errors.category.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>

                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">Sub-task category 1 :</label>                                                        
                                                        <Controller
                                                            name="subCategory"
                                                            control={control}
                                                            render={({ field }: any) => (
                                                                <CreatableSelect
                                                                    {...field}
                                                                    isMulti
                                                                    options={subCategories || ''}
                                                                    className=" invert text-dark "
                                                                    classNamePrefix=""
                                                                    value={field.value}
                                                                    onChange={(selectedOptions: any) => {
                                                                        field.onChange(selectedOptions);
                                                                    }}
                                                                />
                                                            )}
                                                        />

                                                    </div>



                                                    {/* <div className="mb-3">
                                                        <label className="form-label text-light fs-12">Sub-task category 1 :</label>
                                                        <select {...register('categoryId')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" onChange={(e) => setCatId(e?.target?.value ? Number(e?.target?.value) : null)}>
                                                            <option value={''}>SubCategories</option>
                                                            {categories.map((data: any) => <option value={data?.id} key={data?.id}>{data?.name}</option>)}


                                                        </select>
                                                        {
                                                            errors.categoryId && (
                                                                <div className="text-danger pt-2 ">{errors.categoryId.message}</div>
                                                            )
                                                        }
                                                    </div> */}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item mb-2 border-dark border-2">
                                <h2 className="accordion-header">
                                    <button className={`accordion-button py-2 ${activeAccordions.includes('collapseThree') ? '' : 'collapsed'}  bg-dark text-light`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded={activeAccordions.includes('collapseThree')} aria-controls="collapseThree">
                                        Task Location
                                    </button>
                                </h2>
                                <div id="collapseThree" className={`accordion-collapse collapse ${activeAccordions.includes('collapseThree') ? 'show' : ''}`} data-bs-parent="#accordionExample">
                                    <div className="accordion-body bg-gray">
                                        <div className='container'>

                                            <div className='d-flex align-items-center'>
                                                <label className='text-light fs-12 me-2'>Task location :</label>
                                                {Object.keys(TaskType).map(key => {
                                                    const value = TaskType[key as keyof typeof TaskType];
                                                    return (
                                                        <div className="form-check me-3" key={value}>
                                                            <div className="form-check me-3">
                                                                <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
                                                                    <input {...register('taskType')} className="form-check-input" value={key} type="radio" name="taskType" id="flexRadioDefault2" />
                                                                    {value}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="mb-3">
                                                {
                                                    errors.taskType && (
                                                        <div className="text-danger pt-2">{errors.taskType.message}</div>
                                                    )
                                                }
                                            </div>
                                            {taskType == 'ONSITE' && <div className='row'>
                                                <div className='col-md-6 mt-3'>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Pin Your Location :</label>
                                                        <input type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Pin Location" />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">City :</label>
                                                        <input {...register('city')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="City" />
                                                        {
                                                            errors.city && (
                                                                <div className="text-danger pt-2">{errors.city.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">Country :</label>
                                                        <select {...register('country')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example">
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

                                                    <div className='mb-3'>

                                                        {
                                                            errors.taskType && (
                                                                <div className="text-danger pt-2">{errors.taskType.message}</div>
                                                            )
                                                        }

                                                    </div>



                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Address :</label>
                                                        <input {...register('address')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Address" />
                                                        {
                                                            errors.address && (
                                                                <div className="text-danger pt-2">{errors.address.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-light fs-12">State/Province :</label>
                                                        <select {...register('state')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example">
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
                                                        <select {...register('zip')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example">
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
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item mb-2 border-dark border-2">
                                <h2 className="accordion-header">
                                    <button className={`accordion-button py-2 ${activeAccordions.includes('collapsefour') ? '' : 'collapsed'}  bg-dark text-light`} type="button" data-bs-toggle="collapse" data-bs-target="#collapsefour" aria-expanded={activeAccordions.includes('collapsefour')} aria-controls="collapsefour">
                                        Would you like to add interview questions?
                                    </button>
                                </h2>
                                <div id="collapsefour" className={`accordion-collapse collapse ${activeAccordions.includes('collapsefour') ? 'show' : ''}`} data-bs-parent="#accordionExample">
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
                            <button disabled={isFormSubmitted} className="btn rounded-pill btn-outline-info btn-sm me-2 ls">Cancel</button>
                            <button type="submit" disabled={isFormSubmitted} className="btn btn-info btn-sm rounded-pill">Submit</button>
                        </div>
                        {pop && <Promotion isOpen={pop} onClose={() => setPop(false)} register={register} watch={watch} setValue={setValue} setActiveStep={() => setActiveStep(1)} activeStep={activeStep} data={dataToPass} reset={reset} setIsFormSubmitted={setIsFormSubmitted} type={type} id={id} />}
                    </form>
                </div>
            </div>
        </section>
    )
}
