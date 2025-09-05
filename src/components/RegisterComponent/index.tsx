"use client";
import React, { useEffect, useState } from "react";
import { Stepper, Step } from "react-form-stepper";
import { z } from "zod";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  basicInfoSchema,
  educationSchema,
  additionalInfoSchema,
} from "@/schemas/signup/signupSchema";
import Individual_account from "./Individual_account";
import Education_Certification from "./Education_Certification";
import Other from "./Other";
import { useNavigation } from "@/hooks/useNavigation";
import { usePostLogin } from "@/hooks/auth/usePostLogin";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { toast } from "react-toastify";
import { dataForServer } from "@/models/signupModel/signupModel";
import { useAppDispatch } from "@/store/Store";
import { saveToken, setAuthState } from "@/reducers/AuthSlice";
import { cp } from "fs";
import { error } from "console";
import GoogleProvider from "../common/SOSComponent/Google/GoogleProvider";
import LinkedInBtn from "../common/SOSComponent/LinkedIn/LinkedInBtn";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GoogleDocIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import JoinSelection from "./JoinSelection";
import ProfileImageSelection from "./ProfileImageSelection";
import PhoneInputComponent from "../common/PhoneInput/PhoneInput";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";

type BasicInfoType = z.infer<typeof basicInfoSchema>;
type EducationType = z.infer<typeof educationSchema>;
type AdditionalInfoType = z.infer<typeof additionalInfoSchema>;

const RegisterComponent: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const { navigate } = useNavigation();
  const loginMutation = usePostLogin();
  const signupMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(`${requests.signup}`, payload);
      return response.data;
    },
  });
  const [documents, setDocuments] = useState<any>({});
  const [expPresent, setExpPresent] = useState<boolean>(false);
  const [resume, setResume] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
    clearErrors,
    setError,
  } = useForm<BasicInfoType & EducationType & AdditionalInfoType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      // education: [
      //   {
      //     institution: "",
      //     degree: "",
      //     date: "",
      //   },
      // ],
      skills: [],
      about: "",
      disabilityDetail: "",
      isDisabled: false,
      profileType: "TE",
      isAdmin: false,
      userType: "INDIVIDUAL",
      isPromoted: "",
      termsAccepted: false,
      // experience: [
      //   {
      //     description: "",
      //     role: "",
      //     companyName: "",
      //     startDate: "",
      //     endDate: "",
      //     present: false,
      //   },
      // ],
    },
    resolver: zodResolver(
      activeStep === 0
        ? basicInfoSchema
        : activeStep === 1
        ? additionalInfoSchema
        : basicInfoSchema
    ),
    mode: "onChange",
  });

  useEffect(() => {
    // Ensure RHF tracks the custom PhoneInput field
    // No validation rules here; Zod handles validation
    // This allows touched/dirty state and error display
    // for the custom component wired via setValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
    register("mobile");
  }, [register]);

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: experienceFields,
    remove: removeExp,
    prepend: prependExp,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const onSubmit: SubmitHandler<
    BasicInfoType & EducationType & AdditionalInfoType
  > = async (data) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    if (
      activeStep === 2 ||
      (watch("profileType") === "TR" && activeStep == 1) ||
      (watch("userType") === "ORGANIZATION" && activeStep == 1)
    ) {
      const mergeData = { ...formData, ...data };
      let Data = null;
      if (
        watch("profileType") === "TR" ||
        watch("userType") === "ORGANIZATION"
      ) {
        const { skills, ...restData } = mergeData;
        Data = dataForServer(restData);
      } else {
        Data = dataForServer(mergeData);
      }
      setLoading(true);

      // await apiCall(requests.signup, Data, 'post', true, dispatch, null, null).then(async (res: any) => {
      //   if (res?.error) {
      //     toast.error(res?.error?.message || 'Something went wrong')
      //     setLoading(false)
      //   } else {
      //     const loginRes = await apiCall(requests.login, {
      //       email: Data?.email,
      //       password: Data?.password,
      //       loginAs: Data?.profileType,
      //       rememberMe: false
      //     }, 'post', true, dispatch, null, null)
      //     dispatch(saveToken(loginRes.data.access_token))
      //     localStorage?.setItem("accessToken", loginRes.data.access_token)
      //     dispatch(setAuthState(true))
      //     localStorage.setItem('profileType', Data?.profileType)
      //     localStorage.setItem('access', 'true');
      //     toast.success("Registered successfully")
      //     router.push('/dashboard')
      //     // router.push('/signin')
      //   }
      // }).catch(err => {
      //   console.warn(err)
      // })

      signupMutation.mutate(Data, {
        onSuccess: () => {
          // auto login
          const formData = {
            email: Data?.email,
            password: Data?.password,
            loginAs: Data?.profileType,
            rememberMe: false,
          };
          loginMutation.mutate(formData, {
            onSuccess: (response: any) => {
              dispatch(saveToken(response.access_token));
              localStorage?.setItem("accessToken", response.access_token);
              dispatch(setAuthState(true));
              localStorage.setItem("profileType", Data?.profileType);
              localStorage.setItem("access", "true");
              toast.success("Registered successfully");
              navigate("/dashboard/profile-setting");
            },
            onError: (error: any) => {
              const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
              toast.error(errorMessage);
            },
          });
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
          toast.error(errorMessage);
        },
      });
    } else {
      handleNext();
    }
  };
  const steps = ["Account Information", "Additional Information"];
  if (watch("profileType") === "TE" && watch("userType") == "INDIVIDUAL") {
    steps.push("Professional Background");
  }
  const handleNext = (): void => {
    if (activeStep < 2) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = (): void => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };
  console.log("errors", errors);

  return (
    <div>
      {activeStep === 0 && (
        <JoinSelection activeStep={activeStep} setActiveStep={setActiveStep} setValue={setValue} watch={watch} errors={errors}/>
      )}
      {activeStep === 1 && (
        <ProfileImageSelection 
          activeStep={activeStep} 
          setActiveStep={setActiveStep}
          setValue={setValue}
          watch={watch}
        />
      )}
      {activeStep === 2 && (
        <section className="register-component login py-3">
          <div className="container">
            <div className="card shadow-none border-1">
              <div className="card-body mx-4 my-4 pt-1">
                <h2 className="text-center mb-4 text-black">
                  Sign up to become Xpert
                </h2>
                <div className="d-flex justify-content-center mb-3 flex-column gap-3">
                  <GoogleProvider profileType={watch('profileType')} disabled={false} />
                  <LinkedInBtn profileType={watch('profileType')} disabled={false} />
                </div>
                <div className="text-center my-4 pt-3 position-relative d-flex align-items-center justify-content-center border-bottom">
                  <span className="or-text px-2 position-absolute bg-white">
                    OR
                  </span>
                </div>
                <button className="btn btn-outline-dark d-block mx-auto mb-4 w-100 d-flex align-items-center justify-content-center gap-2">
                  <HugeiconsIcon icon={GoogleDocIcon} size={20} />
                  Upload Resume
                </button>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          id="firstName"
                          placeholder="e.g. John"
                          maxLength={50}
                          {...register("firstName")}
                        />
                        <label htmlFor="firstName">First Name</label>
                      </div>
                      {errors.firstName && (
                        <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                          {errors.firstName.message}
                        </div>
                      )}
                    </div>
                    <div className="col-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          id="lastName"
                          placeholder="e.g. Smith"
                          maxLength={50}
                          {...register("lastName")}
                        />
                        <label htmlFor="lastName">Last Name</label>
                      </div>
                      {errors.lastName && (
                        <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                          {errors.lastName.message}
                        </div>
                      )}
                    </div>
                    {watch("userType") === "ORGANIZATION" && (
                      <>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${errors.organizationName ? 'is-invalid' : ''}`}
                              id="organizationName"
                              placeholder="e.g. Acme Inc."
                              maxLength={50}
                              {...register("organizationName")}
                            />
                            <label htmlFor="organizationName">Organization Name</label>
                          </div>
                          {errors.organizationName && (
                            <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                              {errors.organizationName.message}
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${errors.organizationType ? 'is-invalid' : ''}`}
                              id="organizationType"
                              placeholder="e.g. Non-profit, Private, Govt"
                              maxLength={50}
                              {...register("organizationType")}
                            />
                            <label htmlFor="organizationType">Organization Type</label>
                          </div>
                          {errors.organizationType && (
                            <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                              {errors.organizationType.message}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          placeholder="e.g. john@example.com"
                          maxLength={50}
                          {...register("email")}
                        />
                        <label htmlFor="email">Email</label>
                      </div>
                      {errors.email && (
                        <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-floating position-relative">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          id="password"
                          placeholder="Enter password"
                          maxLength={50}
                          style={{
                            backgroundImage: 'none',
                          }}
                          {...register("password")}
                        />
                        <HugeiconsIcon
                          icon={isPasswordVisible ? ViewIcon : ViewOffSlashIcon}
                          size={20}
                          className="position-absolute top-50 translate-middle-y text-placeholder"
                          style={{
                            right: "15px",
                            cursor: "pointer",
                            color: "#959595",
                          }}
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                      {errors.password && (
                        <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-floating position-relative">
                        <input
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          id="confirmPassword"
                          placeholder="Confirm password"
                          maxLength={50}
                          style={{
                            backgroundImage: 'none',
                          }}
                          {...register("confirmPassword")}
                        />
                        <HugeiconsIcon
                          icon={isConfirmPasswordVisible ? ViewIcon : ViewOffSlashIcon}
                          size={20}
                          className="position-absolute top-50 translate-middle-y text-placeholder"
                          style={{
                            right: "15px",
                            cursor: "pointer",
                            color: "#959595",
                          }}
                          onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                      </div>
                      {errors.confirmPassword && (
                        <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                          {errors.confirmPassword.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <PhoneInputComponent
                        value={watch("mobile")}
                        onChange={(value) => setValue("mobile", value || "", { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
                        label=""
                        placeholder="Enter phone number"
                        error={errors.mobile?.message}
                        required={true}
                        validate={true}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="url"
                          className={`form-control ${errors.websiteLink ? 'is-invalid' : ''}`}
                          id="websiteLink"
                          placeholder="e.g. https://linkedin.com/in/john"
                          maxLength={50}
                          {...register("websiteLink")}
                        />
                        <label htmlFor="websiteLink">LinkedIn Profile</label>
                      </div>
                      {errors.websiteLink && (
                        <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                          {errors.websiteLink.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-check d-flex">
                        <input
                          className={`form-check-input border-dark ${errors.termsAccepted ? 'is-invalid' : ''}`}
                          type="checkbox"
                          id="termsAccepted"
                          {...register("termsAccepted")}
                        />
                        <label 
                          className="form-check-label me-2" 
                          htmlFor="termsAccepted"
                          style={{ color: 'inherit', marginTop: '1px' }}
                        >
                          Yes, I understand and agree to the{" "}
                          <a href="" style={{ color: 'inherit', textDecoration: 'underline' }}>Talented Xpert Terms of Service,</a> including
                          the <a href="" style={{ color: 'inherit', textDecoration: 'underline' }}>User Agreement</a> and{" "}
                          <a href="" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy.</a>
                        </label>
                      </div>
                      {errors.termsAccepted && (
                        <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                          {errors.termsAccepted.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-check d-flex">
                        <input
                          className={`form-check-input border-dark ${errors.isDisabled ? 'is-invalid' : ''}`}
                          type="checkbox"
                          id="isDisabled"
                          {...register("isDisabled")}
                        />
                        <label 
                          className="form-check-label me-2" 
                          htmlFor="isDisabled"
                          style={{ color: 'inherit', marginTop: '3px' }}
                        >
                          I have a disability and would like to disclose this information
                        </label>
                      </div>
                      {errors.isDisabled && (
                        <div className="text-danger mt-1" style={{fontSize: "12px"}}>
                          {errors.isDisabled.message}
                        </div>
                      )}
                    </div>
                    <div className="w-100 mt-4">
                      <button type="submit" className="btn btn-black w-100" disabled={loading}>
                        {loading ? "Creating Account..." : "Create an Account"}
                      </button>
                      {loading && <GlobalLoader />}
                    </div>
                  </div>
                </form>
                {/* <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => (
                    <Step
                      key={index}
                      label={label}
                      className={`${
                        index === activeStep ? "StepButton active" : ""
                      } ${index < activeStep ? "StepButton completed" : ""}`}
                    />
                  ))}
                </Stepper>

                <div>
                  <section className="stepper-page-section my-4">
                    <div className="container">
                      <div className="row mt-5">
                        <div className="col-md-8 mx-auto">
                          <div className="card bg-tertiary">
                            <div className="card-body my-4 mx-4">
                              <form onSubmit={handleSubmit(onSubmit)}>
                                {activeStep === 0 && (
                                  <Individual_account
                                    register={register}
                                    errors={errors}
                                    setValue={setValue}
                                    watch={watch}
                                    documents={documents}
                                    setDocuments={setDocuments}
                                    setExpPresent={setExpPresent}
                                    resume={resume}
                                    setResume={setResume}
                                  />
                                )}
                                {activeStep === 1 && (
                                  <Other
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    Controller={Controller}
                                    control={control}
                                    setValue={setValue}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                  />
                                )}
                                {activeStep === 2 &&
                                  watch("profileType") === "TE" &&
                                  watch("userType") === "INDIVIDUAL" && (
                                    <Education_Certification
                                      fields={fields}
                                      register={register}
                                      errors={errors}
                                      prepend={prepend}
                                      remove={remove}
                                      watch={watch}
                                      experienceFields={experienceFields}
                                      prependExp={prependExp}
                                      removeExp={removeExp}
                                      expPresent={expPresent}
                                      setValue={setValue}
                                    />
                                  )}

                                <div className="d-flex justify-content-end mt-4 text-darck">
                                  {activeStep >= 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-info-b rounded-pill signup-btn text-black me-2"
                                      onClick={handleBack}
                                    >
                                      Back
                                    </button>
                                  )}
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <button
                                      type="submit"
                                      className="btn btn-info rounded-pill signup-btn"
                                      disabled={activeStep === 2 && loading}
                                    >
                                      {activeStep === 2 ||
                                      (watch("profileType") === "TR" &&
                                        activeStep == 1) ||
                                      (watch("userType") === "ORGANIZATION" &&
                                        activeStep == 1)
                                        ? "Register"
                                        : "Next"}
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
                </div> */}
              </div>
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
};

export default RegisterComponent;
