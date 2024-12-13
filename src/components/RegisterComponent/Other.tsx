import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
<<<<<<< HEAD
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
=======
import { useAppDispatch } from '@/store/Store';
import React, { useEffect, useState } from 'react'
>>>>>>> 4900c6ed09e2eddac80075d47284cdfd1e4b06d2
import CreatableSelect from 'react-select/creatable';

const Other: React.FC<any> = ({ register, errors, watch, Controller, control }) => {
  const isDisabledChecked = watch("isDisabled");
<<<<<<< HEAD
  const [skills, setSkills] = useState<any>([])
  const dispatch = useAppDispatch()
  const user = useSelector((state: RootState) => state.user)
  const router = useRouter()



  useEffect(() => {
    getSkills();
  }, [])
  const getSkills = async () => {

    await apiCall(requests.getSkills, {}, 'get', false, dispatch, user, router).then((res: any) => {
      console.log('skills', res)
      setSkills(res?.data?.data?.skills || [])
    }).catch(err => console.warn(err))
  }

  const options = skills.map((skill: any) => ({
    value: skill.name,
    label: skill.name,
  }));
  console.log('options', options)
  console.log(watch('skills'))
=======
  const [skills, setSkills] = useState<any[]>([])

  const dispatch = useAppDispatch()

  useEffect(() => {
    getAllSkills()
  },[])

  const getAllSkills = async () => {
    const response = await apiCall(`${process.env.BASE_URL}/skills`, {}, 'get', false, dispatch, null, null)
    setSkills(response?.data?.data?.skills?.map((skill:any) => ({
      label: skill.name,
      value: skill.id,
    })) || [])
  }
>>>>>>> 4900c6ed09e2eddac80075d47284cdfd1e4b06d2

  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
          <div className="mb-3">
            <label htmlFor="about" className="form-label">About :</label>
            <textarea {...register("about")} type="text" className="form-control bg-dark" id="about" rows={3} placeholder="About"></textarea>
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
