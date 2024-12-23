import React, { useState } from 'react'
import { Icon } from '@iconify/react';


const Individual_account: React.FC<any> = ({ register, errors }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <div>
      <div className='row'>
        <div className='col-12'>
          <div className='d-flex flex-wrap flex-column flex-lg-row mb-3'>
            <p className='me-3 text-dark fw-medium mb-0'>User Type :</p>
            <div className="form-check radio me-4">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="profileType1" value="TE" />
              <label className="form-check-label" htmlFor="profileType1">
                Talented Xpert
              </label>
            </div>
            <div className="form-check radio me-3">
              <input {...register("profileType")} className="form-check-input" type="radio" name="profileType" id="profileType1" value="TR" />
              <label className="form-check-label" htmlFor="profileType1">
                Talent Requester
              </label>
            </div>

          </div>
          {
            errors.profileType && (
              <div className="text-danger pb-2">{errors.profileType.message}</div>
            )
          }
        </div>
        <div className='col-12'>
          <div className='mb-3'>
            <label className="form-label">Start by uploading resume:</label>
            <div className="d-grid gap-2">
              <button className="btn bg-dark text-light fs-12 rounded-pill" type="button"><Icon icon="uil:upload" className='me-1' /> Upload Resume</button>
            </div>
          </div>
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
            <label htmlFor="email" className="form-label"> Email Id  <span style={{ color: 'red' }}>*</span></label>
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
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Re-Enter-Password <span className='text-danger'>*</span></label>
            <input {...register("confirmPassword")} type="password" id="confirmPassword" className="form-control bg-dark" aria-describedby="passwordHelpBlock" placeholder="*********"></input>
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
