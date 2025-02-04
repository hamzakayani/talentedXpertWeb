import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useAppDispatch } from '@/store/Store';
import React, { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable';

const Other: React.FC<any> = ({ register, errors, watch, Controller, control, setValue }) => {
  const isOrganization = watch("userType")=== 'ORGANIZATION'? true : false;
  console.log(isOrganization)
  const isDisabledChecked = watch("isDisabled");
  const [skills, setSkills] = useState<any[]>([])
  const [wordCount, setWordCount] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let words = event.target.value.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length > 500) {
      words = words.slice(0, 500); 
    }
    const newValue = words.join(" ");
    // setValue("about", newValue); 
    setWordCount(words.length);
  };

  const dispatch = useAppDispatch()

  useEffect(() => {
    getAllSkills()
  }, [])

  const getAllSkills = async () => {
    const response = await apiCall(`${process.env.BASE_URL}/skills`, {}, 'get', false, dispatch, null, null)
    setSkills(response?.data?.data?.skills?.map((skill: any) => ({
      label: skill.name,
      value: skill.id,
    })) || [])
  }

  return (
    <div>
      <div className='row'>
      <div className="mb-3">
            <label htmlFor="firstName" className="form-label">Title <span style={{ color: 'red' }}>*</span></label>
            <input {...register("title")} type="text" className="form-control bg-dark" placeholder="Title" name="title" />
            {
              errors.title && (
                <div className="text-danger pt-2">{errors.title.message}</div>
              )
            }
          </div>
        <div className='col-md-6'>
          <div className="mb-3">
            <label htmlFor="about" className="form-label">About : <span style={{ color: 'red' }}>*</span></label>
            <button className='btn btn-info rounded-pill'>Generate through AI</button>
            <textarea {...register("about")} type="text" className="form-control bg-dark" id="about" onChange={handleInputChange} rows={3} placeholder="About"></textarea>
            <p className="text-dark">{wordCount}/200 words</p>
            {
              errors.about && (
                <div className="text-danger pb-2">{errors.about.message}</div>
              )
            }

          </div>
        </div>
        <div className='col-md-6'>
          <div className="mb-3">
            <label htmlFor="skills" className="form-label">Skills : <span style={{ color: 'red' }}>*</span></label>
            {/* <CreatableSelect isMulti options={options} onChange={() => setValue("skills")} /> */}
            <Controller
              name="skills"
              control={control}
              render={({ field }: any) => (
                <CreatableSelect
                  {...field}
                  isMulti
                  options={skills || ''}
                  className="custom-select-container"
                  classNamePrefix="custom-select"
                  onChange={(selectedOptions) => {
                    field.onChange(selectedOptions);
                  }}
                />
              )}
            />
            {/* <input {...register("skills")} type="text" className="form-control bg-dark" id="skills" placeholder="Skills"></input> */}
            {errors.skills && (
              <div className="text-danger pb-2">{errors.skills.message}</div>
            )
            }
          </div>
        </div>
        <div className='col-12 my-3 mb-3'>
          <div className='d-flex my-3'>
            <label className='text-dark fs-16 me-2'>Would you like to promote your Talented Xpert profile?</label>
            <div className='d-flex align-items-center '>

              <div className="form-check me-3">
                <label className="form-check-label text-dark fs-16" htmlFor="isPromoted">
                  <input {...register('isPromoted')} className="form-check-input" type="radio" value={'true'} name="isPromoted" id="isPromoted"
                  />
                  Yes
                </label>
              </div>
              <div className="form-check me-3">
                <label className="form-check-label text-dark fs-16" htmlFor="isPromoted">
                  <input {...register('isPromoted')} className="form-check-input text-dark" type="radio" value={'false'} name="isPromoted" id="isPromoted"
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          {!isOrganization &&<div className="form-check mb-3">
            <input {...register("isDisabled")} className="form-check-input bg-transparent border-dark" type="checkbox" value="" id="isDisabled" />
            <label className="form-check-label fw-medium" htmlFor="isDisabled">
              I declare that I am a person with disability
            </label>
          </div>}
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
              {errors.disabilityDetail && (
                <div className="text-danger pb-2">{errors.disabilityDetail.message}</div>
              )
              }
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default Other
