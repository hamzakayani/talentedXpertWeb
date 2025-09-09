import React, { FC } from "react";
import { Icon } from "@iconify/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "@/store/Store";
import { useNavigation } from "@/hooks/useNavigation";
import apiCall from "@/services/apiCall/apiCall";
import { saveToken, setAuthState } from "@/reducers/AuthSlice";
import { toast } from "react-toastify";
import { usePostGoogleSOSLogin } from "@/hooks/auth/usePostSOSLogin";

interface GoogleBtnParams {
  profileType: string,
  disabled: boolean,
  route?: string
}

const GoogleBtn:FC<GoogleBtnParams> = ({ profileType, disabled, route }) => {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();

  const googleMutation = usePostGoogleSOSLogin()

  let redirect_url = window.location.hostname.startsWith("www")
    ? `${process.env.DOMAIN_WWW}/signin`
    : `${process.env.DOMAIN}/signin`; // Your local development URL
  const googleSuccessResponse = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse?.code) {
        const payload = {
          token: tokenResponse.code,
          roleId: 3,
          profileType: profileType,
          redirectUrl: `${process.env.DOMAIN}`
        }
        googleMutation.mutate(payload, {
          onSuccess: (response: any) => {
            dispatch(saveToken(response.access_token));
            localStorage.setItem("accessToken", response.access_token);
            dispatch(setAuthState(true));
            localStorage.setItem("profileType", payload.profileType);
            localStorage.setItem("access", "true");
            toast.success(response.message);
            navigate(route || "/dashboard/profile-setting");
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
            toast.error(errorMessage);
          }
        });
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
    flow: "auth-code",
    scope: "email profile openid",
    // 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.profile',
  });

  return (
    <button
      type="button"
      className="signin-rectangle me-2 w-100"
      onClick={() => googleSuccessResponse()}
      disabled={disabled}
    >
      <Icon icon="flat-color-icons:google" fontSize={20} /> Continue with Google
    </button>
  );
};

export default GoogleBtn;
