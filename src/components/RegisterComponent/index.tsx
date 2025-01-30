'use client';
import React, { useState } from 'react';
import { Stepper, Step } from 'react-form-stepper';
import { z } from 'zod';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicInfoSchema, educationSchema, additionalInfoSchema } from '@/schemas/signup/signupSchema';
import Individual_account from './Individual_account';
import Education_Certification from './Education_Certification';
import Other from './Other';
import { useRouter } from 'next/navigation';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { toast } from 'react-toastify';
import { dataForServer } from '@/models/signupModel/signupModel';
import { useAppDispatch } from '@/store/Store';
import { saveToken, setAuthState } from '@/reducers/AuthSlice';


type BasicInfoType = z.infer<typeof basicInfoSchema>;
type EducationType = z.infer<typeof educationSchema>;
type AdditionalInfoType = z.infer<typeof additionalInfoSchema>;

const RegisterComponent: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  const dispatch = useAppDispatch()

  const { register, handleSubmit, formState: { errors }, reset, watch, control, setValue } = useForm<BasicInfoType | EducationType | AdditionalInfoType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      education: [{
        institution: '',
        degree: '',
        date: '',
      }],
      skills: [],
      about: '',
      disabilityDetail: '',
      isDisabled: false,
      profileType: 'TE',
      isAdmin: false,
      userType: 'INDIVIDUAL',
      isPromoted: ''
    },
    resolver: zodResolver(activeStep === 0 ? basicInfoSchema : activeStep === 1 ? additionalInfoSchema : educationSchema),
    mode: 'all',
  });

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: 'education',
  });

  const onSubmit: SubmitHandler<BasicInfoType | EducationType | AdditionalInfoType> = async (data) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    if (activeStep === 2) {
      const mergeData = { ...formData, ...data };
      const Data = dataForServer(mergeData)


      await apiCall(requests.signup, Data, 'post', true, dispatch, null, null).then(async (res: any) => {
        if (res?.error) {
          toast.error(res?.error?.message || 'Something went wrong')
        } else {
          const loginRes = await apiCall(requests.login, { 
            email: Data?.email, 
            password: Data?.password,
            loginAs: Data?.profileType
          }, 'post', true, dispatch, null, null)
          dispatch(saveToken(loginRes.data.access_token))
          localStorage?.setItem("accessToken", loginRes.data.access_token)
          dispatch(setAuthState(true))
          localStorage.setItem('profileType', Data?.profileType)
          localStorage.setItem('access', 'true');
          toast.success("register successfully")
          router.push('/dashboard')
          // router.push('/signin')
        }
      }).catch(err => {
        console.warn(err)
      })

    } else {
      handleNext();
    }
  };

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

  return (
    <div className='container'>
      <h1 className='text-center mt-3'>Register Now!</h1>
      <Stepper activeStep={activeStep}>
        <Step label="Account Information" />
        <Step label="Additional Information" />
        <Step label="Professional Background" />
      </Stepper>

      <div>


        <section className='stepper-page-section my-4'>
          <div className='container'>
            <div className='row mt-5'>
              <div className='col-md-8 mx-auto'>
                <div className="card bg-tertiary">
                  <div className="card-body my-4 mx-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {activeStep === 0 && <Individual_account register={register} errors={errors} setValue={setValue} watch={watch} />}
                      {activeStep === 1 && <Other register={register} errors={errors} watch={watch} Controller={Controller} control={control} setValue={setValue}/>}
                      {activeStep === 2 && <Education_Certification fields={fields} register={register} errors={errors} prepend={prepend} remove={remove} watch={watch} />}

                      <div className='d-flex justify-content-end mt-4 text-darck'>
                        {activeStep >= 1 && (
                          <button type="button" className="btn btn-outline-info-b rounded-pill signup-btn text-black me-2" onClick={handleBack}>
                            Back
                          </button>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button type="submit" className="btn btn-info rounded-pill signup-btn">
                            {activeStep === 2 ? 'Done' : 'Next'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterComponent;
