import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import FileUpload from '../common/upload/FileUpload';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';
import { formatedDate, getFileType } from '@/services/utils/util';
import { toast } from 'react-toastify';
import { requests } from '@/services/requests/requests';
import apiCall from '@/services/apiCall/apiCall';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import GlobalLoader from '../common/GlobalLoader/GlobalLoader';


const Individual_account: React.FC<any> = ({ register, errors, setValue, watch, setDocuments, documents }) => {
  const isOrganization = watch("userType") === 'ORGANIZATION' ? true : false;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [resume, setResume] = useState<any>({})
  const dispatch = useAppDispatch();
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user)

  const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
    const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0
    if (getFileType(uploadedFileIds[0]?.key) !== 'image') {
      toast.error('Please select image')
      return []
    }
    else {
      setDocuments(uploadedFileIds[0])
      setValue('profilePicture', uploadedFileIds[0])
      return uploadedFileIds;
    }
  }

  const handleFileSelectResume = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
    const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0
    if (uploadedFileIds.length > 0) {
      setResume(uploadedFileIds)
      resumeAI(uploadedFileIds[0]?.fileUrl)
    }
    return uploadedFileIds;

  }

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

  const resumeAI = async (fileURL: any) => {
    setIsLoading(true);
    const response = await apiCall(requests.cvParser, { folder_path: '/home/ubuntu/Talentedxpert-ai/cv_templates/' }, 'post', true, dispatch, user, router)
    if (response?.data?.results?.length > 0 && response?.data?.results[0]?.parsed_data) {
      setValue('firstName', response?.data?.results[0]?.parsed_data?.firstName || '')
      setValue('lastName', response?.data?.results[0]?.parsed_data?.lastName || '')
      setValue('mobile', response?.data?.results[0]?.parsed_data?.mobile || '')
      setValue('about', response?.data?.results[0]?.parsed_data?.about || '')
      setValue('email', response?.data?.results[0]?.parsed_data?.email || '')
      setValue('title', response?.data?.results[0]?.parsed_data?.title || '')
      setValue('websiteLink', response?.data?.results[0]?.parsed_data?.websiteLink || '')
      setValue('zip', response?.data?.results[0]?.parsed_data?.zip || '')
      setValue('address', {
        address: response?.data?.results[0]?.parsed_data?.address || '',
        street: response?.data?.results[0]?.parsed_data?.street || '',
      })
      if (response?.data?.results[0]?.parsed_data?.skills?.length > 0) {
        await addSkills(response?.data?.results[0]?.parsed_data?.skills)
      }
      if (response?.data?.results[0]?.parsed_data?.education?.length > 0) {
        const formattedEdu = response?.data?.results[0]?.parsed_data?.education?.map((edu: any) => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          date: edu.date || '',
        }));
        setValue("education", formattedEdu)
      }
      if (response?.data?.results[0]?.parsed_data?.experience?.length > 0) {
        const formattedExp = response?.data?.results[0]?.parsed_data?.experience?.map((exp: any) => ({
          companyName: exp?.companyName || '',
          description: exp?.description || '',
          endDate: exp?.endDate || '',
          role: exp?.role || '',
          startDate: exp.date || ''
        }));
        setValue("experience", formattedExp)
      }
      setIsLoading(false);
    }
  }

  return (
    <div>
      {isLoading && <GlobalLoader />}
      <div className='row'>
        <div className='col-12'>
          <div className='d-flex flex-wrap flex-column flex-lg-row mb-3'>
            <p className='me-3 text-dark fw-medium mb-0'>Account Type  <span style={{ color: 'red' }}>*</span></p>
            <div className="form-check radio me-4">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="TE" value="TE" />
              <label className="form-check-label" htmlFor="te">
                As Talented Xpert
              </label>
            </div>
            <div className="form-check radio me-3">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="TR" value="TR" />
              <label className="form-check-label" htmlFor="tr">
                As Talent Requestor
              </label>
            </div>

          </div>
          <div className='d-flex flex-wrap flex-column flex-lg-row mb-3'>
            <p className='me-3 text-dark fw-medium mb-0'>Profile Type :</p>
            <div className="form-check radio me-4">
              <input {...register("userType")} className="form-check-input" type="radio" name="userType" id="INDIVIDUAL" value="INDIVIDUAL" />
              <label className="form-check-label" htmlFor='individual'>
                Individual
              </label>
            </div>

            <div className="form-check radio me-3">
              <input {...register("userType")} className="form-check-input" type="radio" name="userType" id="ORGANIZATION" value="ORGANIZATION" />
              <label className="form-check-label" htmlFor='company'>
                Organization
              </label>
            </div>
            {
              errors.userType && (
                <div className="text-danger pb-2">{errors.userType.message}</div>
              )
            }

          </div>
          {
            errors.profileType && (
              <div className="text-danger pb-2">{errors.profileType.message}</div>
            )
          }
        </div>
        <div className='col-12'>
          <div className='mb-3'>
            <label className="form-label">Resume:</label>
            <div className="d-grid gap-2">
              {/* <button className="btn bg-dark text-light fs-12 rounded-pill" type="button"><Icon icon="uil:upload" className='me-1' /> Upload Resume</button> */}
              <FileUpload onFileSelect={handleFileSelectResume} label="Upload File" accept='image/*,application/pdf' type="task" />

            </div>
          </div>
        </div>
        {isOrganization && <>
          <div className='col-md-6'>
            <div className="mb-3">
              <label htmlFor="organizationName" className="form-label">Organization Name <span style={{ color: 'red' }}>*</span></label>
              <input {...register("organizationName")} type="text" className="form-control bg-dark" placeholder="Organization name" name="organizationName" />
              {
                errors.organizationName && (
                  <div className="text-danger pt-2">{errors.organizationName.message}</div>
                )
              }
            </div>
          </div>
          <div className='col-md-6'>
            <div className="mb-3">
              <label htmlFor="organizationType" className="form-label ">Organization Type  <span style={{ color: 'red' }}>*</span></label>
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
            </div>
          </div>
        </>
        }


        <div className='col-md-6'>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name <span style={{ color: 'red' }}>*</span></label>
            <input {...register("firstName")} type="text" className="form-control bg-dark" placeholder="First name" name="firstName" />
            {
              errors.firstName && (
                <div className="text-danger pt-2">{errors.firstName.message}</div>
              )
            }
          </div>
        </div>
        <div className='col-md-6'>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label ">Last Name  <span style={{ color: 'red' }}>*</span></label>
            <input {...register("lastName")} type="text" className="form-control bg-dark" placeholder="Last name" aria-label="First name" />
            {
              errors.lastName && (
                <div className="text-danger pt-2">{errors.lastName.message}</div>
              )
            }
          </div>
        </div>


        <div className='col-md-6'>
          <div className="mb-3">
            <label htmlFor="email" className="form-label"> Email Address  <span style={{ color: 'red' }}>*</span></label>
            <input {...register("email")} type="email" className="form-control bg-dark" id="email" placeholder="Enter your email"></input>
            {
              errors.email && (
                <div className="text-danger pt-2">{errors.email.message}</div>
              )
            }
          </div>
        </div>
        <div className='col-md-6'>
          <div className="mb-3">
            <label htmlFor="mobile" className="form-label"> Mobile <span className='text-danger'>*</span></label>
            <input {...register("mobile")} type="text" className="form-control bg-dark" id="mobile" placeholder="123456789"></input>
            {
              errors.mobile && (
                <div className="text-danger pt-2">{errors.mobile.message}</div>
              )
            }
          </div>
        </div>
        <div className='col-md-6'>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password <span className='text-danger'>*</span></label>

            <input {...register("password")} type={isPasswordVisible ? 'text' : 'password'} id="Password5" className="form-control bg-dark" aria-describedby="passwordHelpBlock" placeholder="*********"></input>
            <div className="password-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Icon icon={isPasswordVisible ? "mdi:eye-outline" : "mdi:eye-off-outline"} className='text-placeholder' onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
            </div>
            {
              errors.password && (
                <div className="text-danger pt-2">{errors.password.message}</div>
              )
            }

          </div>
        </div>


        <div className='col-md-6'>
          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword" className="form-label">Re-Enter-Password <span className='text-danger'>*</span></label>
            <input {...register("confirmPassword")} type="password" id="confirmPassword" className="form-control bg-dark" aria-describedby="passwordHelpBlock" placeholder="*********"></input>
            <div className="password-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>

            </div>
            {
              errors.confirmPassword && (
                <div className="text-danger pt-2">{errors.confirmPassword.message}</div>
              )
            }
          </div>
        </div>

        <div className='col-md-6'>
          <div className="mb-3 position-relative">
            <label htmlFor="website" className="form-label">Linkedin Url/Website :</label>
            <input type="text" {...register("websiteLink")} id="website" className="form-control bg-dark" placeholder="http/"></input>
            {
              errors?.websiteLink && (
                <div className="text-danger pb-2">{errors?.websiteLink?.message}</div>
              )
            }
          </div>
        </div>
        <div className='text-center mb-4 mt-1'>
          <label htmlFor="profilePicture" className="form-label"> Profile Picture / Logo :</label>
          <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*' type="img" documents={documents} />
        </div>


      </div>
    </div>
  )
}

export default Individual_account
