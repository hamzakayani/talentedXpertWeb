"use client"
import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react';
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from 'zod';
import { ResetPasswordSchema } from '@/schemas/resetPassword-schema/resetPasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { dataForServer } from '@/models/resetPasswordModel/resetPasswordModel';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useNavigation } from '@/hooks/useNavigation';

type FormSchemaType = z.infer<typeof ResetPasswordSchema>;

const ResetPassword = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { navigate } = useNavigation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "all",
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Invalid reset link. Please request a new password reset.");
      navigate("/forgotpassword");
    }
  }, [searchParams, navigate]);

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsFormSubmitted(true);
    const formData = dataForServer(data, token);

    await apiCall(requests.resetPassword, formData, "post", true, null, null, null)
      .then((res: any) => {
        if (res?.error) {
          toast.error(res?.error?.message || "Something went wrong");
          setIsFormSubmitted(false);
        } else {
          setIsPasswordReset(true);
          toast.success("Password reset successfully!");
        }
      })
      .catch((err) => {
        setIsFormSubmitted(false);
        toast.error("Failed to reset password. Please try again.");
        console.warn(err);
      });
  };

  if (isPasswordReset) {
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
                          icon="mdi:check-circle-outline"
                          width="64"
                          height="64"
                          className="text-success"
                        />
                      </div>
                      <h4 className='mb-3'>Password Reset Successful!</h4>
                      <p className='fw-medium fs-12 mb-4'>
                        Your password has been reset successfully. 
                        You can now login with your new password.
                      </p>
                      <Link
                        href="/signin"
                        className="btn btn-info rounded-pill"
                      >
                        Go to Login
                      </Link>
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

  if (!token) {
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
                          icon="mdi:alert-circle-outline"
                          width="64"
                          height="64"
                          className="text-warning"
                        />
                      </div>
                      <h4 className='mb-3'>Invalid Reset Link</h4>
                      <p className='fw-medium fs-12 mb-4'>
                        This password reset link is invalid or has expired. 
                        Please request a new password reset.
                      </p>
                      <Link
                        href="/forgotpassword"
                        className="btn btn-info rounded-pill"
                      >
                        Request New Reset
                      </Link>
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
    <section className='sign-in mb-5'>
      <div className='container'>
        <div className='row mt-5 forpadding'>
          <div className='col-md-8 mx-auto'>
            <div className="card bg-tertiary">
              <div className="card-body mx-4 my-4">
                <div className='row'>
                  <div className='col-md-8 mx-auto'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <h4 className='text-center'>Reset Your Password</h4>
                      <p className='fw-medium fs-12 text-center mb-4'>
                        Enter your new password below
                      </p>
                      
                                             <div className="mb-3 position-relative">
                        <label htmlFor="password" className="form-label">
                          New Password <span className='text-danger'>*</span>
                        </label>
                        <input 
                          {...register("password")}
                          type={isPasswordVisible ? "text" : "password"}
                          className="form-control bg-dark" 
                          id="password" 
                          placeholder="Enter new password"
                        />
                        <div
                          className="password-icon"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                        >
                          <Icon
                            icon={
                              isPasswordVisible
                                ? "mdi:eye-outline"
                                : "mdi:eye-off-outline"
                            }
                            className="text-placeholder"
                          />
                        </div>
                        {errors.password && (
                          <div className="text-danger pt-2">
                            {errors.password.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3 position-relative">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password <span className='text-danger'>*</span>
                        </label>
                        <input 
                          {...register("confirmPassword")}
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          className="form-control bg-dark" 
                          id="confirmPassword" 
                          placeholder="Confirm new password"
                        />
                        <div
                          className="password-icon"
                          onClick={() =>
                            setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                          }
                        >
                          <Icon
                            icon={
                              isConfirmPasswordVisible
                                ? "mdi:eye-outline"
                                : "mdi:eye-off-outline"
                            }
                            className="text-placeholder"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <div className="text-danger pt-2">
                            {errors.confirmPassword.message}
                          </div>
                        )}
                      </div>
                    
                      <div className='text-end mb-3'>
                        <button 
                          type="submit" 
                          disabled={isFormSubmitted}
                          className="btn btn-info rounded-pill signin-btn"
                        >
                          {isFormSubmitted ? "Resetting..." : "Reset Password"}
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
  )
}

export default ResetPassword 