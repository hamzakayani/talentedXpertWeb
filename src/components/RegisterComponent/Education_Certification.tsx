import React from 'react'
import { Icon } from '@iconify/react';

const Education_Certification: React.FC<any> = ({ fields, register, errors, prepend, remove, watch, experienceFields, prependExp, removeExp }) => {
  return (
    <div>
      <div className='row'>

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
                <label htmlFor={`education.${index}.degree`} className="form-label">Degree <span style={{ color: 'red' }}>*</span></label>
                <input
                  {...register(`education.${index}.degree`)}
                  className="form-control bg-dark"
                  id={`education.${index}.degree`}
                >
                </input>
                {errors.education?.[index]?.degree && (
                  <div className="text-danger pt-2">{errors.education[index].degree.message}</div>
                )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className="mb-3">
                <label htmlFor={`education.${index}.date`} className="form-label">Completion Date <span style={{ color: 'red' }}>*</span></label>
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

      <div className='bordr'></div>
      <div className='row'>

        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h6>Experience</h6>
          <Icon
            icon="line-md:plus-square-filled"
            width={28}
            height={28}
            onClick={() => prependExp({ institution: '', degree: '', date: '' })}
            style={{ cursor: 'pointer' }}
          />
        </div>
        {experienceFields?.map((item: any, index: number) => (
          <div key={item.id} className='row mb-3'>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label htmlFor={`experience.${index}.companyName`} className="form-label">Company <span style={{ color: 'red' }}>*</span></label>
                <input
                  {...register(`experience.${index}.companyName`)}
                  className="form-control bg-dark"
                  id={`experience.${index}.companyName`}
                >
                </input>
                {errors.experience?.[index]?.companyName && (
                      <div className="text-danger pt-2">{errors.experience[index].companyName.message}</div>
                    )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label htmlFor={`experience.${index}.role`} className="form-label">Job Title <span style={{ color: 'red' }}>*</span></label>
                <input
                  {...register(`experience.${index}.role`)}
                  className="form-control bg-dark"
                  id={`experience.${index}.role`}
                >
                </input>
                {errors.experience?.[index]?.role && (
                      <div className="text-danger pt-2">{errors.experience[index].role.message}</div>
                    )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className="mb-3">
                <label htmlFor={`experience.${index}.startDate`} className="form-label">Start Date <span style={{ color: 'red' }}>*</span></label>
                <input
                  {...register(`experience.${index}.startDate`)}
                  type="date"
                  className="form-control invert"
                  id={`experience.${index}.startDate`}
                />
                {errors.experience?.[index]?.startDate && (
                      <div className="text-danger pt-2">{errors.experience[index].startDate.message}</div>
                    )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className="mb-3">
                <label htmlFor={`experience.${index}.endDate`} className="form-label" >End Date <span style={{ color: 'red' }}>*</span></label>
                <div className="d-flex align-items-center gap-3">
                  <input
                    {...register(`experience.${index}.endDate`)}
                    min={watch('startDate')}
                    type="date"
                    className="form-control invert"
                    id={`experience.${index}.endDate`}
                    disabled={watch(`experience.${index}.present`)}
                  />
                  <div className="form-check d-flex align-items-center gap-1 mt-1">
                    <input
                      {...register(`experience.${index}.present`)}
                      type="checkbox"
                      className="form-check-input bg-transparent border-dark"
                      id={`experience.${index}.present`}
                    />
                    <label className="form-check-label" htmlFor={`experience.${index}.present`}>Present</label>
                  </div>
                </div>
                  {errors.experience?.[index]?.endDate && (
                      <div className="text-danger pt-2">{errors.experience[index].endDate.message}</div>
                    )}
              </div>
            </div>

            <div className='col-10'>
              <div className="mb-3">
                <label htmlFor={`experience.${index}.description`} className="form-label">Job Description <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  {...register(`experience.${index}.description`)}
                  type="text"
                  className="form-control bg-dark"
                  id={`experience.${index}.description`}
                  rows={3}
                />
                {errors.experience?.[index]?.description && (
                      <div className="text-danger pt-2">{errors.experience[index].description.message}</div>
                    )}
              </div>
            </div>
            <div className='col-md-2 text-end' style={{ marginTop: '2.15rem' }}>
              <Icon
                icon="line-md:minus-circle-filled" width={28}
                height={28}
                onClick={() => removeExp(index)}
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
