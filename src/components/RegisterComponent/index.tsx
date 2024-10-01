'use client';
import React, { useState } from 'react';
import { Stepper, Step } from 'react-form-stepper';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
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


type BasicInfoType = z.infer<typeof basicInfoSchema>;
type EducationType = z.infer<typeof educationSchema>;
type AdditionalInfoType = z.infer<typeof additionalInfoSchema>;

const RegisterComponent: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0); 
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  const dispatch = useAppDispatch()

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<BasicInfoType | EducationType | AdditionalInfoType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      institution: '',
      degree: '',
      date: '',
      about: '',
      skills: '',
      disabilityDetail: '',
      isDisabled: false,
      profileType:'',
      isAdmin: false,
      userType: "INDIVIDUAL",
    },
    resolver: zodResolver(activeStep === 0 ? basicInfoSchema : activeStep === 1 ? educationSchema : additionalInfoSchema),
    mode: 'all',
  });
  
  const onSubmit: SubmitHandler<BasicInfoType | EducationType | AdditionalInfoType> = async (data) => {
    setFormData((prev:any) => ({ ...prev, ...data }));
    if (activeStep === 2) {
      const Data = dataForServer(formData)
     
      await apiCall(requests.signup, Data, 'post', true, dispatch, null, null).then((res:any) =>{ 
        if(res?.error){
          toast.error(res?.error?.message || 'Something went wrong')
        } else {
          router.push('/signin')
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
    <div>
      <Stepper activeStep={activeStep}>
        <Step label="Individual account" />
        <Step label="Education & Certification" />
        <Step label="Other" />
      </Stepper>

      <div>
      

        <section className='stepper-page-section my-4'>
          <div className='container'>
            <div className='row mt-5'>
              <div className='col-md-8 mx-auto'>
                <div className="card bg-tertiary">
                  <div className="card-body my-4 mx-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {activeStep === 0 && <Individual_account register={register} errors={errors} />}
                      {activeStep === 1 && <Education_Certification register={register} errors={errors} />}
                      {activeStep === 2 && <Other register={register} errors={errors} watch={watch} />}

                      <div className='d-flex justify-content-between mt-4'>
                        {activeStep >= 1 && (
                          <button type="button" className="btn btn-outline-info rounded-pill signup-btn" onClick={handleBack}>
                            Back
                          </button>
                        )}
                        <button type="submit" className="btn btn-info rounded-pill signup-btn">
                          {activeStep === 2 ? 'Done' : 'Next'}
                        </button>
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
