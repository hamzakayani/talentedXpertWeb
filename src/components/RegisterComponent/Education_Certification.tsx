import React from 'react'
import { Icon } from '@iconify/react';

const Education_Certification: React.FC<any> = ({ fields, register, errors, prepend, remove, watch }) => {
  return (
    <div>
      <div className='row'>
            <div className='col-12'>
              <div className='mb-3'>
                <label className="form-label">Resume:</label>
                <div className="d-grid gap-2">
                  <button className="btn bg-dark text-light fs-12 rounded-pill" type="button"><Icon icon="uil:upload" className='me-1' /> Upload Resume</button>
                </div>
              </div>
            </div>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h6>Education</h6>
          <Icon
            icon="line-md:plus-square-filled"
            width={28}
            height={28}
            onClick={() => prepend({ institution: '', degree: '', date: '' })}
            style={{ cursor: 'pointer' }}
          />
        </div>
        {fields?.map((item: any, index: number) => (
          <div key={item.id} className='row mb-3'>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label htmlFor={`education.${index}.institution`} className="form-label">Institution: <span style={{ color: 'red' }}>*</span></label>
                <input
                  {...register(`education.${index}.institution`)}
                  className="form-control bg-dark"
                  id={`education.${index}.institution`}
                >
                </input>
                {errors.education?.[index]?.institution && (
                  <div className="text-danger pt-2">{errors.education[index].institution.message}</div>
                )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label htmlFor={`education.${index}.degree`} className="form-label">Degree: <span style={{ color: 'red' }}>*</span></label>
                <select
                  {...register(`education.${index}.degree`)}
                  className="form-select bg-light invert"
                  id={`education.${index}.degree`}
                >
                  <option value="">Select Degree </option>
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                </select>
                {errors.education?.[index]?.degree && (
                  <div className="text-danger pt-2">{errors.education[index].degree.message}</div>
                )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className="mb-3">
                <label htmlFor={`education.${index}.date`} className="form-label">Completion Date: <span style={{ color: 'red' }}>*</span></label>
                <input
                  {...register(`education.${index}.date`)}
                  type="date"
                  className="form-control invert"
                  id={`education.${index}.date`}
                />
                {errors.education?.[index]?.date && (
                  <div className="text-danger pt-2">{errors.education[index].date.message}</div>
                )}
              </div>
            </div>
            <div className='col-md-6 text-end' style={{ marginTop: '2.15rem' }}>
              <Icon
                icon="line-md:minus-circle-filled" width={28}
                height={28}
                onClick={() => remove(index)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Education_Certification
