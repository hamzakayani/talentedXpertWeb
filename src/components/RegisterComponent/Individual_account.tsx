import React, { useState } from 'react'
import { Icon } from '@iconify/react';
import FileUpload from '../common/upload/FileUpload';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';


const Individual_account: React.FC<any> = ({ register, errors, setValue }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any>({})


  const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
    const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0
    setDocuments(uploadedFileIds[0])
    setValue('profilePicture', uploadedFileIds[0])
    return uploadedFileIds;
  }

  return (
    <div>
      <div className='row'>
        <div className='col-12'>
          <div className='d-flex flex-wrap flex-column flex-lg-row mb-3'>
            <p className='me-3 text-dark fw-medium mb-0'>Profile Type :</p>
            <div className="form-check radio me-4">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="profileType1" value="TE" />
              <label className="form-check-label" htmlFor="profileType1">
                Individual
              </label>
            </div>
            <div className="form-check radio me-3">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="profileType1" value="TR" />
              <label className="form-check-label" htmlFor="profileType1">
                Team
              </label>
            </div>
            <div className="form-check radio me-3">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="profileType1" value="TR" />
              <label className="form-check-label" htmlFor="profileType1">
                Company
              </label>
            </div>

          </div>
          <div className='d-flex flex-wrap flex-column flex-lg-row mb-3'>
            <p className='me-3 text-dark fw-medium mb-0'>Account Type :</p>
            <div className="form-check radio me-4">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="profileType1" value="TE" />
              <label className="form-check-label" htmlFor="profileType1">
                As Talented Xpert
              </label>
            </div>
            <div className="form-check radio me-3">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="profileType1" value="TR" />
              <label className="form-check-label" htmlFor="profileType1">
                As Talent Requestor
              </label>
            </div>

          </div>
          {
            errors.profileType && (
              <div className="text-danger pb-2">{errors.profileType.message}</div>
            )
          }
        </div>
        <div className='text-center mb-4 mt-1'>
          <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="img" documents={documents} />
        </div>

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


      </div>
    </div>
  )
}

export default Individual_account
