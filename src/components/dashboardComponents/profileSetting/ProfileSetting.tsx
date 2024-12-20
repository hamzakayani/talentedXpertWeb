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

const ProfileSetting = () => {
    type FormSchematype = z.infer<typeof editProfileSchema>
    const [skills, setSkills] = useState<any>([])
    const [educationIdsMap, setEducationIdsMap] = useState<{ [key: number]: string }>({});
    const [experienceIdsMap, setExperienceIdsMap] = useState<{ [key: number]: string }>({});
    const [educationIdsToDelete, setEducationIdsToDelete] = useState<any>([])
    const [experienceIdsToDelete, setExperienceIdsToDelete] = useState<any>([])
    const [skillsIdsToDelete, setSkillsIdsToDelete] = useState<any>([])
    const [documents, setDocuments] = useState<any>({})
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()

    const formatedDate = (date: string) => {
        const formattedDate = new Date(date).toISOString().split("T")[0]
        return formattedDate
    }

    useEffect(() => {
        getAllSkills()
        if(user?.profilePicture){
        setValue('profilePicture', user?.profilePicture)
        setDocuments(user?.profilePicture)
        }
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

    const { register, setValue, getValues, control, handleSubmit, formState: { errors, } } = useForm<FormSchematype>({
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
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
            disabilityDetail: '',
            profileType: user?.profile[0]?.type,
            userType: "INDIVIDUAL",
            skills: [],
            disability: user?.disability,
            skillsIdsToDelete: []

            // mobile: '',
            // password: '',

        },
        resolver: zodResolver(editProfileSchema),
        mode: 'all',
    })

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
console.log('err', errors)
    useEffect(() => {
        if (skills.length > 0) {
            const preSelectedSkills = skills.filter((skill: any) =>
                user.skills?.some((uSkill: any) => uSkill.skillId === skill.value)  // Match skillId with value
            );
            setValue("skills", preSelectedSkills); // Set pre-selected skills to the form
        }
    }, [skills]);

    const getAllSkills = async () => {
        const response = await apiCall(`${process.env.BASE_URL}/skills`, {}, 'get', false, dispatch, null, null)
        setSkills(response?.data?.data?.skills?.map((skill: any) => ({
            label: skill.name,
            value: skill.id,
        })) || [])

    }

    const onSubmit: SubmitHandler<FormSchematype> = async (data: any) => {
        console.log(data)
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
                // setIsFormSubmitted(false)
            } else {
                // setIsFormSubmitted(false)
                // reset({})
                // router.push('/dashboard/viewTasks')

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
                    Profile Settings
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body bg-gray">
                        <div className='container'>
                            <div className='text-center mb-4 mt-1'>
                                <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="img" documents={documents} />
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">First Name :</label>
                                        <input {...register('firstName')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="First Name" />
                                        {
                                            errors.firstName && (
                                                <div className="text-danger pt-2">{errors.firstName.message}</div>
                                            )
                                        }
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Title :</label>
                                        <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Title" />
                                    </div>

                                    <div className=" mb-3">
                                        <label className="form-label text-light fs-12">About :</label>
                                        <textarea {...register('about')} className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="About" ></textarea>
                                        {
                                            errors.about && (
                                                <div className="text-danger pt-2">{errors.about.message}</div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Last Name :</label>
                                        <input {...register('lastName')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Last Name" />
                                        {
                                            errors.lastName && (
                                                <div className="text-danger pt-2">{errors.lastName.message}</div>
                                            )
                                        }
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-light fs-12">Email :</label>
                                        <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Email" readOnly value={user?.email} />
                                        {
                                            errors.email && (
                                                <div className="text-danger pt-2">{errors.email.message}</div>
                                            )
                                        }

                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-light fs-12">Zip Code :</label>
                                        <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Zip Code" value={user?.address?.zip} />
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
                                            <label htmlFor={`education.${index}.institution`} className="form-label text-light fs-12">Institution :</label>
                                            <input {...register(`education.${index}.institution`)} type="text" className="form-control bg-dark border-0" placeholder="Institution" />
                                            {
                                                errors.education?.[index]?.institution && (
                                                    <div className="text-danger pt-2">{errors.education?.[index]?.institution.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor={`education.${index}.date`} className="form-label text-light fs-12">Date :</label>
                                            <input {...register(`education.${index}.date`)} type="date" className="form-control bg-dark border-0" placeholder="28/03/2024" />
                                            {
                                                errors.education?.[index]?.date && (
                                                    <div className="text-danger pt-2">{errors.education?.[index]?.date.message}</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label htmlFor={`education.${index}.degree`} className="form-label text-light fs-12">Degree :</label>
                                            <select
                                                {...register(`education.${index}.degree`)}
                                                className="form-select bg-dark text-secondary"
                                                id={`education.${index}.degree`}
                                            >
                                                <option value="">Select Degree</option>
                                                <option value="1">School</option>
                                                <option value="2">College</option>
                                                <option value="3">University</option>
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
                                                        const newMap = Object.entries(updatedMap).reduce((acc:any, [k, v]) => {
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
                                            <label htmlFor={`experience.${index}.role`} className="form-label text-light fs-12">Job Title :</label>
                                            <input  {...register(`experience.${index}.role`)} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Job Title" />
                                            {
                                                errors.experience?.[index]?.role && (
                                                    <div className="text-danger pt-2">{errors.experience?.[index]?.role.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor={`experience.${index}.companyName`} className="form-label text-light fs-12">Company Name :</label>
                                            <input {...register(`experience.${index}.companyName`)} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Company Name" />
                                            {
                                                errors.experience?.[index]?.companyName && (
                                                    <div className="text-danger pt-2">{errors.experience?.[index]?.companyName.message}</div>
                                                )
                                            }
                                        </div>

                                        <div className=" mb-3">
                                            <label htmlFor={`experience.${index}.description`} className="form-label text-light fs-12">Job Description :</label>
                                            <textarea {...register(`experience.${index}.description`)} className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={3} placeholder="Job Description"></textarea>
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
                                            <label htmlFor={`experience.${index}.startDate`} className="form-label text-light fs-12">Start Date :</label>
                                            <input {...register(`experience.${index}.startDate`)} type="date" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Start Date" />
                                            {
                                                errors.experience?.[index]?.startDate && (
                                                    <div className="text-danger pt-2">{errors.experience?.[index]?.startDate.message}</div>
                                                )
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor={`experience.${index}.endDate`} className="form-label text-light fs-12">End Date :</label>
                                            <input {...register(`experience.${index}.endDate`)} type="date" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="End Date" />
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
                                                        const newMap = Object.entries(updatedMap).reduce((acc:any, [k, v]) => {
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
                                    {/* <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">About :</label>
                                        <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="About" />
                                    </div> */}


                                    <div className='mb-3'>
                                        <div className="form-check mb-3 text-light fs-12">
                                            <input {...register('disability')} className="form-check-input bg-transparent border-light" type="checkbox" value="" id="isDisabled" />
                                            <label className="form-check-label fw-medium" htmlFor="isDisabled">
                                                I declare that I am a person with disability
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Disability Detail :</label>
                                        <input {...register('disabilityDetail')} type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Disability Detail" />
                                    </div>


                                </div>
                                <div className='col-md-6'>

                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Skills :</label>
                                        <Controller
                                            name="skills"
                                            control={control}
                                            render={({ field }: any) => (
                                                <CreatableSelect
                                                    {...field}
                                                    isMulti
                                                    options={skills || ''}
                                                    className="custom-select-container"
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