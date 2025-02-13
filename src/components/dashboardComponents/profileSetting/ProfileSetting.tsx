'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';
import FileUpload from '@/components/common/upload/FileUpload';
import { requests } from '@/services/requests/requests';
import apiCall from '@/services/apiCall/apiCall';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { editProfileSchema } from '@/schemas/editProfile-schema/editProfileSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import CreatableSelect from 'react-select/creatable';
import { dataForServer } from '@/models/editProfileModel/editProfileModel';
import { toast } from 'react-toastify';
import { setUser } from '@/reducers/UserSlice';

const ProfileSetting = () => {
    type FormSchematype = z.infer<typeof editProfileSchema>
    const [skills, setSkills] = useState<any>([])
    const [educationIdsMap, setEducationIdsMap] = useState<{ [key: number]: string }>({});
    const [experienceIdsMap, setExperienceIdsMap] = useState<{ [key: number]: string }>({});
    const [states, setStates] = useState<any>([])
    const [cities, setCities] = useState<any>([])
    const [countries, setCountries] = useState<any>([])

    const [educationIdsToDelete, setEducationIdsToDelete] = useState<any>([])
    const [experienceIdsToDelete, setExperienceIdsToDelete] = useState<any>([])
    const [skillsIdsToDelete, setSkillsIdsToDelete] = useState<any>([])
    const [documents, setDocuments] = useState<any>({})
    const dispatch = useAppDispatch()
    let user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const [wordCount, setWordCount] = useState(0);
    const isOrganization = user?.userType === 'ORGANIZATION' ? true : false

    const [loading, setLoading] = useState<boolean>(false)


    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let words = event.target.value.trim().split(/\s+/).filter(word => word.length > 0);

        if (words.length > 500) {
            words = words.slice(0, 500);
        }
        const newValue = words.join(" ");
        // setValue("about", newValue); 
        setWordCount(words.length);
    };

    const getUserDetails = async () => {
        await apiCall(requests.getUserInfo, {}, 'get', false, dispatch, user, router).then((res: any) => {
            if (res?.error) {
                return;
            } else {

                dispatch(setUser(res?.data))
            }
        }).catch(err => console.warn(err))
    }


    const formatedDate = (date: string) => {
        const formattedDate = new Date(date).toISOString().split("T")[0]
        return formattedDate
    }

    useEffect(() => {
        getAllSkills(null)
        if (user?.profilePicture) {
            setValue('profilePicture', user?.profilePicture)
            setDocuments(user?.profilePicture)
        }

        if (user?.skills?.length > 0) {
            const preSelectedSkills = skills.filter((skill: any) =>
                user?.skills?.some((uSkill: any) => uSkill?.skillId === skill.value)  // Match skillId with value
            );
            setValue("skills", preSelectedSkills); // Set pre-selected skills to the form
        }
        getCountries()
        getStates(user?.address?.countryId)
        getCities(user?.address?.stateId)



    }, [])

    useEffect(() => {
        if (user?.education) {
            const map = user?.education.reduce((acc: any, edu: any, index: number) => {
                acc[index] = edu.id;
                return acc;
            }, {});
            setEducationIdsMap(map);
        }

        if (user?.experience) {
            const tap = user?.experience.reduce((acc: any, edu: any, index: number) => {
                acc[index] = edu.id;
                return acc;
            }, {});
            setExperienceIdsMap(tap);
        }

    }, [user?.education]);

    const { register, setValue, getValues, setError, watch, control, handleSubmit, formState: { errors, } } = useForm<FormSchematype>({
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            organizationName: user?.organizationName || '',
            organizationType: user?.organizationType || '',
            email: user?.email,
            title: user?.title || '',
            about: user?.about,
            education: user?.education?.length > 0
                ? user.education?.map((edu: any) => ({
                    institution: edu.institution || '',
                    degree: edu.degree || '',
                    date: formatedDate(edu.date) || '',
                    id: edu.id || ''
                }))
                : [{
                    institution: '',
                    degree: '',
                    date: ''
                }],
            experience: user?.experience?.length > 0 ? user?.experience?.map((exp: any) => ({
                companyName: exp.companyName || '',
                role: exp.role || '',
                startDate: formatedDate(exp.startDate) || '',
                endDate: formatedDate(exp.endDate) || '',
                description: exp.description || '',
                id: exp.id || '',
            })) : [{
                companyName: '',
                role: '',
                startDate: '',
                endDate: '',
                description: '',
            }],
            educationIdsToDelete: educationIdsToDelete,
            experienceIdsToDelete: [],
            disabilityDetail: user?.disabilityDetail || '',
            // profileType: user?.profile?.length > 0 && user?.profile[0]?.type,
            userType: user?.userType,
            skills: [],
            disability: user?.disability,
            skillsIdsToDelete: [],
            isPromoted: user?.profile?.length > 0 && user?.profile[0]?.promoted ? 'true' : 'false',
            city: user?.address?.cityId || '',
            state: user?.address?.stateId || '',
            country: user?.address?.countryId || '',


        },
        resolver: zodResolver(editProfileSchema),
        mode: 'all',
    })
    console.log(watch('country'))

    const { fields, remove, prepend, append } = useFieldArray({
        control,
        name: 'education',
    });

    const { fields: experienceFields, remove: removeExperience, prepend: prependExperience } = useFieldArray({
        control,
        name: 'experience',
    });

    const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
        const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0
        setDocuments(uploadedFileIds[0])
        setValue('profilePicture', uploadedFileIds[0])
        return uploadedFileIds;
    }

    // useEffect(() => {
    //     if (skills?.length > 0) {
    //         const preSelectedSkills = skills.filter((skill: any) =>
    //             user?.skills?.some((uSkill: any) => uSkill?.skillId === skill.value)  // Match skillId with value
    //         );
    //         setValue("skills", preSelectedSkills); // Set pre-selected skills to the form
    //     }
    // }, [skills]);

    const getAllSkills = async (name: any) => {
        const response = await apiCall(requests.getSkills, {}, 'get', false, dispatch, null, null)
        if (name?.length > 0) {
            const filteredSkills = response?.data?.data?.skills?.filter((skill: any) =>
                name.includes(skill.name)
            )
            setValue('skills', filteredSkills?.map((skill: any) => ({
                label: skill.name,
                value: skill.id,
            })) || [])
        }
        setSkills(response?.data?.data?.skills?.map((skill: any) => ({
            label: skill.name,
            value: skill.id,
        })) || [])
    }

    const addSkills = async (name: string[]) => {
        const param = {
            names: name
        }
        const response = await apiCall(requests.getSkills, param, 'post', false, dispatch, null, null)
        if (response?.data?.data) {
            await getAllSkills(name)
        }
    }
    const getCountries = async () => {
        await apiCall(requests.countries, {}, 'get', false, null, null, null).then(async (res: any) => {
            console.log('rr', res)
            setCountries(res?.data)
            if (user?.address?.countryId) {
                console.log(user?.address?.countryId, countries)
                setValue('country', user?.address?.countryId?.toString())
            }

        }).catch(err => console.warn(err))
    }


    const getStates = async (countId: number | null) => {
        await apiCall(`${requests.states}?countryId=${countId}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            console.log('states', res)
            setStates(res?.data)

            if (user?.address?.stateId) {
                setValue('state', String(user?.address?.stateId))
            }
            // setcategories(res?.data?.data?.categories || [])

        }).catch(err => console.warn(err))
    }
    const getCities = async (stateId: number | null) => {
        console.log('dd')
        await apiCall(`${requests.cities}?stateId=${stateId}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            console.log('cities', res)
            setCities(res?.data)
            if (user?.address?.cityId) {
                setValue('city', String(user?.address?.cityId))
            }
            // setcategories(res?.data?.data?.categories || [])

        }).catch(err => console.warn(err))
    }

    const onSubmit: SubmitHandler<FormSchematype> = async (data: any) => {
        const formData = dataForServer(data)
        await apiCall(requests.editUser + user?.id, formData, 'put', true, dispatch, user, router).then((res: any) => {
            let message: any;
            if (res?.error) {
                message = res?.error?.message;

                if (Array.isArray(message)) {
                    message?.map((msg: string) => toast.error(msg ? msg : 'Something went wrong, please try again'));
                } else {
                    toast.error(message ? message : 'Something went wrong, please try again')
                }

            } else {
                getUserDetails()
                toast.success(res?.data?.message)
                // window.location.reload();

            }
        }).catch(err => {
            // setIsFormSubmitted(false)
            console.warn(err)
        })
    }

    const handleGenerateAI = async () => {
        setLoading(true)
        if (watch('title') === '') {
            setError('title', { message: "Please Enter the Title" })
            setLoading(false)
            return;
        }

        if (watch('title') !== '') {
            const response = await apiCall(requests.createBio, { prompt: `${watch('title')}` }, 'post', false, dispatch, null, null)
            if (response?.data) {
                if (response?.data?.coreSkills?.length > 0) {
                    await addSkills(response?.data?.coreSkills)
                }
                if (response?.data?.professionalBio) {
                    let words = response?.data?.professionalBio.trim().split(/\s+/).filter((word: any) => word.length > 0);
                    if (words.length > 500) {
                        words = words.slice(0, 500);
                    }
                    setWordCount(words.length);

                    setValue('about', response?.data?.professionalBio || '')
                }
            }
            setLoading(false)
        }
    }
    console.log('errrr', errors)

    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    Profile Settings
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body bg-gray">
                        <div className='container'>
                            <div className='text-center mb-4 mt-1 '>
                                <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="img" documents={documents} />
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    {isOrganization && <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Organization Name <span style={{ color: 'red' }}>*</span></label>
                                        <input {...register('organizationName')} type="text" className="form-control  bg-light invert text-dark border-0" id="exampleFormControlInput1" placeholder="Organization Name" />
                                        {
                                            errors.organizationName && (
                                                <div className="text-danger pt-2">{errors.organizationName.message}</div>
                                            )
                                        }
                                    </div>}
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">First Name <span style={{ color: 'red' }}>*</span></label>
                                        <input {...register('firstName')} type="text" className="form-control  bg-light invert text-dark border-0" id="exampleFormControlInput1" placeholder="First Name" />
                                        {
                                            errors.firstName && (
                                                <div className="text-danger pt-2">{errors.firstName.message}</div>
                                            )
                                        }
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Title : <span style={{ color: 'red' }}>*</span></label>
                                        <input {...register('title')} type="text" className="form-control  bg-light invert text-dark border-0" id="exampleFormControlInput1" placeholder="Title" />
                                    </div>

                                    <div className=" mb-3">
                                        <label className="form-label text-light fs-12">About <span style={{ color: 'red' }}>*</span></label>
                                        <textarea {...register('about')} className="form-control  bg-light invert text-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="About" ></textarea>
                                        <div className='d-flex justify-content-between align-items-center mt-1 mb-3'>
                                            <p className="invert text-dark">{wordCount}/200 words</p>
                                            <p className='btn text-info btn-sm rounded-pill p-0' onClick={handleGenerateAI}>Generate through AI</p>
                                        </div>
                                        {
                                            errors.about && (
                                                <div className="text-danger pt-2">{errors.about.message}</div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    {isOrganization && <div className="mb-3">
                                        <label htmlFor="organizationType" className="form-label text-light fs-12 ">Organization Type  <span style={{ color: 'red' }}>*</span></label>
                                        <select {...register("organizationType")} className="form-select bg-light invert" id="taskDropdown" defaultValue="" >
                                            <option value="" disabled>Organization Type </option>
                                            <option value="COMPANY">Company</option>
                                            <option value="GOVERNMENT">Government</option>
                                            <option value="NON_PROFIT">Non-Profit Organization</option>
                                        </select>
                                        {
                                            errors.organizationType && (
                                                <div className="text-danger pt-2">{errors.organizationType.message}</div>
                                            )
                                        }
                                    </div>}
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Last Name <span style={{ color: 'red' }}>*</span></label>
                                        <input {...register('lastName')} type="text" className="form-control  bg-light invert text-dark border-0" id="exampleFormControlInput1" placeholder="Last Name" />
                                        {
                                            errors.lastName && (
                                                <div className="text-danger pt-2">{errors.lastName.message}</div>
                                            )
                                        }
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-light fs-12">Email Address <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" className="form-control  bg-light invert text-dark border-0" id="exampleFormControlInput1" placeholder="Email" readOnly value={user?.email} />
                                        {
                                            errors.email && (
                                                <div className="text-danger pt-2">{errors.email.message}</div>
                                            )
                                        }

                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-light fs-12">Zip/ Postal Code <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" className="form-control  bg-light invert text-dark border-0" id="exampleFormControlInput1" placeholder="Zip Code" value={user?.address?.zip} />
                                    </div>
                                </div>
                            </div>
                            <div className='bordr mt-4'></div>
                            <div className='experience-sec my-4 d-flex align-items-center justify-content-between'>
                                <h3>Education & Certification</h3>
                                <Icon
                                    icon="line-md:plus-square-filled"
                                    width={28}
                                    height={28}
                                    onClick={() => {
                                        prepend({ institution: '', degree: '', date: '' })
                                        setEducationIdsMap(prevMap => ({ [0]: Math.random().toString(36).substring(2), ...Object.fromEntries(Object.entries(prevMap).map(([k, v]) => [parseInt(k) + 1, v])) }));
                                    }}
                                    style={{ cursor: 'pointer', color: 'white' }}
                                />
                            </div>
                            {fields?.map((item: any, index: number) => (
                                <div className='row' key={item?.id}>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor={`education.${index}.institution`} className="form-label text-light fs-12">Institution <span style={{ color: 'red' }}>*</span></label>
                                            <input {...register(`education.${index}.institution`)} type="text" className="form-control bg-light text-dark invert  border-0" placeholder="Institution" />
                                            {
                                                errors.education?.[index]?.institution && (
                                                    <div className="text-danger pt-2">{errors.education?.[index]?.institution.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor={`education.${index}.date`} className="form-label text-light fs-12">Date <span style={{ color: 'red' }}>*</span></label>
                                            <input {...register(`education.${index}.date`)} type="date" className="form-control text-dark invert border-0" placeholder="28/03/2024" />
                                            {
                                                errors.education?.[index]?.date && (
                                                    <div className="text-danger pt-2">{errors.education?.[index]?.date.message}</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor={`education.${index}.degree`} className="form-label text-light fs-12">Degree <span style={{ color: 'red' }}>*</span></label>
                                            <select
                                                {...register(`education.${index}.degree`)}
                                                className="form-select bg-light invert text-secondary"
                                                id={`education.${index}.degree`}
                                            >
                                                <option value="">Select Degree <span style={{ color: 'red' }}>*</span></option>
                                                <option value="School">School</option>
                                                <option value="College">College</option>
                                                <option value="University">University</option>
                                            </select>
                                            {
                                                errors.education?.[index]?.degree && (
                                                    <div className="text-danger pt-2">{errors.education?.[index]?.degree.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className='col-md-6 text-end' style={{ marginTop: '2.15rem' }}>
                                            <Icon
                                                icon="line-md:minus-square-filled" width={28}
                                                height={28}
                                                onClick={(e) => {
                                                    remove(index)
                                                    const originalId = educationIdsMap[index];

                                                    setEducationIdsMap((prevMap) => {
                                                        const updatedMap = { ...prevMap };
                                                        delete updatedMap[index];
                                                        const newMap = Object.entries(updatedMap).reduce((acc: any, [k, v]) => {
                                                            acc[parseInt(k) - (parseInt(k) > index ? 1 : 0)] = v;
                                                            return acc;
                                                        }, {});
                                                        return newMap;
                                                    });

                                                    // if(typeof originalId === 'number'){
                                                    //     setValue('educationIdsToDelete', [])
                                                    // }

                                                    setEducationIdsToDelete((prev: any) => {
                                                        const updated = typeof originalId === 'number' ? [...prev, originalId] : [...prev];
                                                        setValue('educationIdsToDelete', updated);
                                                        return updated;
                                                    });
                                                }}
                                                style={{ cursor: 'pointer', color: 'white' }}
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}

                            <div className='bordr mt-4'></div>
                            <div className="experience-sec my-4 d-flex align-items-center justify-content-between">
                                <h3 className="mb-0">Experience</h3>
                                <Icon
                                    icon="line-md:plus-square-filled"
                                    width={28}
                                    height={28}
                                    onClick={() => prependExperience({
                                        companyName: '', role: '', startDate: '', endDate: '', description: '',
                                        id: 0
                                    })}
                                    style={{ cursor: 'pointer', color: 'white' }}
                                />
                            </div>
                            {experienceFields?.map((item: any, index: number) => (
                                <div className='row' key={item.id}>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor={`experience.${index}.role`} className="form-label text-light fs-12">Job Title <span style={{ color: 'red' }}>*</span></label>
                                            <input  {...register(`experience.${index}.role`)} type="text" className="form-control  bg-light invert text-dark  border-0" id="exampleFormControlInput1" placeholder="Job Title" />
                                            {
                                                errors.experience?.[index]?.role && (
                                                    <div className="text-danger pt-2">{errors.experience?.[index]?.role.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor={`experience.${index}.companyName`} className="form-label text-light fs-12">Company Name <span style={{ color: 'red' }}>*</span></label>
                                            <input {...register(`experience.${index}.companyName`)} type="text" className="form-control  bg-light invert text-dark  border-0" id="exampleFormControlInput1" placeholder="Company Name" />
                                            {
                                                errors.experience?.[index]?.companyName && (
                                                    <div className="text-danger pt-2">{errors.experience?.[index]?.companyName.message}</div>
                                                )
                                            }
                                        </div>

                                        <div className=" mb-3">
                                            <label htmlFor={`experience.${index}.description`} className="form-label text-light fs-12">Job Description <span style={{ color: 'red' }}>*</span></label>
                                            <textarea {...register(`experience.${index}.description`)} className="form-control  bg-light invert text-dark  border-0" id="exampleFormControlTextarea1" rows={3} placeholder="Job Description"></textarea>
                                            {
                                                errors.experience?.[index]?.description && (
                                                    <div className="text-danger pt-2">{errors.experience?.[index]?.description.message}</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        {/* <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Employment type :</label>
                                        <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                            <option selected>Full-time</option>
                                            <option value="1">Part-time</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-light fs-12">Location type :</label>
                                        <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                            <option selected>On-site</option>
                                            <option value="1">Remote</option>
                                        </select>
                                    </div> */}
                                        <div className="mb-3">
                                            <label htmlFor={`experience.${index}.startDate`} className="form-label text-light fs-12">Start Date <span style={{ color: 'red' }}>*</span></label>
                                            <input {...register(`experience.${index}.startDate`)} type="date" className="form-control  bg-light invert text-dark  border-0" id="exampleFormControlInput1" placeholder="Start Date" />
                                            {
                                                errors.experience?.[index]?.startDate && (
                                                    <div className="text-danger pt-2">{errors.experience?.[index]?.startDate.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor={`experience.${index}.endDate`} className="form-label text-light fs-12">End Date <span style={{ color: 'red' }}>*</span></label>
                                            <input {...register(`experience.${index}.endDate`)} type="date" className="form-control  bg-light invert text-dark  border-0" id="exampleFormControlInput1" min={watch(`experience.${index}.startDate`)} placeholder="End Date" />
                                            {
                                                errors.experience?.[index]?.endDate && (
                                                    <div className="text-danger pt-2">{errors.experience?.[index]?.endDate.message}</div>
                                                )
                                            }
                                        </div>
                                        <Icon
                                            icon="line-md:minus-square-filled" width={28}
                                            height={28}
                                            onClick={() => {
                                                removeExperience(index)
                                                const originalId = experienceIdsMap[index];

                                                setExperienceIdsMap((prevMap) => {
                                                    const updatedMap = { ...prevMap };
                                                    delete updatedMap[index];
                                                    const newMap = Object.entries(updatedMap).reduce((acc: any, [k, v]) => {
                                                        acc[parseInt(k) - (parseInt(k) > index ? 1 : 0)] = v;
                                                        return acc;
                                                    }, {});
                                                    return newMap;
                                                });

                                                // if(typeof originalId === 'number'){
                                                //     setValue('educationIdsToDelete', [])
                                                // }

                                                setExperienceIdsToDelete((prev: any) => {
                                                    const updated = typeof originalId === 'number' ? [...prev, originalId] : [...prev];
                                                    setValue('experienceIdsToDelete', updated);
                                                    return updated;
                                                });
                                            }}
                                            style={{ cursor: 'pointer', color: 'white' }}
                                        />

                                    </div>
                                </div>))}


                            <div className='bordr mt-4'></div>
                            <div className='experience-sec my-4'>
                                <h3>Other</h3>
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    {user?.profile?.length > 0 && user?.profile[0]?.type === 'TE' && <div className="mb-3">
                                        <label className='text-light fs-12 me-2'>Promotion :</label>
                                        <div className='d-flex align-items-center '>

                                            <div className="form-check me-3">
                                                <label className="form-check-label text-light fs-12" htmlFor="isPromoted">
                                                    <input {...register('isPromoted')} className="form-check-input" type="radio" value={'true'} name="isPromoted" id="isPromoted"
                                                    />
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="form-check me-3">
                                                <label className="form-check-label text-light fs-12" htmlFor="isPromoted">
                                                    <input {...register('isPromoted')} className="form-check-input text-dark" type="radio" value={'false'} name="isPromoted" id="isPromoted"
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>}


                                    <div className='mb-3'>
                                        <div className="form-check mb-3 text-light fs-12">
                                            <input {...register('disability')} className="form-check-input bg-transparent border-light" type="checkbox" value="" id="isDisabled" />
                                            <label className="form-check-label fw-medium" htmlFor="isDisabled">
                                                I declare that I am a person with disability
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Disability Detail :</label>
                                        <input {...register('disabilityDetail')} type="text" className="form-control bg-light invert text-dark  border-0" id="exampleFormControlInput1" placeholder="Disability Detail" />
                                    </div>
                                    <div className='mb-3'>
                                        {
                                            errors.disabilityDetail && (
                                                <div className="text-danger pt-2">{errors.disabilityDetail.message}</div>
                                            )
                                        }
                                    </div>

                                </div>
                                <div className='col-md-6'>

                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Skills <span style={{ color: 'red' }}>*</span></label>
                                        <Controller
                                            name="skills"
                                            control={control}
                                            render={({ field }: any) => (
                                                <CreatableSelect
                                                    {...field}
                                                    isMulti
                                                    options={skills || ''}
                                                    className="custom-select-container  bg-light invert text-dark "
                                                    classNamePrefix="custom-select"
                                                    value={field.value}
                                                    onChange={(selectedOptions: any) => {
                                                        const previousValue = getValues('skills') || [];
                                                        const deletedSkills = previousValue.filter(
                                                            (option: any) => !selectedOptions.some((selected: any) => selected.value === option.value)
                                                        );

                                                        if (deletedSkills.length > 0) {
                                                            const deletedIds = deletedSkills.map((deletedSkill: any) => deletedSkill.value);

                                                            setSkillsIdsToDelete((prev: any) => [...prev, ...deletedIds]);

                                                            setValue('skillsIdsToDelete', [...(getValues('skillsIdsToDelete') || []), ...deletedIds]);
                                                        }
                                                        field.onChange(selectedOptions);
                                                    }}
                                                />
                                            )}
                                        />
                                        {
                                            errors.skills && (
                                                <div className="text-danger pt-2">{errors.skills.message}</div>
                                            )
                                        }
                                    </div>

                                </div>
                            </div>

                            <div className='bordr mt-4'></div>
                            <div className='experience-sec my-4'>
                                <h3>Address</h3>
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label className="form-label text-white fs-14" htmlFor='country'>Country :</label>
                                        <select {...register('country')} className="form-select invert text-dark border-0 text-tertiary" name="country" onChange={(e) => {
                                            // getStates(e?.target?.value !== "" ? Number(e?.target?.value) : null)
                                            console.log(":::", e.target.value)
                                        }}>
                                            <option value={''}>Country</option>
                                            {countries?.length > 0 && countries?.map((country: any) => (<option key={country?.id} value={country?.id}>{country?.name}</option>))}
                                        </select>
                                        {
                                            errors.country && (
                                                <div className="text-danger pt-2">{errors.country.message}</div>
                                            )
                                        }
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-white fs-14">City/Town :</label>
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

                                </div>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label className="form-label text-white fs-14">State/Province :</label>
                                        <select {...register('state')} className="form-select invert text-dark border-0 text-tertiary" aria-label="Default select example" onChange={(e) => {
                                            console.log('first')
                                            getCities(e?.target?.value !== "" ? Number(e?.target?.value) : null)
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

                                    <div className='button d-flex justify-content-end mt-5'>
                                        <div className='mb-3'></div>
                                        <button className="btn rounded-pill btn-outline-info  ls" type='button'>Discard</button>
                                        <button type='submit' className="btn btn-info rounded-pill hero-btn ms-4">Save</button>
                                    </div>
                                </div>
                            </div>




                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ProfileSetting