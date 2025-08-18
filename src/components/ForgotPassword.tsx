"use client"
import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react';
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from 'zod';
import { ForgotPasswordSchema } from '@/schemas/forgotPassword-schema/forgotPasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { dataForServer } from '@/models/forgotPasswordModel/forgotPasswordModel';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';


type FormSchemaType = z.infer<typeof ForgotPasswordSchema>;

const ForgotPassword = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if there's a token parameter - if so, redirect to reset password
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      router.push(`/reset-password?token=${token}`);
    }
  }, [searchParams, router]);



  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log('Form submitted with data:', data);
    setIsFormSubmitted(true);
    const formData = dataForServer(data);
    console.log('Form data for server:', formData);
    console.log('API endpoint:', requests.forgotPassword);

    // Test with a simple fetch first
    try {
      const response = await fetch(requests.forgotPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);
      
      if (response.ok) {
        setIsEmailSent(true);
        toast.success("Password reset email sent successfully!");
      } else {
        toast.error(result?.message || "Something went wrong");
        setIsFormSubmitted(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Failed to send reset email. Please try again.");
      setIsFormSubmitted(false);
    }

    // Comment out the original apiCall for now
    // await apiCall(requests.forgotPassword, formData, "post", true, null, null, null)
  };

  if (isEmailSent) {
    return (
      <section className='sign-in mb-5'>
        <div className='container'>
          <div className='row mt-5 forpadding'>
            <div className='col-md-8 mx-auto'>
              <div className="card bg-tertiary">
                <div className="card-body mx-4 my-4 text-center">
                  <div className='row'>
                    <div className='col-md-8 mx-auto'>
                      <div className="mb-4">
                        <Icon
                          icon="mdi:email-check-outline"
                          width="64"
                          height="64"
                          className="text-success"
                        />
                      </div>
                      <h4 className='mb-3'>Check Your Email</h4>
                      <p className='fw-medium fs-12 mb-4'>
                        We've sent a password reset link to your email address. 
                        Please check your inbox and click on the link to reset your password.
                      </p>
                      <div className='d-flex justify-content-center gap-3'>
                        <Link
                          href="/signin"
                          className="btn btn-outline-info rounded-pill"
                        >
                          Back to Login
                        </Link>
                        <button
                          onClick={() => setIsEmailSent(false)}
                          className="btn btn-info rounded-pill"
                        >
                          Resend Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className='sign-in mb-5'>
        <div className='container'>
          <div className='row mt-5 forpadding'>
            <div className='col-md-8 mx-auto'>
              <div className="card bg-tertiary">
                <div className="card-body mx-4 my-4">
                  <div className='row'>
                                         <div className='col-md-8 mx-auto'>
                       <form onSubmit={handleSubmit(onSubmit)}>
                         <h4 className='text-center'>Forgot Password?</h4>
                         <p className='fw-medium fs-12 text-center'>No worries, we'll send you reset instructions.</p>
                         
                         <div className="mb-3">
                           <label htmlFor="email" className="form-label">Email <span className='text-danger'>*</span> </label>
                           <input 
                             {...register("email")}
                             type="email" 
                             className="form-control bg-dark" 
                             id="email" 
                             placeholder="Enter your email"
                           />
                           {errors.email && (
                             <div className="text-danger pt-2">
                               {errors.email.message}
                             </div>
                           )}
                         </div>
                       
                         <div className='text-end mb-3'>
                           <button 
                             type="submit" 
                             disabled={isFormSubmitted}
                             className="btn btn-info rounded-pill signin-btn"
                             onClick={() => console.log('Button clicked')}
                           >
                             {isFormSubmitted ? "Sending..." : "Send Email"}
                           </button>
                         </div>
                         <div className='d-flex justify-content-between align-items-center flex-wrap mb-3'>
                           <div className="form-check">
                              <label className="form-check-label me-2" htmlFor="rememberMe">
                               
                              </label>
                            </div>
                            <Link
                              href="/signin"
                              className='fw-medium text-dark forget'
                            >
                              Back to login
                            </Link>
                          </div>
                        </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ForgotPassword