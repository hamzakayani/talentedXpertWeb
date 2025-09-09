"use client"
import React, { useState, useEffect } from 'react'
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleLock01Icon, ViewIcon, ViewOffSlashIcon, User03Icon } from "@hugeicons/core-free-icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { requests } from '@/services/requests/requests';
import GlobalLoader from './common/GlobalLoader/GlobalLoader';

// Step 1: Email input schema
const EmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Step 2: OTP input schema
const OTPSchema = z.object({
  otp: z.string().length(5, "Please enter a 5-digit code").regex(/^\d{5}$/, "OTP must be a 5-digit number"),
});

// Step 3: Password reset schema (matches registration rules)
const ResetPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const { password, confirmPassword } = data;

    if (!password) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter your password.", path: ["password"] });
    } else {
      if (password.length < 8) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password must be at least 8 characters.", path: ["password"] });
      }
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password must include an uppercase letter, a number, and a special character.", path: ["password"] });
      }
    }

    if (!confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please confirm your password.", path: ["confirmPassword"] });
    } else if (password !== confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords don't match", path: ["confirmPassword"] });
    }
  });

type EmailFormType = z.infer<typeof EmailSchema>;
type OTPFormType = z.infer<typeof OTPSchema>;
type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema>;

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otpToken, setOtpToken] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [isResetSuccess, setIsResetSuccess] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if there's a token parameter - if so, redirect to reset password
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setCurrentStep(3);
      setOtpToken(token);
    }
  }, [searchParams, router]);

  // Step 1: Email form
  const emailForm = useForm<EmailFormType>({
    resolver: zodResolver(EmailSchema),
    mode: "onChange",
  });

  // Step 2: OTP form
  const otpForm = useForm<OTPFormType>({
    resolver: zodResolver(OTPSchema),
    mode: "onChange",
    defaultValues: { otp: "" }, // Ensure OTP field starts empty
  });

  // Step 3: Password reset form
  const passwordForm = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  // Mutations
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(requests.forgotPassword, { email });
      return response.data;
    },
  });

  const validateOTPMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await axios.post(requests.validateOTP, { token: otp });
      return response.data;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { password: string; token: string }) => {
      const response = await axios.post(requests.resetPassword, data);
      return response.data;
    },
  });

  // Step 1: Submit email
  const onEmailSubmit: SubmitHandler<EmailFormType> = (data) => {
    setEmail(data.email);
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "OTP sent to your email!");
        // Clear both forms and reset to default values
        emailForm.reset({ email: "" });
        otpForm.reset({ otp: "" }); // Explicitly reset OTP form
        setCurrentStep(2);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
        toast.error(errorMessage);
      },
    });
  };

  // Step 2: Submit OTP
  const onOTPSubmit: SubmitHandler<OTPFormType> = (data) => {
    setOtpToken(data.otp);
    validateOTPMutation.mutate(data.otp, {
      onSuccess: (res: any) => {
        toast.success(res?.message || res?.data?.message);
        // Clear the password form when moving to step 3
        passwordForm.reset({ password: "", confirmPassword: "" });
        setCurrentStep(3);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || "Invalid OTP";
        toast.error(errorMessage);
      },
    });
  };

  // Step 3: Submit new password
  const onPasswordSubmit: SubmitHandler<ResetPasswordFormType> = (data) => {
    resetPasswordMutation.mutate(
      { password: data.password, token: otpToken },
      {
        onSuccess: (res: any) => {
          const msg = res?.message || res?.data?.message || "Password reset successfully!";
          toast.success(msg);
          setIsResetSuccess(true);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
          toast.error(errorMessage);
        },
      }
    );
  };

  // Step 1: Email input
  if (currentStep === 1) {
    return (
      <section className="login my-3">
        <div className="container">
          <div className="card shadow-none border-2">
            {forgotPasswordMutation.isPending && <GlobalLoader />}
            <div className="card-body mx-4 my-4 pt-1">
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                <h2 className="text-center mb-4 font20 text-black">
                  Password recovery
                </h2>
                <p className="text-center mb-4 text-muted">
                  Enter the email address or username associated with your TalentedXpert account.
                </p>

                <div className="form-floating mb-2 with-icon">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    {...emailForm.register("email")}
                  />
                  <HugeiconsIcon
                    className="position-absolute top-50 translate-middle-y ms-2"
                    icon={User03Icon}
                    size={20}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                {emailForm.formState.errors.email && (
                  <div className="text-danger fs-12 mb-2" style={{ marginTop: "-5px" }}>
                    {emailForm.formState.errors.email.message}
                  </div>
                )}

                <div className="w-100 mb-3">
                  <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="btn btn-black w-100"
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : "Continue"}
                  </button>
                </div>

                <div className="text-center">
                  <Link href="/signin" className="forget">
                    Go Back
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Step 2: OTP input
  if (currentStep === 2) {
    return (
      <section className="login my-3">
        <div className="container">
          <div className="card shadow-none border-2">
            {validateOTPMutation.isPending && <GlobalLoader />}
            <div className="card-body mx-4 my-4 pt-1">
              <form onSubmit={otpForm.handleSubmit(onOTPSubmit)}>
                <h2 className="text-center mb-4 font20 text-black">
                  Check your email
                </h2>
                <p className="text-center mb-4 text-muted">
                  If an account with this email address exists, we’ve sent an OTP to reset your password.
                </p>

                <div className="form-floating mb-2 with-icon">
                  <input
                    key={`otp-${currentStep}`}
                    type="text"
                    inputMode="numeric"
                    className="form-control"
                    id="otp"
                    placeholder="5 Digit Code"
                    maxLength={5}
                    {...otpForm.register("otp")}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
                      otpForm.setValue("otp", onlyDigits, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                  <HugeiconsIcon
                    className="position-absolute top-50 translate-middle-y ms-2"
                    icon={CircleLock01Icon}
                    size={20}
                  />
                  <label htmlFor="otp">5 Digit Code</label>
                </div>
                {otpForm.formState.errors.otp && (
                  <div className="text-danger fs-12 mb-2" style={{ marginTop: "-5px" }}>
                    {otpForm.formState.errors.otp.message}
                  </div>
                )}

                <div className="w-100 mb-3">
                  <button
                    type="submit"
                    disabled={validateOTPMutation.isPending}
                    className="btn btn-black w-100"
                  >
                    {validateOTPMutation.isPending ? "Verifying..." : "Continue"}
                  </button>
                </div>

                <div className="text-center">
                  <Link href="/signin" className="forget">
                    Return Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Step 3: Set new password
  if (currentStep === 3 && !isResetSuccess) {
    return (
      <section className="login my-3">
        <div className="container">
          <div className="card shadow-none border-2">
            {resetPasswordMutation.isPending && <GlobalLoader />}
            <div className="card-body mx-4 my-4 pt-1">
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <h2 className="text-center mb-4 font20 text-black">
                  Set new password
                </h2>
                <p className="text-center mb-4 text-muted">
                  Must be at least 8 characters
                </p>

                <div className="form-floating mb-3 with-icon">
                  <input
                    key={`password-${currentStep}`}
                    type={isPasswordVisible ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="New password"
                    {...passwordForm.register("password")}
                  />
                  <span title={isPasswordVisible ? "Password visible" : "Password hidden"}>
                    <HugeiconsIcon
                      icon={isPasswordVisible ? ViewIcon : ViewOffSlashIcon}
                      className="position-absolute top-50 translate-middle-y text-placeholder"
                      style={{
                        right: "15px",
                        cursor: "pointer",
                        color: "#959595",
                      }}
                      size={20}
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    />
                  </span>
                  <HugeiconsIcon
                    className="position-absolute top-50 translate-middle-y ms-2"
                    icon={CircleLock01Icon}
                    size={20}
                  />
                  <label htmlFor="password">New Password</label>
                </div>
                {passwordForm.formState.errors.password && (
                  <div className="text-danger fs-12 mb-2" style={{ marginTop: "-5px" }}>
                    {passwordForm.formState.errors.password.message}
                  </div>
                )}

                <div className="form-floating mb-3 with-icon">
                  <input
                    key={`confirmPassword-${currentStep}`}
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    {...passwordForm.register("confirmPassword")}
                  />
                  <span title={isConfirmPasswordVisible ? "Password visible" : "Password hidden"}>
                    <HugeiconsIcon
                      icon={isConfirmPasswordVisible ? ViewIcon : ViewOffSlashIcon}
                      className="position-absolute top-50 translate-middle-y text-placeholder"
                      style={{
                        right: "15px",
                        cursor: "pointer",
                        color: "#959595",
                      }}
                      size={20}
                      onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    />
                  </span>
                  <HugeiconsIcon
                    className="position-absolute top-50 translate-middle-y ms-2"
                    icon={CircleLock01Icon}
                    size={20}
                  />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <div className="text-danger fs-12 mb-2" style={{ marginTop: "-5px" }}>
                    {passwordForm.formState.errors.confirmPassword.message}
                  </div>
                )}

                <div className="w-100 mb-3">
                  <button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="btn btn-black w-100"
                  >
                    {resetPasswordMutation.isPending ? "Resetting..." : "Reset"}
                  </button>
                </div>

                <div className="text-center">
                  <Link href="/signin" className="forget">
                    Return Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Final success screen
  if (isResetSuccess) {
    return (
      <section className="login my-3">
        <div className="container">
          <div className="card shadow-none border-2">
            <div className="card-body mx-4 my-5 pt-4">
              <div className="text-center">
                <h2 className="mb-3 font20 text-black">All Done!</h2>
                <p className="text-muted mb-4">Your password has been reset, now you can access your account.</p>
                <button className="btn btn-black w-100" onClick={() => router.push('/signin')}>Login</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

export default ForgotPassword