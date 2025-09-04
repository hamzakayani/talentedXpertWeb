"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "@/schemas/login-schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { dataForServer } from "@/models/loginModel/loginModel";
import { toast } from "react-toastify";
import { usePostLogin } from "@/hooks/auth/usePostLogin";
import { useAppDispatch } from "@/store/Store";
import { saveToken, setAuthState } from "@/reducers/AuthSlice";
import GoogleProvider from "../common/SOSComponent/Google/GoogleProvider";
import LinkedInBtn from "../common/SOSComponent/LinkedIn/LinkedInBtn";
import { useNavigation } from "@/hooks/useNavigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleLock01Icon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { usePostGoogleSOSLogin, usePostLinkedinSOSLogin } from "@/hooks/auth/usePostSOSLogin";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";
type FormSchemaType = z.infer<typeof LoginSchema>;

const Signin = () => {
  const dispatch = useAppDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  // const router = useRouter();
  const { navigate } = useNavigation();
  const loginMutation = usePostLogin();
  const googleMutation = usePostGoogleSOSLogin()
  const linkedinMutation = usePostLinkedinSOSLogin()

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
    watch,
    setValue,
  } = useForm<FormSchemaType>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      loginAs: "TE",
    },
    resolver: zodResolver(LoginSchema),
    mode: "all",
  });

  const loginAs = watch("loginAs");

  const UserTypeButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: JSX.Element;
  }> = ({ label, isActive, onClick, icon }) => (
    <button
      type="button"
      className={`btn d-flex align-items-center justify-content-center gap-2 ${isActive ? "btn-dark text-white" : "btn-outline-dark text-dark"
        }`}
      onClick={onClick}
      style={{
        height: "35px",
        width: "50%",
        borderRadius: "8px",
        border: isActive ? "none" : "1px solid #000",
        backgroundColor: isActive ? "#000" : "transparent",
        fontWeight: "500",
        flex: "1",
      }}
    >
      {icon}
      {label}
    </button>
  );

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const formData = dataForServer(data);

    loginMutation.mutate(formData, {
      onSuccess: (response: any) => {
        // Save token and auth state
        dispatch(saveToken(response.access_token));
        localStorage?.setItem("accessToken", response.access_token);
        dispatch(setAuthState(true));
        localStorage.setItem("profileType", data?.loginAs);
        localStorage.setItem("access", "true");

        // Show success message and navigate
        toast.success("Signed in Successfully");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        // Handle error cases
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <section className="login my-3">
      <div className="container">
        <div className="card shadow-none border-2">
          {(googleMutation.isPending || linkedinMutation.isPending) && <GlobalLoader />}
          <div className="card-body mx-4 my-4 pt-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2 className="text-center mb-4 font20 text-black">
                Log in to your Account
              </h2>
              {/* User Type Selection Buttons */}
              <div className="d-flex gap-2 mb-3">
                <UserTypeButton
                  label="TalentedXpert"
                  isActive={loginAs === "TE"}
                  onClick={() => setValue("loginAs", "TE", { shouldValidate: true })}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke={loginAs === "TE" ? "#fff" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke={loginAs === "TE" ? "#fff" : "#000"} strokeWidth="1.5" />
                    </svg>
                  }
                />
                <UserTypeButton
                  label="TalentRequestor"
                  isActive={loginAs === "TR"}
                  onClick={() => setValue("loginAs", "TR", { shouldValidate: true })}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 7.5C3 5.01472 5.01472 3 7.5 3H16.5C18.9853 3 21 5.01472 21 7.5V16.5C21 18.9853 18.9853 21 16.5 21H7.5C5.01472 21 3 18.9853 3 16.5V7.5Z" stroke={loginAs === "TR" ? "#fff" : "#000"} strokeWidth="1.5" />
                      <path d="M8 12H16M8 8H16M8 16H12" stroke={loginAs === "TR" ? "#fff" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
              </div>

              <div className="form-floating mb-2 with-icon">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {/* <HugeiconsIcon
                  className="position-absolute top-50 translate-middle-y ms-2"
                  icon={User03Icon}
                /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="position-absolute top-50 translate-middle-y ms-2"
                >
                  <path
                    d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                    stroke="#141B34"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                    stroke="#141B34"
                    strokeWidth="1.5"
                  />
                </svg>
                <label htmlFor="floatingInput">Email</label>
              </div>
              {errors.email && (
                <div className="text-danger fs-12 mb-2" style={{ marginTop: "-5px" }}>
                  {errors.email.message}
                </div>
              )}

              <div className="form-floating mb-2 with-icon">
                <input
                  {...register("password")}
                  type={isPasswordVisible ? "text" : "password"} // Toggle between 'text' and 'password'
                  id="password"
                  placeholder="name@example.com"
                  className="form-control"
                  style={{
                    marginTop: "10px",
                  }}
                />
                <span
                  title={isPasswordVisible ? "Password visible" : "Password hidden"}>
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
                  icon={CircleLock01Icon}
                  className="position-absolute top-50 translate-middle-y ms-2"
                  size={20}
                />

                <label htmlFor="floatingInput">Password</label>
              </div>
              {errors.password && (
                <div className="text-danger fs-12 mb-2" style={{ marginTop: "-5px" }}>
                  {errors.password.message}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                <div className="form-check d-flex align-items-center m-0">
                  <input
                    {...register("rememberMe")}
                    className="form-check-input border-dark"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label me-2 mt-1" htmlFor="rememberMe">
                    Remember for 30 days
                  </label>
                </div>
                <Link href="/forgot-password" className="forget">
                  Forgot Password?
                </Link>
              </div>
              {watch("rememberMe") && (
                <div className="text-danger fs-12 mt-1 mb-1">
                  You’ll stay logged in on this device
                </div>
              )}
              <div className=" w-100 mb-3">
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="btn btn-black w-100"
                >
                  {loginMutation.isPending ? "Logging in..." : "Log In"}
                </button>
              </div>
              <div className="text-center my-4 position-relative d-flex align-items-center justify-content-center border-bottom">

                <span className="or-text px-2 position-absolute bg-white">
                  OR
                </span>
              </div>
              <div className="d-flex justify-content-center mb-3 flex-column gap-3">
                <GoogleProvider profileType={getValues("loginAs")} disabled={loginMutation.isPending || googleMutation.isPending || linkedinMutation.isPending} />
                <LinkedInBtn profileType={getValues("loginAs")} disabled={loginMutation.isPending || googleMutation.isPending || linkedinMutation.isPending} />
              </div>
              <p
                className=" text-center sign-in-text mb-2"
                style={{ marginTop: 40 }}
              >
                Dont have an account?{" "}
              </p>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="btn w-100"
                style={{
                  background: "linear-gradient(135deg, #D7E2FF 0%, #AFEEFF 100%)",
                  border: "none",
                  color: "#333",
                  fontWeight: "500"
                }}
              >
                Register
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
