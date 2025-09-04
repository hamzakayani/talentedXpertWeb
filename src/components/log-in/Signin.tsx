"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "@/schemas/login-schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { dataForServer } from "@/models/loginModel/loginModel";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/Store";
import { saveToken, setAuthState } from "@/reducers/AuthSlice";
import GoogleProvider from "../common/SOSComponent/Google/GoogleProvider";
import LinkedInBtn from "../common/SOSComponent/LinkedIn/LinkedInBtn";
import { useNavigation } from "@/hooks/useNavigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleLock01Icon,
  CirclePasswordIcon,
  SearchIcon,
  User03Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
type FormSchemaType = z.infer<typeof LoginSchema>;

const Signin = () => {
  const dispatch = useAppDispatch();

  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const router = useRouter();
  const { navigate } = useNavigation();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
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

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setIsFormSubmitted(true);
    const formData = dataForServer(data);

    await apiCall(requests.login, formData, "post", true, dispatch, null, null)
      .then((res: any) => {
        if (res?.error) {
          toast.error(res?.error?.message || "Something went wrong");
          setIsFormSubmitted(false);
        } else {
          dispatch(saveToken(res.data.access_token));
          localStorage?.setItem("accessToken", res.data.access_token);
          dispatch(setAuthState(true));
          localStorage.setItem("profileType", data?.loginAs);
          localStorage.setItem("access", "true");
          toast.success("Signed in Successfully");
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        setIsFormSubmitted(false);
        console.warn(err);
      });
  };

  return (
    <section className="login my-3">
      <div className="container">
        <div className="card shadow-none border-2">
          <div className="card-body mx-4 my-4 pt-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2 className="text-center mb-4 font20 text-black">
                Log in to your Account
              </h2>

              <div className="form-floating mb-3 with-icon">
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
                {errors.email && (
                  <div className="text-danger position-absolute top-100 left-0 fs-12">
                    {errors.email.message}
                  </div>
                )}
              </div>
              {/* <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>{" "}
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="form-control bg-dark"
                  id="email"
                  placeholder="Enter your email"
                ></input>
                {errors.email && (
                  <div className="text-danger pt-2">{errors.email.message}</div>
                )}
              </div> */}
              <div className="form-floating mb-3 with-icon">
                <input
                  {...register("password")}
                  type={isPasswordVisible ? "text" : "password"} // Toggle between 'text' and 'password'
                  id="password"
                  placeholder="name@example.com"
                  className="form-control"
                />
                <HugeiconsIcon
                  icon={ViewIcon}
                  className="position-absolute top-50 translate-middle-y text-placeholder"
                  style={{
                    right: "15px",
                    cursor: "pointer",
                    color: "#959595",
                  }}
                  size={20}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                />
                {/* <HugeiconsIcon
                  icon={ViewOffSlashIcon}
                  className="position-absolute top-50 translate-middle-y text-placeholder"
                  style={{
                    right: "15px",
                    cursor: "pointer",
                    color: "#959595",
                  }}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                /> */}
                <HugeiconsIcon
                  icon={CircleLock01Icon}
                  className="position-absolute top-50 translate-middle-y ms-2"
                  size={20}
                />

                <label htmlFor="floatingInput">Password</label>
                {errors.email && (
                  <div className="text-danger position-absolute top-100 left-0 fs-12">
                    {errors.email.message}
                  </div>
                )}
              </div>
              {/* <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">
                  Password <span className="text-danger">*</span>{" "}
                </label>
                <input
                  {...register("password")}
                  type={isPasswordVisible ? "text" : "password"} // Toggle between 'text' and 'password'
                  id="password"
                  className="form-control bg-dark"
                  placeholder="Enter password"
                  style={{ paddingRight: "45px" }}
                />
                <div
                  className="password-icon"
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    zIndex: 1000,
                    color: "#959595",
                  }}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Icon
                    icon={
                      isPasswordVisible
                        ? "mdi:eye-outline"
                        : "mdi:eye-off-outline"
                    }
                    width="20"
                    height="20"
                    className="text-placeholder"
                  />
                </div>
                {errors.password && (
                  <div className="text-danger pt-2">
                    {errors.password.message}
                  </div>
                )}
              </div> */}
              <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                <div className="form-check">
                  <input
                    {...register("rememberMe")}
                    className="form-check-input border-dark"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label me-2" htmlFor="rememberMe">
                    Remember for 30 days
                  </label>
                </div>
                <Link href="/forgot-password" className="forget">
                  Forgot Password?
                </Link>
              </div>
              <div className=" w-100 mb-3">
                <button
                  type="submit"
                  disabled={isFormSubmitted}
                  className="btn btn-black w-100"
                >
                  Log In
                </button>
              </div>
              <div className="text-center my-4 position-relative d-flex align-items-center justify-content-center border-bottom">
                {/* <Image
                  src="/assets/images/signin-line.svg"
                  alt="img"
                  className="img-fluid signin-line"
                  width={255}
                  height={255}
                  priority
                /> */}
                <span className="or-text px-2 position-absolute bg-white">
                  OR
                </span>
              </div>
              <div className="d-flex justify-content-center mb-3 flex-column gap-3">
                <GoogleProvider profileType={getValues("loginAs")} />
                <LinkedInBtn profileType={getValues("loginAs")} />
              </div>
              <p
                className=" text-center sign-in-text mb-2"
                style={{ marginTop: 40 }}
              >
                Dont have an account?{" "}
              </p>
              <button
                type="submit"
                onClick={() => navigate("/register")}
                className="btn btn-black w-100"
              >
                Register
              </button>
              {/* <Link
                href="/register"
                onClick={() => navigate("/register")}
                className="forget text-blue fw-medium underline"
              >
                Register
              </Link> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
