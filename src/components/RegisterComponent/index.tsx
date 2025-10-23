"use client";
import React, { useEffect, useState } from "react";
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
import { useNavigation } from "@/hooks/useNavigation";
import { usePostLogin } from "@/hooks/auth/usePostLogin";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { requests } from "@/services/requests/requests";
import { toast } from "react-toastify";
import { dataForServer } from "@/models/signupModel/signupModel";
import { useAppDispatch } from "@/store/Store";
import { saveToken, setAuthState } from "@/reducers/AuthSlice";
import GoogleProvider from "../common/SOSComponent/Google/GoogleProvider";
import LinkedInBtn from "../common/SOSComponent/LinkedIn/LinkedInBtn";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02FreeIcons,
  GoogleDocIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import JoinSelection from "./JoinSelection";
import ProfileImageSelection from "./ProfileImageSelection";
import PhoneInputComponent from "../common/PhoneInput/PhoneInput";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";
import { useParseResume } from "@/hooks/ai/useParseResume";
import { uploadFileToS3 } from "@/services/uploadFileToS3/uploadFileToS3";
import ProfileInfoStep from "./ProfileInfoStep";
import { useAddSkill, useFetchSkills } from "@/hooks/skills/useSkills";
import Link from "next/link";

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
  const [expPresent, setExpPresent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();

  const resumeInputRef = React.useRef<HTMLInputElement>(null);
  const parseResumeMutation = useParseResume();

  const addSkillsMutation = useAddSkill();
  const fetchSkillsQuery = useFetchSkills();

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
    trigger,
  } = useForm<BasicInfoType & EducationType & AdditionalInfoType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      profilePicture: {},
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
        : activeStep === 3
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
    const allFormData = watch(); // Get full form values from react-hook-form

    if (
      activeStep === 3 ||
      activeStep === 2 ||
      (watch("profileType") === "TR" && activeStep == 1) ||
      (watch("userType") === "ORGANIZATION" && activeStep == 1)
    ) {
      let Data = null;
      if (
        watch("profileType") === "TR" ||
        watch("userType") === "ORGANIZATION"
      ) {
        const { skills, ...restData } = allFormData;
        Data = dataForServer(restData);
      } else {
        Data = dataForServer(allFormData);
      }

      setLoading(true);

      signupMutation.mutate(Data, {
        onSuccess: (res: any) => {
          const formData = {
                email: Data?.email,
                password: Data?.password,
                loginAs: Data?.profileType,
                rememberMe: false,
          };
          loginMutation.mutate(formData, {
            onSuccess: (response: any) => {
              dispatch(saveToken(response.access_token));
              localStorage.setItem("accessToken", response.access_token);
            dispatch(setAuthState(true));
            localStorage.setItem("profileType", Data?.profileType);
            localStorage.setItem("access", "true");
              toast.success(res?.message || "Registered successfully");
              navigate("/dashboard/profile-setting");
            },
            onError: (error: any) => {
              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";
              toast.error(errorMessage);
            },
          });
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong";
          toast.error(errorMessage);
        },
        onSettled: () => {
          setLoading(false);
        },
        });
    } else {
      // Store current step's data in formData (optional)
      setFormData((prev: any) => ({ ...prev, ...data }));
      handleNext();
    }
  };

  const steps = ["Account Information", "Additional Information"];
  if (watch("profileType") === "TE" && watch("userType") == "INDIVIDUAL") {
    steps.push("Professional Background");
  }
  const handleNext = (): void => {
    if (activeStep < 3) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const onNext = async () => {
    const valid = await trigger();
    if (!valid) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = (): void => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.");
      return;
    }
    setLoading(true);
    try {
      const fileObjs = [
        { fileName: file.name, mimeType: file.type, fileSize: file.size },
      ];
      const uploadedFileIds = await uploadFileToS3(
        [file],
        fileObjs,
        () => {},
        true
      );
      // uploadFileToS3(files, fileObjs, onProgress, true);
      if (uploadedFileIds && uploadedFileIds[0]?.fileUrl) {
        parseResumeMutation.mutate(
          { fileUrl: uploadedFileIds[0].fileUrl },
          {
            onSuccess: async (response) => {
              const parsedData = response?.data?.result?.parsed_data;
              if (!parsedData) {
                toast.error("Resume parsing failed.");
                return;
              }
              setValue("firstName", parsedData.firstName || "");
              setValue("lastName", parsedData.lastName || "");
              {
                const raw = (parsedData.mobile || "").toString();
                let sanitized = raw.replace(/[^0-9+]/g, "");
                if (sanitized.startsWith("+")) {
                  sanitized = "+" + sanitized.replace(/[^0-9]/g, "");
                } else {
                  sanitized = sanitized.replace(/[^0-9]/g, "");
                }
                setValue("mobile", sanitized, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                trigger("mobile");
              }
              setValue("about", parsedData.about || "");
              setValue("email", parsedData.email || "");
              setValue("title", parsedData.title || "");
              setValue("websiteLink", parsedData.websiteLink || "");
              setValue("zip", parsedData.zip || "");
              // setValue("address", {
              //   address: parsedData.address || "",
              //   street: parsedData.street || "",
              // });
              if (parsedData.skills?.length > 0) {
                const addedSkills = await addSkillsMutation.mutateAsync(
                  parsedData?.skills
                );

                // extract IDs
                const addedSkillIds = addedSkills?.data || [];

                // merge with fetched skills
                const allSkills = [
                  ...(fetchSkillsQuery?.data?.data?.skills || []),
                ];

                // map IDs back into {label, value}
                const formatted = allSkills
                  .filter((skill: any) => addedSkillIds.includes(skill.id))
                  .map((skill: any) => ({
                    label: skill.name,
                    value: skill.id,
                  }));

                setValue("skills", formatted);
                // setValue("skills", parsedData.skills);
              }
              toast.success("Resume parsed and form updated!");
            },
            onError: () => {
              toast.error("Resume parsing failed.");
            },
          }
        );
      } else {
        toast.error("Resume upload failed.");
      }
    } catch (err) {
      toast.error("Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {activeStep === 0 && (
        <JoinSelection
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />
      )}
      {activeStep === 1 && (
        <ProfileImageSelection
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setValue={setValue}
          watch={watch}
        />
      )}
      {activeStep >= 2 && (
        <section className="register-component login py-3">
          <div className="container">
            <div className="card shadow-none border-1">
              <div className="card-body mx-4 my-4 pt-1">
                <div className="position-relative mb-4">
                  {activeStep === 3 && (
                    <HugeiconsIcon
                      icon={ArrowLeft02FreeIcons}
                      size={20}
                      className="position-absolute"
                      style={{
                        cursor: "pointer",
                        color: "#959595",
                        left: "0",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                      }}
                      onClick={() => setActiveStep(2)}
                    />
                  )}
                  <h2 className="text-center text-black mb-0">Register</h2>
                </div>
                <div className="d-flex justify-content-center mb-3 flex-column gap-3">
                  <GoogleProvider
                    profileType={watch("profileType")}
                    disabled={false}
                    route="/dashboard/profile-setting"
                  />
                  <LinkedInBtn
                    profileType={watch("profileType")}
                    disabled={false}
                    route="/dashboard/profile-setting"
                  />
                </div>
                <div className="text-center my-4 pt-3 position-relative d-flex align-items-center justify-content-center border-bottom">
                  <span className="or-text px-2 position-absolute bg-white">
                    OR
                  </span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  {activeStep === 2 && (
                    <div>
                      <>
                        <input
                          type="file"
                          accept="application/pdf"
                          style={{ display: "none" }}
                          ref={resumeInputRef}
                          onChange={handleResumeUpload}
                        />
                        <button
                          className="btn btn-outline-dark d-block mx-auto mb-4 w-100 d-flex align-items-center justify-content-center gap-2"
                          type="button"
                          onClick={() => resumeInputRef.current?.click()}
                          disabled={loading || parseResumeMutation.isPending}
                        >
                  <HugeiconsIcon icon={GoogleDocIcon} size={20} />
                          {loading || parseResumeMutation.isPending
                            ? "Uploading..."
                            : "Upload Resume"}
                </button>
                      </>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="form-floating">
                      <input
                        type="text"
                              className={`form-control ${
                                errors.firstName ? "is-invalid" : ""
                              }`}
                              id="firstName"
                        placeholder="e.g. John"
                              maxLength={50}
                              {...register("firstName")}
                            />
                            <label htmlFor="firstName">First Name</label>
                          </div>
                          {errors.firstName && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.firstName.message}
                    </div>
                          )}
                  </div>
                  <div className="col-6">
                    <div className="form-floating">
                      <input
                        type="text"
                              className={`form-control ${
                                errors.lastName ? "is-invalid" : ""
                              }`}
                              id="lastName"
                              placeholder="e.g. Smith"
                              maxLength={50}
                              {...register("lastName")}
                            />
                            <label htmlFor="lastName">Last Name</label>
                          </div>
                          {errors.lastName && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
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
                                  className={`form-control ${
                                    errors.organizationName ? "is-invalid" : ""
                                  }`}
                                  id="organizationName"
                                  placeholder="e.g. Acme Inc."
                                  maxLength={50}
                                  {...register("organizationName")}
                                />
                                <label htmlFor="organizationName">
                                  Organization Name
                                </label>
                              </div>
                              {errors.organizationName && (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  {errors.organizationName.message}
                                </div>
                              )}
                            </div>
                            <div className="col-6">
                              <div className="form-floating">
                                <select
                                  {...register("organizationType")}
                                  className="form-select"
                                >
                                  <option value="COMPANY">Company</option>
                                  <option value="GOVERNMENT">Government</option>
                                  <option value="NON_PROFIT">
                                    Non-Profit Organization
                                  </option>
                                </select>
                                <label htmlFor="organizationType">
                                  Organization Type
                                </label>
                              </div>
                              {errors.organizationType && (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "12px" }}
                                >
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
                              className={`form-control ${
                                errors.email ? "is-invalid" : ""
                              }`}
                              id="email"
                              placeholder="e.g. john@example.com"
                              maxLength={50}
                              {...register("email")}
                            />
                            <label htmlFor="email">Email</label>
                          </div>
                          {errors.email && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.email.message}
                    </div>
                          )}
                  </div>
                  <div className="col-12">
                          <div className="form-floating position-relative">
                      <input
                              type={isPasswordVisible ? "text" : "password"}
                              className={`form-control ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              id="password"
                              placeholder="Enter password"
                              maxLength={50}
                              style={{
                                backgroundImage: "none",
                              }}
                              autoComplete="new-password"
                              {...register("password")}
                      />
                      <HugeiconsIcon
                              icon={
                                isPasswordVisible ? ViewIcon : ViewOffSlashIcon
                              }
                        size={20}
                        className="position-absolute top-50 translate-middle-y text-placeholder"
                        style={{
                          right: "15px",
                          cursor: "pointer",
                          color: "#959595",
                        }}
                              onClick={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                              }
                            />
                            <label htmlFor="password">Password</label>
                          </div>
                          {errors.password && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.password.message}
                            </div>
                          )}
                        </div>
                        <div className="col-12">
                          <div className="form-floating position-relative">
                            <input
                              type={
                                isConfirmPasswordVisible ? "text" : "password"
                              }
                              className={`form-control ${
                                errors.confirmPassword ? "is-invalid" : ""
                              }`}
                              id="confirmPassword"
                              placeholder="Confirm password"
                              maxLength={50}
                              style={{
                                backgroundImage: "none",
                              }}
                              {...register("confirmPassword")}
                            />
                            <HugeiconsIcon
                              icon={
                                isConfirmPasswordVisible
                                  ? ViewIcon
                                  : ViewOffSlashIcon
                              }
                              size={20}
                        className="position-absolute top-50 translate-middle-y text-placeholder"
                        style={{
                          right: "15px",
                          cursor: "pointer",
                          color: "#959595",
                        }}
                              onClick={() =>
                                setIsConfirmPasswordVisible(
                                  !isConfirmPasswordVisible
                                )
                              }
                            />
                            <label htmlFor="confirmPassword">
                              Confirm Password
                            </label>
                          </div>
                          {errors.confirmPassword && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.confirmPassword.message}
                    </div>
                          )}
                  </div>
                  <div className="col-12">
                          <PhoneInputComponent
                            value={watch("mobile")}
                            wrapperClassName="mb-0"
                            onChange={(value) =>
                              setValue("mobile", value || "", {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                              })
                            }
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
                              className={`form-control ${
                                errors.websiteLink ? "is-invalid" : ""
                              }`}
                              id="websiteLink"
                              placeholder="e.g. https://linkedin.com/in/john"
                              maxLength={50}
                              {...register("websiteLink")}
                            />
                            <label htmlFor="websiteLink">
                              LinkedIn Profile
                            </label>
                          </div>
                          {errors.websiteLink && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.websiteLink.message}
                    </div>
                          )}
                  </div>

                  <div className="col-12">
                    <div className="form-check d-flex">
                      <input
                              className={`form-check-input border-dark ${
                                errors.isDisabled ? "is-invalid" : ""
                              }`}
                        type="checkbox"
                              id="isDisabled"
                              {...register("isDisabled")}
                            />
                            <label
                              className="form-check-label me-2"
                              htmlFor="isDisabled"
                              style={{ color: "inherit", fontSize: "14px" }}
                            >
                              I have a disability and would like to disclose
                              this information
                      </label>
                    </div>
                          {errors.isDisabled && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.isDisabled.message}
                            </div>
                          )}
                  </div>
                        <div className="w-100 mt-4">
                          <button
                            type="submit"
                            className="btn btn-black w-100"
                            disabled={loading || parseResumeMutation.isPending}
                            onClick={onNext}
                          >
                            {loading || parseResumeMutation.isPending
                              ? "Creating Account..."
                              : "Continue"}
                    </button>
                  </div>
                </div>
                    </div>
                  )}
                  {activeStep === 3 && (
                <div>
                      <ProfileInfoStep
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    Controller={Controller}
                                    control={control}
                                    setValue={setValue}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                  />
                      <div className="col-12">
                        <div className="form-check d-flex">
                          <input
                            className={`form-check-input border-dark ${
                              errors.termsAccepted ? "is-invalid" : ""
                            }`}
                            type="checkbox"
                            id="termsAccepted"
                            {...register("termsAccepted")}
                          />
                          <label
                            className="form-check-label me-2"
                            htmlFor="termsAccepted"
                            style={{ color: "inherit", fontSize: "14px" }}
                          >
                            I have read and accept the 
                            <Link
                              href="/termsConditions"
                              style={{
                                color: "inherit",
                                textDecoration: "underline",
                              }}
                              onClick={() => navigate('/termsConditions')}
                            >
                              Terms and Conditions 
                            </Link>
                            {" "}as well as the{" "} 
                            <Link
                              href="/privacyPolicy"
                              style={{
                                color: "inherit",
                                textDecoration: "underline",
                              }}
                              onClick={() => navigate('/privacyPolicy')}
                            >
                              Privacy Policy.
                            </Link>
                            {/* Yes, I understand and agree to the{" "}
                            <a
                              href=""
                              style={{
                                color: "inherit",
                                textDecoration: "underline",
                              }}
                            >
                              Talented Xpert Terms of Service,
                            </a>{" "}
                            including the{" "}
                            <a
                              href=""
                              style={{
                                color: "inherit",
                                textDecoration: "underline",
                              }}
                            >
                              User Agreement
                            </a>{" "}
                            and{" "}
                            <a
                              href=""
                              style={{
                                color: "inherit",
                                textDecoration: "underline",
                              }}
                            >
                              Privacy Policy.
                            </a> */}
                          </label>
                        </div>
                        {errors.termsAccepted && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.termsAccepted.message}
                          </div>
                        )}
                      </div>
                      <div className="w-100 mt-4">
                                    <button
                                      type="submit"
                          className="btn btn-black w-100"
                          disabled={loading || parseResumeMutation.isPending}
                        >
                          {loading || parseResumeMutation.isPending
                            ? "Creating Account..."
                            : "Create an Account"}
                                    </button>
                                  </div>
                                </div>
                  )}
                  {(loading || parseResumeMutation.isPending) && (
                    <GlobalLoader />
                  )}
                              </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RegisterComponent;
