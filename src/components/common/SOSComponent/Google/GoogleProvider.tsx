import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { FC } from "react";
import GoogleBtn from "./GoogleBtn";

interface GoogleBtnParams {
  profileType: string,
  disabled: boolean, 
  route?: string,
  userType?: string | null
}

const GoogleProvider:FC<GoogleBtnParams> = ({ profileType, disabled, route, userType }) => {
  return (
    <>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENTID as string}
      >
        <GoogleBtn profileType={profileType} disabled={disabled} route={route} userType={userType} />
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleProvider;
