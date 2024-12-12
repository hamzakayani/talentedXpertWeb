import React from 'react'
import CreatableSelect from 'react-select/creatable';

const Other: React.FC<any> = ({ register, errors, watch, Controller, control }) => {
  const isDisabledChecked = watch("isDisabled");
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
  console.log(watch('skills'))

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
                  options={options}
                  className="custom-select-container"
                  classNamePrefix="custom-select"
                  onChange={(selectedOptions) => {
                    console.log(selectedOptions)
                    // Update field value
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
