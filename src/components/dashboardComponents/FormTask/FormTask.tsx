'use client'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { addtaskSchema } from '@/schemas/addtask-schema/addtaskSchema';
import { z } from 'zod';
import Questions from './Questions';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useParams, useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { AmountType, TaskType } from '@/services/enums/enums';
import FileUpload from '@/components/common/upload/FileUpload';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';
import Promotion from '@/components/common/Modals/Promotion';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('@/components/common/TextEditor/TextEditor'), { ssr: false });
import CreatableSelect from 'react-select/creatable';
import DocumentUploadTable from '@/components/common/DocumentUploadTable/DocumentUploadTable';
import GoogleMap from './GoogleMap';
import GlobalLoader from '@/components/common/GlobalLoader/GlobalLoader';

type FormSchemaType = z.infer<typeof addtaskSchema>

const FormTask: FC<any> = ({ type }) => {
    const [activeAccordions, setActiveAccordions] = useState<string[]>([]);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [dataToPass, setDataToPass] = useState(null)
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const router = useRouter()
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
    const [questionsArr, setQuestionsArr] = useState<any>([])
    const [categories, setcategories] = useState<any>([])
    const [states, setStates] = useState<any>([])
    const [cities, setCities] = useState<any>([])
    const [countries, setCountries] = useState<any>([])
    const [task, setTask] = useState<any>([])
    const [subCategories, setSubCategories] = useState<any>([])
    const [documents, setDocuments] = useState<any>([])
    const user = useSelector((state: RootState) => state.user)
    const [currentLocation, setCurrentLocation] = useState<{
        latitude: number | null;
        longitude: number | null;
    }>({ latitude: null, longitude: null });
    const [locationError, setLocationError] = useState<string | null>(null);

    const [catId, setCatId] = useState<number | null>(null)

    const [pop, setPop] = useState<boolean>(false);
    const { id } = useParams()
    const [editorTxt, setEditorTxt] = useState('');



    const { register, handleSubmit, setValue, clearErrors, control, formState: { errors, }, reset, watch, getValues, setError } = useForm<FormSchemaType>({
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
            // industryId: '',
            requesterProfileId: user?.profile[0]?.id?.toString() || '',
            promoted: '',
            // disability: '',
            categoryIdsToDelete: [],
            questionIdsToDelete: []
        },
        resolver: zodResolver(addtaskSchema),
        mode: 'all',
    });

    const taskType = watch('taskType')

    useEffect(() => {
        if (!type) {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentLocation({ latitude, longitude });
                        setValue('latitude', latitude.toString());
                        setValue('longitude', longitude.toString());
                    },
                    (error) => {
                        setLocationError('Unable to retrieve your location. Please allow location access.');
                        console.error('Geolocation error:', error);
                    }
                );
            } else {
                setLocationError('Geolocation is not supported by your browser.');
            }
        }
    }, []);

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

        if (type) {
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
                setValue("subCategory", preSelectedSubCategory);

            }
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

    const getCountries = async (id: any) => {
        await apiCall(requests.countries, {}, 'get', false, null, null, null).then((res: any) => {
            setCountries(res?.data)
            if (id) {

                setValue('country', String(id))
            }

        }).catch(err => console.warn(err))
    }

    const getStates = async (countId: number | null, id: any) => {
        await apiCall(`${requests.states}?countryId=${countId}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setStates(res?.data)
            setTimeout(() => {

                if (id) {

                    setValue('state', String(id))
                }
            }, 300)

        }).catch(err => console.warn(err))
    }
    const getCities = async (stateId: number | null, id: any) => {
        await apiCall(`${requests.cities}?stateId=${stateId}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setCities(res?.data)
            // setcategories(res?.data?.data?.categories || [])
            setTimeout(() => {
                if (id) {
                    setValue('city', String(id));
                }
            }, 300);
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
                setValue('amountType', res?.data?.data?.task.amountType || '');
                setValue('taskType', res?.data?.data?.task.taskType || '');
                setValue('status', res?.data?.data?.task.status || '');
                setValue('zip', res?.data?.data?.task?.taskLocation?.zip || '');
                setValue('category', res?.data?.data?.task.categoryId?.toString() || '');
                setCatId(res?.data?.data?.task.categoryId || null)
                setValue('interviewQuestions', res?.data?.data?.task.interviewQuestions || [])
                setValue('documents', res?.data?.data?.task?.documents || [])
                if (res?.data?.data?.task?.taskLocation?.countryId) {

                    getCountries(res?.data?.data?.task.taskLocation?.countryId)
                }
                if (res?.data?.data?.task.taskLocation?.cityId) {
                    getCities(res?.data?.data?.task.taskLocation?.stateId, res?.data?.data?.task.taskLocation?.cityId)
                    // setValue('city',res?.data?.data?.task.cityId )
                }
                if (res?.data?.data?.task.taskLocation?.stateId) {
                    getStates(res?.data?.data?.task?.taskLocation?.countryId, res?.data?.data?.task.taskLocation?.stateId)
                    // setValue('city',res?.data?.data?.task.cityId )
                }
                if (res?.data?.data?.task.taskLocation?.longitude) {
                    setCurrentLocation({
                        latitude: Number(res?.data?.data?.task.taskLocation?.latitude),
                        longitude: Number(res?.data?.data?.task.taskLocation?.longitude)
                    })
                    setValue('longitude', res?.data?.data?.task.taskLocation?.longitude)
                    setValue('latitude', res?.data?.data?.task.taskLocation?.latitude)
                }
            }
            setDocuments(res?.data?.data?.task.documents || [])




        }).catch(err => console.warn(err))
    }

    const handleGenerateAI = async () => {
        setLoading(true);

        const name = watch('name');
        if (!name) {
            setError('name', { type: 'manual', message: 'Task name is required to generate description using AI' });
            setLoading(false);
            return;
        }

        try {
            const response = await apiCall(
                requests.createTaskDescription,
                { prompt: name },
                'post',
                false,
                dispatch,
                null,
                null
            );

            if (response?.data) {
                setEditorTxt(response?.data);
                setValue('details', `${response?.data}` || '');
            }
        } catch (error) {
            console.error('Error generating AI response:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getCountries(null)
    }, [])
    useEffect(() => {
        const newActiveAccordions = [];



        if (errors.name || errors.details || errors.amount || errors.startDate || errors.endDate || errors.amountType || errors.category || errors.amountType || errors.taskType || errors.city || errors.country || errors.address || errors.state || errors.zip) {
            newActiveAccordions.push('collapseOne');
        }
        if (errors.interviewQuestions) {
            newActiveAccordions.push('collapseTwo');
        }

        if (Object.values(errors)?.length === 0) {
            newActiveAccordions.push('collapseOne');
        }
        setActiveAccordions(newActiveAccordions);
    }, [errors])

    const handleAccordionToggle = (accordionId: string) => {
        setActiveAccordions((prev) => {
            if (prev.includes(accordionId)) {
                return prev.filter((id) => id !== accordionId);
            } else {
                return [...prev, accordionId];
            }
        });
    };

    const onSubmit: SubmitHandler<FormSchemaType> = async (data: any) => {
        console.log('values', getValues)
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
    console.log('eerr', errors)

    const handleLocationSelect = (lat: number, lng: number) => {
        // Do something with the coordinates
        setValue('latitude', String(lat))
        setValue('longitude', String(lng))

        console.log(`New location selected: ${lat}, ${lng}`);
    };

    // return (
    //     <section className='addtask'>
    //         <div className="card">
    //             <div className="card first-card card-header bg-dark">
    //                 {type ? 'Edit Task' : 'Add New Task'}
    //             </div>
    //             <div className="card-bodyy p-3 adtask-ht ">
    //                 <form onSubmit={handleSubmit(onSubmit)}>
    //                     <div className="accordion" id="accordionExample">
    //                         <div className="accordion-item mb-2 border-dark border-2">
    //                             <h2 className="accordion-header">
    //                                 <button className={`accordion-button py-2 ${activeAccordions.includes('collapseOne') ? '' : 'collapsed'}  bg-dark text-light`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded={activeAccordions.includes('collapseOne')} aria-controls="collapseOne">
    //                                     Task Info
    //                                 </button>
    //                             </h2>
    //                             <div id="collapseOne" className={`accordion-collapse collapse ${activeAccordions.includes('collapseOne') ? 'show' : ''}`} data-bs-parent="#accordionExample">
    //                                 <div className="accordion-body bg-gray">
    //                                     <div className='container'>
    //                                         <div className='row'>
    //                                             <div className='col-md-6'>
    //                                                 <div className="mb-3">
    //                                                     <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task Name :</label>
    //                                                     <input {...register('name')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Task name" />
    //                                                     {
    //                                                         errors.name && (
    //                                                             <div className="text-danger pt-2">{errors.name.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                                 <div className="mb-3">
    //                                                     <label htmlFor="exampleFormControlTextarea1" className="form-label text-light fs-12">Task Details :</label>
    //                                                     <QuillEditor className=" bg-white text-white invert border-0" style={{ height: '150px' }} placeholder="Task details" value={editorTxt} setValue={handleEditorTxt} />
    //                                                     {
    //                                                         errors.details && (
    //                                                             <div className="text-danger pt-2">{errors.details.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                                 <div className='mb-3'>
    //                                                     <label className="form-label text-light fs-12">File Upload :</label>
    //                                                     <div className="  gap-2">
    //                                                         < FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="task" />
    //                                                         <div className='mt-2'>
    //                                                             {/* {documents?.map((data: any, index: number) => (
    //                                                                 <div key={index}>

    //                                                                     <p className="form-label text-light fs-12" >
    //                                                                         {data.key}
    //                                                                         <Icon icon="line-md:close" onClick={() => handleDeleteFile(data.fileUrl)} style={{ marginLeft: '8px', cursor: 'pointer' }} />
    //                                                                     </p>

    //                                                                 </div>
    //                                                             ))} */}
    //                                                             {/* {documents?.length > 0 && <table className="table table-dark table-striped">
    //                                                                 <thead>
    //                                                                     <tr className='fs-12 fw-small'>
    //                                                                         <th scope="col">Document Name</th>
    //                                                                         <th scope="col">File</th>
    //                                                                         <th scope="col">Remove</th>
    //                                                                     </tr>
    //                                                                 </thead>
    //                                                                 <tbody>
    //                                                                     {documents.map((doc: any, index: number) => (<tr className='fs-12' key={index}>
    //                                                                         <td>{doc?.key}</td>
    //                                                                         <td>
    //                                                                             <Link href={doc?.fileUrl} target='_blank'>
    //                                                                                 <Icon icon="bx:file" className='ms-2' />
    //                                                                             </Link>
    //                                                                         </td>
    //                                                                         <td><Icon icon="material-symbols:delete-outline" className='ms-3' onClick={() => handleDeleteFile(doc?.fileUrl)} /></td>
    //                                                                     </tr>))}
    //                                                                 </tbody>
    //                                                             </table>} */}
    //                                                               <DocumentUploadTable documents={documents} handleDeleteFile={handleDeleteFile} type={'Document'} />

    //                                                         </div>
    //                                                     </div>


    //                                                 </div>
    //                                             </div>
    //                                             <div className='col-md-6'>


    //                                                 <div className='row mb-4'>
    //                                                     <div className='col-md-4 me-5'>
    //                                                         <label className='text-light fs-12 me-2'>Type :</label>
    //                                                         <div className='d-flex align-items-center '>
    //                                                             {Object.keys(AmountType).map(key => {
    //                                                                 const value = AmountType[key as keyof typeof AmountType];
    //                                                                 return (
    //                                                                     <div className="form-check me-3" key={value}>
    //                                                                         <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
    //                                                                             <input {...register('amountType')} className="form-check-input " value={key} type="radio" name="amountType" id="amountType" />
    //                                                                             {value}
    //                                                                         </label>
    //                                                                     </div>
    //                                                                 );
    //                                                             })}


    //                                                         </div>
    //                                                     </div>
    //                                                     <div className='col-md-4'>
    //                                                         <label className='text-light fs-12 me-2'>Disability :</label>
    //                                                         <div className='d-flex align-items-center '>

    //                                                             <div className="form-check me-3">
    //                                                                 <label className="form-check-label text-light fs-12" htmlFor="disability">
    //                                                                     <input {...register('disability')} className="form-check-input" type="radio" value={'true'} name="disability" id="disability"
    //                                                                     />
    //                                                                     Yes
    //                                                                 </label>
    //                                                             </div>
    //                                                             <div className="form-check me-3">
    //                                                                 <label className="form-check-label text-light fs-12" htmlFor="disability">
    //                                                                     <input {...register('disability')} className="form-check-input text-dark" type="radio" value={'false'} name="disability" id="disability"
    //                                                                     />
    //                                                                     No
    //                                                                 </label>
    //                                                             </div>
    //                                                         </div>
    //                                                     </div>

    //                                                 </div>



    //                                                 <div className="mb-3">
    //                                                     <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Amount :</label>
    //                                                     <input {...register('amount')} type="number" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Add amount" />
    //                                                     {
    //                                                         errors.amount && (
    //                                                             <div className="text-danger pt-2">{errors.amount.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                                 <div className="mb-3">
    //                                                     <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task Start Date :</label>
    //                                                     <input {...register('startDate')} type="date" className="form-control invert text-dark border-0" id="exampleFormControlInput1" />
    //                                                     {
    //                                                         errors.startDate && (
    //                                                             <div className="text-danger pt-2">{errors.startDate.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                                 <div className="mb-3">
    //                                                     <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Task End Date :</label>
    //                                                     <input {...register('endDate')} type="date" className="form-control invert text-dark border-0" id="exampleFormControlInput1" />
    //                                                     {
    //                                                         errors.endDate && (
    //                                                             <div className="text-danger pt-2">{errors.endDate.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                         <div className="accordion-item mb-2 border-dark border-2">
    //                             <h2 className="accordion-header">
    //                                 <button className={`accordion-button py-2 ${activeAccordions.includes('collapseTwo') ? '' : 'collapsed'}  bg-dark text-light`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded={activeAccordions.includes('collapseTwo')} aria-controls="collapseTwo">
    //                                     Category
    //                                 </button>
    //                             </h2>
    //                             <div id="collapseTwo" className={`accordion-collapse collapse ${activeAccordions.includes('collapseTwo') ? 'show' : ''}`} data-bs-parent="#accordionExample">
    //                                 <div className="accordion-body bg-gray">
    //                                     <div className='container'>
    //                                         <div className='row'>
    //                                             <div className='col-md-6'>

    //                                                 <div className="mb-3">
    //                                                     <label className="form-label text-light fs-12">Major task category :</label>
    //                                                     <select {...register('category')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" onChange={(e) => {
    //                                                         setCatId(e?.target?.value !== '' ? Number(e?.target?.value) : null)
    //                                                         setValue("subCategory", []);
    //                                                     }}>
    //                                                         <option value={''}>Category Type</option>
    //                                                         {categories.map((data: any) => <option value={data?.id} key={data?.id}>{data?.name}</option>)}

    //                                                     </select>
    //                                                     {
    //                                                         errors.category && (
    //                                                             <div className="text-danger pt-2">{errors.category.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                             </div>
    //                                             <div className='col-md-6'>

    //                                                 <div className="mb-3">
    //                                                     <label className="form-label text-light fs-12">Sub-task category 1 :</label>
    //                                                     <Controller
    //                                                         name="subCategory"
    //                                                         control={control}
    //                                                         render={({ field }: any) => (
    //                                                             <CreatableSelect
    //                                                                 {...field}
    //                                                                 isMulti
    //                                                                 options={subCategories || ''}
    //                                                                 className=" invert text-dark "
    //                                                                 classNamePrefix=""
    //                                                                 value={field.value}
    //                                                                 onChange={(selectedOptions: any) => {

    //                                                                     const previousValue = getValues('subCategory') || [];
    //                                                                     const deletedSkills = previousValue.filter(
    //                                                                         (option: any) => !selectedOptions.some((selected: any) => selected.value === option.value)
    //                                                                     );

    //                                                                     if (deletedSkills.length > 0) {
    //                                                                         const deletedIds = deletedSkills.map((deletedSkill: any) => deletedSkill.value);

    //                                                                         // setSkillsIdsToDelete((prev: any) => [...prev, ...deletedIds]);                                
    //                                                                         setValue('categoryIdsToDelete', [...(getValues('categoryIdsToDelete') || []), ...deletedIds]);


    //                                                                     }
    //                                                                     field.onChange(selectedOptions);
    //                                                                 }}
    //                                                             // menuIsOpen={true}
    //                                                             />
    //                                                         )}
    //                                                     />
    //                                                 </div>



    //                                                 {/* <div className="mb-3">
    //                                                     <label className="form-label text-light fs-12">Sub-task category 1 :</label>
    //                                                     <select {...register('categoryId')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" onChange={(e) => setCatId(e?.target?.value ? Number(e?.target?.value) : null)}>
    //                                                         <option value={''}>SubCategories</option>
    //                                                         {categories.map((data: any) => <option value={data?.id} key={data?.id}>{data?.name}</option>)}


    //                                                     </select>
    //                                                     {
    //                                                         errors.categoryId && (
    //                                                             <div className="text-danger pt-2 ">{errors.categoryId.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div> */}

    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                         <div className="accordion-item mb-2 border-dark border-2">
    //                             <h2 className="accordion-header">
    //                                 <button className={`accordion-button py-2 ${activeAccordions.includes('collapseThree') ? '' : 'collapsed'}  bg-dark text-light`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded={activeAccordions.includes('collapseThree')} aria-controls="collapseThree">
    //                                     Task Location
    //                                 </button>
    //                             </h2>
    //                             <div id="collapseThree" className={`accordion-collapse collapse ${activeAccordions.includes('collapseThree') ? 'show' : ''}`} data-bs-parent="#accordionExample">
    //                                 <div className="accordion-body bg-gray">
    //                                     <div className='container'>

    //                                         <div className='d-flex align-items-center'>
    //                                             <label className='text-light fs-12 me-2'>Task location :</label>
    //                                             {Object.keys(TaskType).map(key => {
    //                                                 const value = TaskType[key as keyof typeof TaskType];
    //                                                 return (
    //                                                     <div className="form-check me-3" key={value}>
    //                                                         <div className="form-check me-3">
    //                                                             <label className="form-check-label text-light fs-12" htmlFor="flexRadioDefault2">
    //                                                                 <input {...register('taskType')} className="form-check-input" value={key} type="radio" name="taskType" id="flexRadioDefault2" />
    //                                                                 {value}
    //                                                             </label>
    //                                                         </div>
    //                                                     </div>
    //                                                 );
    //                                             })}
    //                                         </div>
    //                                         <div className="mb-3">
    //                                             {
    //                                                 errors.taskType && (
    //                                                     <div className="text-danger pt-2">{errors.taskType.message}</div>
    //                                                 )
    //                                             }
    //                                         </div>
    //                                         {taskType == 'ONSITE' && <div className='row'>
    //                                             <div className='col-md-6 mt-3'>
    //                                                 <div className="mb-3">
    //                                                     <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Pin Your Location :</label>
    //                                                     <input type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Pin Location" />
    //                                                 </div>
    //                                                 <div className="mb-3">
    //                                                     <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">City/Town :</label>
    //                                                     <input {...register('city')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="City" />
    //                                                     {
    //                                                         errors.city && (
    //                                                             <div className="text-danger pt-2">{errors.city.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                                 <div className="mb-3">
    //                                                     <label className="form-label text-light fs-12">Country :</label>
    //                                                     <select {...register('country')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example">
    //                                                         <option value={''}>Country</option>
    //                                                         <option value="1">One</option>
    //                                                         <option value="2">Two</option>
    //                                                         <option value="3">Three</option>
    //                                                     </select>
    //                                                     {
    //                                                         errors.country && (
    //                                                             <div className="text-danger pt-2">{errors.country.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                             </div>
    //                                             <div className='col-md-6'>

    //                                                 <div className='mb-3'>

    //                                                     {
    //                                                         errors.taskType && (
    //                                                             <div className="text-danger pt-2">{errors.taskType.message}</div>
    //                                                         )
    //                                                     }

    //                                                 </div>



    //                                                 <div className="mb-3">
    //                                                     <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Address :</label>
    //                                                     <input {...register('address')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Address" />
    //                                                     {
    //                                                         errors.address && (
    //                                                             <div className="text-danger pt-2">{errors.address.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                                 <div className="mb-3">
    //                                                     <label className="form-label text-light fs-12">State/Province :</label>
    //                                                     <select {...register('state')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example">
    //                                                         <option value={''}>State</option>
    //                                                         <option value="1">One</option>
    //                                                         <option value="2">Two</option>
    //                                                         <option value="3">Three</option>
    //                                                     </select>
    //                                                     {
    //                                                         errors.state && (
    //                                                             <div className="text-danger pt-2">{errors.state.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                                 <div className="mb-3">
    //                                                     <label className="form-label text-light fs-12">ZIP Code/ Postal Code :</label>
    //                                                     <select {...register('zip')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example">
    //                                                         <option value={''}>Zip Code</option>
    //                                                         <option value="1">One</option>
    //                                                         <option value="2">Two</option>
    //                                                         <option value="3">Three</option>
    //                                                     </select>
    //                                                     {
    //                                                         errors.zip && (
    //                                                             <div className="text-danger pt-2">{errors.zip.message}</div>
    //                                                         )
    //                                                     }
    //                                                 </div>
    //                                             </div>
    //                                         </div>}
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                         <div className="accordion-item mb-2 border-dark border-2">
    //                             <h2 className="accordion-header">
    //                                 <button className={`accordion-button py-2 ${activeAccordions.includes('collapsefour') ? '' : 'collapsed'}  bg-dark text-light`} type="button" data-bs-toggle="collapse" data-bs-target="#collapsefour" aria-expanded={activeAccordions.includes('collapsefour')} aria-controls="collapsefour">
    //                                     Would you like to add interview questions?
    //                                 </button>
    //                             </h2>
    //                             <div id="collapsefour" className={`accordion-collapse collapse ${activeAccordions.includes('collapsefour') ? 'show' : ''}`} data-bs-parent="#accordionExample">
    //                                 <div className="accordion-body bg-gray">
    //                                     <div className='container'>
    //                                         {/* <div className='d-flex align-items-center mb-3'>
    //                                             <input {...register('addInterview')} type='checkbox' className='text-light fs-14 me-2' />
    //                                             <label className='text-light fs-14 me-2'>Add interview questions</label>
    //                                         </div> */}

    //                                         <Questions questionsArr={questionsArr} setQuestionArr={setQuestionsArr} setValue={setValue} errors={errors} getValues={getValues} />

    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div className=' text-end'>
    //                         <button disabled={isFormSubmitted} className="btn rounded-pill btn-outline-info btn-sm me-2 ls" onClick={() => router.push('/dashboard/tasks')}>Cancel</button>
    //                         <button type="submit" disabled={isFormSubmitted} className="btn btn-info btn-sm rounded-pill">Submit</button>
    //                     </div>
    //                     {pop && <Promotion isOpen={pop} onClose={() => setPop(false)} register={register} watch={watch} setValue={setValue} setActiveStep={() => setActiveStep(1)} activeStep={activeStep} data={dataToPass} reset={reset} setIsFormSubmitted={setIsFormSubmitted} type={type} id={id} />}
    //                 </form>
    //             </div>
    //         </div>
    //     </section>
    // )

    return (
        <section className='addtask'>
            <div className="card">
                <div className="card first-card card-header bg-dark">
                    {type ? 'Edit Task' : 'Add New Task'}
                </div>
                <div className="card-bodyy p-3 adtask-ht ">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item mb-2 border-dark border-2">
                                <h2 className="accordion-header">
                                    <button className={`accordion-button py-2 ${activeAccordions.includes('collapseOne') ? '' : 'collapsed'}  bg-dark text-light invert`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded={activeAccordions.includes('collapseOne')} aria-controls="collapseOne"
                                        onClick={() => handleAccordionToggle('collapseOne')}
                                    >
                                        Task Details
                                    </button>
                                </h2>
                                <div id="collapseOne" className={`accordion-collapse collapse ${activeAccordions.includes('collapseOne') ? 'show' : ''}`} data-bs-parent="#accordionExample">
                                    <div className="accordion-body bg-light">
                                        <div className='container'>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-dark fs-14">Task Name <span style={{ color: 'red' }}>*</span></label>
                                                        <input {...register('name')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Task name" />
                                                        {
                                                            errors.name && (
                                                                <div className="text-danger pt-2">{errors.name.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlTextarea1" className="form-label text-dark fs-14">Task Details <span style={{ color: 'red' }}>*</span></label>
                                                        <QuillEditor className=" bg-white text-white invert border-0" style={{ height: '150px' }} placeholder="Task details" value={editorTxt} setValue={handleEditorTxt} />
                                                        <div className='d-flex justify-content-end align-items-center mt-1 mb-3'>
                                                            <button className='btn text-info btn-sm rounded-pill p-0' type='button' onClick={handleGenerateAI}>Generate through AI</button>
                                                        </div>
                                                        {
                                                            errors.details && (
                                                                <div className="text-danger pt-2">{errors.details.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className='mb-3'>
                                                        <label className="form-label text-dark fs-14">File Upload (only image and pdf): </label>
                                                        <div className="  gap-2">
                                                            <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="task" />
                                                            <div className='mt-2'>
                                                                <DocumentUploadTable documents={documents} handleDeleteFile={handleDeleteFile} type={'Document'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>

                                                    <div className='row mb-4'>
                                                        <div className='col-md-4 me-5'>
                                                            <label className='text-dark fs-14 me-2'>Type <span style={{ color: 'red' }}>*</span></label>
                                                            <div className='d-flex align-items-center '>
                                                                {Object.keys(AmountType).map(key => {
                                                                    const value = AmountType[key as keyof typeof AmountType];
                                                                    return (
                                                                        <div className="form-check me-3" key={value}>
                                                                            <label className="form-check-label text-dark fs-14" htmlFor="flexRadioDefault2">
                                                                                <input {...register('amountType')} className="form-check-input " value={key} type="radio" name="amountType" id="amountType" />
                                                                                {value}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        {
                                                            errors.amountType && (
                                                                <div className="text-danger pt-2">{errors?.amountType?.message}</div>
                                                            )
                                                        }
                                                        {/* <div className='col-md-4'>
                                                            <label className='text-light fs-12 me-2'>Disability :</label>
                                                            <div className='d-flex align-items-center '>

                                                                <div className="form-check me-3">
                                                                    <label className="form-check-label text-dark fs-14" htmlFor="disability">
                                                                        <input {...register('disability')} className="form-check-input" type="radio" value={'true'} name="disability" id="disability"
                                                                        />
                                                                        Yes
                                                                    </label>
                                                                </div>
                                                                <div className="form-check me-3">
                                                                    <label className="form-check-label text-dark fs-14" htmlFor="disability">
                                                                        <input {...register('disability')} className="form-check-input text-dark" type="radio" value={'false'} name="disability" id="disability"
                                                                        />
                                                                        No
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-dark fs-14">{watch('amountType') == 'HOURLY' ? 'hourly rate' : 'amount'} <span style={{ color: 'red' }}>*</span></label>
                                                        <input {...register('amount')} type="number" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Add amount" />
                                                        {
                                                            errors.amount && (
                                                                <div className="text-danger pt-2">{errors.amount.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-dark fs-14">Posted Start Date <span style={{ color: 'red' }}>*</span></label>
                                                        <input {...register('startDate')} type="date" className="form-control invert text-dark border-0" id="exampleFormControlInput1" min={new Date().toISOString().split('T')[0]} />
                                                        {
                                                            errors.startDate && (
                                                                <div className="text-danger pt-2">{errors.startDate.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-dark fs-14">Posted End Date <span style={{ color: 'red' }}>*</span></label>
                                                        <input {...register('endDate')} type="date" className="form-control invert text-dark border-0" id="exampleFormControlInput1" min={watch('startDate') || new Date().toISOString().split('T')[0]} />
                                                        {
                                                            errors.endDate && (
                                                                <div className="text-danger pt-2">{errors.endDate.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <div className="mb-3">
                                                        <label className="form-label text-dark fs-14">Major task category <span style={{ color: 'red' }}>*</span></label>
                                                        <select {...register('category')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" onChange={(e) => {
                                                            setCatId(e?.target?.value !== "" ? Number(e?.target?.value) : null)
                                                            setValue("subCategory", []);
                                                        }}>
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
                                                        <label className="form-label text-dark fs-14">Sub-task category 1 <span style={{ color: 'red' }}>*</span></label>
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

                                                                        const previousValue = getValues('subCategory') || [];
                                                                        const deletedSkills = previousValue.filter(
                                                                            (option: any) => !selectedOptions.some((selected: any) => selected.value === option.value)
                                                                        );

                                                                        if (deletedSkills.length > 0) {
                                                                            const deletedIds = deletedSkills.map((deletedSkill: any) => deletedSkill.value);

                                                                            // setSkillsIdsToDelete((prev: any) => [...prev, ...deletedIds]);                                
                                                                            setValue('categoryIdsToDelete', [...(getValues('categoryIdsToDelete') || []), ...deletedIds]);


                                                                        }
                                                                        field.onChange(selectedOptions);
                                                                    }}
                                                                // menuIsOpen={true}
                                                                />
                                                            )}
                                                        />
                                                        {
                                                            errors?.subCategory && (
                                                                <div className="text-danger pt-2">{errors?.subCategory?.message}</div>
                                                            )
                                                        }
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

                                            <div className='d-flex align-items-center'>
                                                <label className='text-dark fs-14 me-2'>Task location <span style={{ color: 'red' }}>*</span></label>
                                                {Object.keys(TaskType).map(key => {
                                                    const value = TaskType[key as keyof typeof TaskType];
                                                    return (
                                                        <div className="form-check me-3" key={value}>
                                                            <div className="form-check me-3">
                                                                <label className="form-check-label text-dark fs-14" htmlFor="flexRadioDefault2">
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
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-dark fs-14">Pin Your Location :</label>
                                                        {/* <input type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Pin Location" /> */}
                                                        {/* <GoogleMap address="1600 Amphitheatre Parkway, Mountain View, CA" /> */}

                                                        <GoogleMap
                                                            latitude={currentLocation.latitude || 24.99816}
                                                            longitude={currentLocation.longitude || 56.27207}
                                                            onLocationSelect={handleLocationSelect}
                                                        />

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
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-dark fs-14">Address :</label>
                                                        <input {...register('address')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="Address" />
                                                        {
                                                            errors.address && (
                                                                <div className="text-danger pt-2">{errors.address.message}</div>
                                                            )
                                                        }
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label text-dark fs-14">Country :</label>
                                                        <select {...register('country')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" onChange={(e) => {
                                                            getStates(e?.target?.value !== "" ? Number(e?.target?.value) : null, null)
                                                        }}>
                                                            <option value={''}>Country</option>
                                                            {countries?.map((country: any) => (<option key={country?.id} value={country?.id}>{country?.name}</option>))}
                                                        </select>
                                                        {
                                                            errors.country && (
                                                                <div className="text-danger pt-2">{errors.country.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">

                                                        <label className="form-label text-dark fs-14">State/Province :</label>
                                                        <select {...register('state')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" onChange={(e) => {

                                                            getCities(e?.target?.value !== "" ? Number(e?.target?.value) : null, null)
                                                        }}>
                                                            <option value={''}>State</option>
                                                            {states?.map((state: any) => (<option key={state?.id} value={state?.id}>{state?.name}</option>))}
                                                        </select>
                                                        {
                                                            errors.state && (
                                                                <div className="text-danger pt-2">{errors.state.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label text-dark fs-14">City/Town :</label>
                                                        {/* <input {...register('city')} type="text" className="form-control invert text-dark border-0" id="exampleFormControlInput1" placeholder="City" /> */}
                                                        <select {...register('city')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" >
                                                            <option value={''}>City</option>
                                                            {cities?.map((city: any) => (<option key={city?.id} value={city?.id}>{city?.name}</option>))}
                                                        </select>
                                                        {
                                                            errors.city && (
                                                                <div className="text-danger pt-2">{errors.city.message}</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-dark fs-14">ZIP Code/ Postal Code :</label>
                                                        <input {...register('zip')} type="text" className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" placeholder="Zip Code" />


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
                                    <button className={`accordion-button py-2 ${activeAccordions.includes('collapseTwo') ? '' : 'collapsed'}  bg-dark text-light invert`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded={activeAccordions.includes('collapseTwo')} aria-controls="collapseTwo"
                                        onClick={() => handleAccordionToggle('collapseTwo')}
                                    >
                                        Additional Information
                                    </button>
                                </h2>
                                <div id="collapseTwo" className={`accordion-collapse collapse ${activeAccordions.includes('collapseTwo') ? 'show' : ''}`} data-bs-parent="#accordionExample">
                                    <div className="accordion-body bg-light">
                                        <div className='container'>
                                            <Questions questionsArr={questionsArr} setQuestionArr={setQuestionsArr} setValue={setValue} errors={errors} getValues={getValues} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=' text-end'>
                            <button type='button' disabled={isFormSubmitted} className="btn rounded-pill btn-outline-info btn-sm me-2 ls" onClick={() => router.push('/dashboard/tasks')}>Cancel</button>
                            <button type="submit" disabled={isFormSubmitted} className="btn btn-info btn-sm rounded-pill">Submit</button>
                        </div>
                        {pop && <Promotion isOpen={pop} onClose={() => setPop(false)} register={register} watch={watch} setValue={setValue} setActiveStep={() => setActiveStep(1)} activeStep={activeStep} data={dataToPass} reset={reset} setIsFormSubmitted={setIsFormSubmitted} type={type} id={id} />}
                    </form>
                </div>
                {loading && <GlobalLoader />}
            </div>
        </section>
    )
}

export default FormTask