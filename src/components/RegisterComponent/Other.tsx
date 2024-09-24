import React from 'react'

const Other : React.FC<any> = ({register, errors, watch}) => {
  const isDisabledChecked = watch("isDisabled");
  return (
    <div>
      <div className='row'>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="about" className="form-label">About :</label>
                            <input {...register("about")} type="text" className="form-control bg-dark" id="about" placeholder="About"></input>
                            {
                              errors.about && (
                                <div className="text-danger pb-2">{errors.about.message}</div>
                              )
                            }
                            
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="skills" className="form-label">Skills :</label>
                            <input {...register("skills")} type="text" className="form-control bg-dark" id="skills" placeholder="Skills"></input>
                            {
                              errors.skills && (
                                <div className="text-danger pb-2">{errors.skills.message}</div>
                              )
                            }
                          </div>
                        </div>
                        <div className='col-12 my-3'>
                          <div className="form-check mb-3">
                            <input {...register("isDisabled")} className="form-check-input bg-transparent border-dark" type="checkbox" value="" id="isDisabled" />
                            <label className="form-check-label fw-medium" htmlFor="isDisabled">
                              I declare that I am a person with disability
                            </label>
                          </div>
                        </div>
                        {isDisabledChecked && (
                          <div className='col-md-6'>
                            <div className="mb-3">
                              <label htmlFor="disabilityDetail" className="form-label">Disability Detail:</label>
                              <input
                                {...register("disabilityDetail")}
                                type="text"
                                className="form-control bg-dark"
                                id="disabilityDetail"
                                placeholder="Disability Detail"
                              />
                            </div>
                          </div>
                        )}
                        
                      
                      </div>
    </div>
  )
}

export default Other
