'use client';
import React, { useState } from 'react';
import { Stepper, Step } from 'react-form-stepper';
import { Icon } from '@iconify/react';
import Image from "next/image";



const RegisterComponent: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0); // Explicitly typing the state as a number

  const handleNext = (): void => {
    if (activeStep < 2) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = (): void => {
    if (activeStep > 0) {
      setActiveStep(prevStep => prevStep - 1);
    }
  };

  const handleReset = (): void => {
    setActiveStep(0);
  };

  return (
    <div>
      <Stepper activeStep={activeStep}>
        <Step label="Individual account" />
        <Step label="Education & Certification" />
        <Step label="Other" />
      </Stepper>

      <div>
        {activeStep === 0 && <div>
          <section className='stepper-page-section my-4'>
            <div className='container'>
              <div className='row mt-5'>
                <div className='col-md-8 mx-auto'>
                  <div className="card bg-tertiary">
                    <div className="card-body my-4 mx-4">
                      <div className='row'>
                        <div className='col-12'>
                          <div className='d-flex flex-wrap mb-3'>
                            <p className='me-3 text-dark fw-medium mb-0'>User Type :</p>
                            <div className="form-check radio me-4">
                              <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                              <label className="form-check-label" htmlFor="flexRadioDefault2">
                                TalentedXpert
                              </label>
                            </div>
                            <div className="form-check radio me-3">
                              <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                              <label className="form-check-label" htmlFor="flexRadioDefault2">
                                TalentedXpert
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">First Name :</label>
                            <input type="text" className="form-control bg-dark" placeholder="First name" aria-label="First name" />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label ">Last Name :</label>
                            <input type="text" className="form-control bg-dark" placeholder="First name" aria-label="First name" />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label"> Email Id : </label>
                            <input type="email" className="form-control bg-dark" id="exampleFormControlInput1" placeholder="Enter your email"></input>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label"> Mobile : </label>
                            <input type="text" className="form-control bg-dark" id="exampleFormControlInput1" placeholder="123456789"></input>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Password :</label>
                            <input type="password" id="inputPassword5" className="form-control bg-dark" aria-describedby="passwordHelpBlock" placeholder="*********"></input>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Re-Enter-Password :</label>
                            <input type="password" id="inputPassword5" className="form-control bg-dark" aria-describedby="passwordHelpBlock" placeholder="*********"></input>
                          </div>
                        </div>
                        <div className='text-end mt-4'>
                          <button type="button" className="btn btn-info rounded-pill signup-btn" >Next</button>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>}
        {activeStep === 1 && <div>
          <section className='stepper-page-section my-4'>
            <div className='container'>
              <div className='row mt-5'>
                <div className='col-md-8 mx-auto'>
                  <div className="card bg-tertiary">
                    <div className="card-body my-4 mx-4">
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='mb-3'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Institution :</label>
                            <select className="form-select bg-dark text-secondary" aria-label="Default select example">
                              <option selected>Instituion</option>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='mb-3'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Degree :</label>
                            <select className="form-select bg-dark text-secondary" aria-label="Default select example">
                              <option selected>Instituion</option>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Date :</label>
                            <input type="text" className="form-control bg-dark" id="exampleFormControlInput1" placeholder="mm/dd/yyy"></input>
                          </div>
                        </div>
                        <div className='text-end mt-4'>
                          <button type="button" className="btn btn-info rounded-pill signup-btn" >Next</button>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>}
        {activeStep === 2 && <div>
          <section className='stepper-page-section my-4'>
            <div className='container'>
              <div className='row mt-5'>
                <div className='col-md-8 mx-auto'>
                  <div className="card bg-tertiary">
                    <div className="card-body my-4 mx-4">
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">About :</label>
                            <input type="text" className="form-control bg-dark" id="exampleFormControlInput1" placeholder="About"></input>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Skills :</label>
                            <input type="text" className="form-control bg-dark" id="exampleFormControlInput1" placeholder="Skills"></input>
                          </div>
                        </div>
                        <div className='col-12 my-3'>
                          <div className="form-check mb-3">
                            <input className="form-check-input bg-transparent border-dark" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label fw-medium" htmlFor="flexCheckDefault">
                              I declare that I am a person with disability
                            </label>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Disability Detail :</label>
                            <input type="text" className="form-control bg-dark" id="exampleFormControlInput1" placeholder="Disability Detail"></input>
                          </div>
                        </div>
                        <div className='text-end mt-4'>
                          <button type="button" className="btn btn-info rounded-pill signup-btn" >Done</button>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>}
      </div>

      <div>
        <button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </button>
        <button onClick={activeStep === 2 ? handleReset : handleNext}>
          {activeStep === 2 ? 'Reset' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
