import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';

const Signin = () => {
  return (
    <section className='sign-in mb-5'>
      <div className='container'>
        <div className='row mt-5'>
          <div className='col-md-8 mx-auto'>
            <div className="card bg-tertiary">
              <div className="card-body mx-4 my-4">
                <div className='row'>
                  <div className='col-md-8 mx-auto'>
                    <h4 className='text-center'>Log in to your account</h4>
                    <p className='fw-medium fs-12 text-center'>Welcome back! Please enter your details.</p>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Email <span className='text-danger'>*</span> </label>
                      <input type="email" className="form-control bg-dark" id="exampleFormControlInput1" placeholder="Enter your email"></input>
                    </div>
                    <div className="mb-3 position-relative">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Password <span className='text-danger'>*</span> </label>
                      <input type="password" id="inputPassword5" className="form-control bg-dark" aria-describedby="passwordHelpBlock" placeholder="Enter password"></input>
                      <div>
                        <Icon icon="mdi:eye-off-outline" className='text-placeholder' />
                      </div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center flex-wrap mb-3'>
                      <div className="form-check">
                        <input className="form-check-input bg-transparent border-dark" type="checkbox" value="" id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          Remember for 30 days
                        </label>
                      </div>
                      <a className='fw-medium text-dark forget'>Forgot Password</a>
                    </div>
                    <div className='text-end mb-3'>
                      <button type="button" className="btn btn-info rounded-pill signin-btn">Sign in</button>
                    </div>
                    <div className='text-center mb-3'>
                      <Image
                        src="/assets/images/signin-line.svg"
                        alt="img"
                        className="img-fluid signin-line"
                        width={255}
                        height={255}
                        priority
                      />
                    </div>
                    <div className='d-flex justify-content-center mb-3'>
                      <div className='signin-rectangle me-2'>
                        <Icon icon="flat-color-icons:google" />
                      </div>
                      <div className='signin-rectangle'>
                      <Icon icon="flowbite:linkedin-solid" className='text-white fs-20'/>
                      </div>
                    </div>
                    <p className=' text-center'>Dont have an account? <a className='forget text-dark fw-medium'>Sign up</a></p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>


    </section >
  )
}

export default Signin