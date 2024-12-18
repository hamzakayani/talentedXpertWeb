import React from 'react'
import { Icon } from '@iconify/react';

const Education_Certification: React.FC<any> = ({ fields, register, errors, append, remove }) => {
  return (
    <div>
      <div className='row'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h6>Education</h6>
          <Icon
            icon="line-md:plus-square-filled"
            width={28}
            height={28}
            onClick={() => append({ institution: '', degree: '', date: '' })}
            style={{ cursor: 'pointer' }}
          />
        </div>
        {fields.map((item: any, index: number) => (
          <div key={item.id} className='row mb-3'>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label htmlFor={`education.${index}.institution`} className="form-label">Institution:</label>
                <select
                  {...register(`education.${index}.institution`)}
                  className="form-select bg-light invert"
                  id={`education.${index}.institution`}
                >
                  <option value="">Select Institution</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
                {errors.education?.[index]?.institution && (
                  <div className="text-danger pt-2">{errors.education[index].institution.message}</div>
                )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label htmlFor={`education.${index}.degree`} className="form-label">Degree:</label>
                <select
                  {...register(`education.${index}.degree`)}
                  className="form-select bg-light invert"
                  id={`education.${index}.degree`}
                >
                  <option value="">Select Degree</option>
                  <option value="1">School</option>
                  <option value="2">College</option>
                  <option value="3">University</option>
                </select>
                {errors.education?.[index]?.degree && (
                  <div className="text-danger pt-2">{errors.education[index].degree.message}</div>
                )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className="mb-3">
                <label htmlFor={`education.${index}.date`} className="form-label">Date:</label>
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
            <div className='col-md-12 text-end mt-2'>
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
