'use client'
import React, { FC } from "react";
import { Icon } from "@iconify/react";
import apiCall from "@/services/apiCall/apiCall";
import { useAppDispatch } from "@/store/Store";
import { toast } from "react-toastify";
import { useNavigation } from "@/hooks/useNavigation";
import { saveToken, setAuthState } from "@/reducers/AuthSlice";
import { usePostLinkedinSOSLogin } from "@/hooks/auth/usePostSOSLogin";

interface LinkedInBtnParams {
  profileType: string,
  disabled: boolean,
  route?: string,
  userType?: string | null
}

const LinkedInBtn:FC<LinkedInBtnParams> = ({ profileType, disabled, route, userType }) => {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();

  const linkedinLoginMutation = usePostLinkedinSOSLogin();

  const onLinkedInLoad = (caseType: any) => {
    let url = "";
    let redirect_url = window.location.hostname.startsWith("www")
      ? `${process.env.DOMAIN_WWW}/signin`
      : `${process.env.DOMAIN}/signin`; // Your local development URL
    const linkedinClientId = process.env.REACT_APP_LINKEDIN_APPID;

    const linkedinSecret = process.env.REACT_APP_LINKEDIN_SECRET_KEY;
    const scopes = ["email", "profile", "openid"]; // Specify the scopes you need

    const scopeString = scopes.join(" "); // Join the scopes with a space

    const state = Math.random().toString(36).substring(2); // Generate a random state parameter for security

    url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${redirect_url}&scope=${scopeString}`;

    const win: Window | null = window.open(
      url,
      "windowname11",
      "width=800, height=600"
    );
    if (win) win.focus();
    const pollTimer = window.setInterval(async function () {
      try {
        if (win) {
          if (win.document.URL.indexOf(redirect_url) !== -1) {
            window.clearInterval(pollTimer);
            const urlSearchParams = new URLSearchParams(win.location.search);
            let code = urlSearchParams.get("code");
            let error = urlSearchParams.get("error");
            let errorDescription = urlSearchParams.get("error_description");
            const state = caseType;

            win.close();
            // window.close();

            if (code && !error && !errorDescription) {
              try {
                linkedinLoginMutation.mutate(
                  {
                    token: code,
                    roleId: 3,
                    redirectUrl: redirect_url,
                    profileType: profileType,
                    ...(userType !== undefined && userType !== null ? { userType } : { userType: 'INDIVIDUAL' })
                  },
                  {
                    onSuccess: (response: any) => {
                      dispatch(saveToken(response.access_token));
                      localStorage.setItem("accessToken", response.access_token);
                      dispatch(setAuthState(true));
                      localStorage.setItem("profileType", profileType);
                      localStorage.setItem("access", "true");
                      toast.success(response.message);
                      navigate(response?.user?.isProfileCompleted ? '/dashboard' : route || "/dashboard/profile-setting");
                    },
                    onError: (apiErr: any) => {
                      const errorMessage = apiErr?.response?.data?.message || apiErr?.message || "Something went wrong";
                      toast.error(errorMessage);
                    },
                  }
                )
              } catch (apiErr: any) {
                const errorMessage = apiErr?.response?.data?.message || apiErr?.message || "Something went wrong";
                toast.error(errorMessage);
              }
            } else if (error && errorDescription) {
              const object = {
                case: state,
                platform: "IN",
                artifacts: [],
                isApiOnOff: true,
                error: { message: errorDescription.split("+").join(" ") },
              };
            }
          }
        }
      } catch (error) {
        // Handle errors here
      }
    }, 100);
  };

  return (
    <button
      type="button"
      className="signin-rectangle w-100"
      onClick={onLinkedInLoad}
      disabled={disabled}
    >
      <Icon
        icon="flowbite:linkedin-solid"
        fontSize={18}
        className="text-white"
        style={{ backgroundColor: "#2867B2", borderRadius: "2px" }}
      />{" "}
      Continue with LinkedIn
    </button>
  );
};

export default LinkedInBtn;
