import React from 'react'

const Education_Certification : React.FC<any> = ({register, errors}) => {
  return (
    <div>
       <div className='row'>
                        <div className='col-md-6'>
                          <div className='mb-3'>
                            <label htmlFor="institution" className="form-label">Institution :</label>
                            <select {...register("institution")} className="form-select bg-dark text-secondary" aria-label="Default select example" id ="institution">
                              <option selected>Instituion</option>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </select>
                            {
                              errors.institution && (
                                <div className="text-danger pt-2">{errors.institution.message}</div>
                              )
                            }
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='mb-3'>
                            <label htmlFor="degree" className="form-label">Degree :</label>
                            <select {...register("degree")} className="form-select bg-dark text-secondary" aria-label="Default select example">
                              <option selected>Degree</option>
                              <option value="1">School</option>
                              <option value="2">College</option>
                              <option value="3">University</option>
                            </select>
                            {
                              errors.degree && (
                                <div className="text-danger pt-2">{errors.degree.message}</div>
                              )
                            }
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="mb-3">
                            <label htmlFor="date" className="form-label">Date :</label>
                            <input {...register("date")} type="date" className="form-control bg-dark" id="date"/>
                            {
                              errors.date && (
                                <div className="text-danger pt-2">{errors.date.message}</div>
                              )
                            }
                          </div>
                        </div>
                    
                      </div>
    </div>
  )
}

export default Education_Certification
