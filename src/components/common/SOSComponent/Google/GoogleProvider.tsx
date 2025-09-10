import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { FC } from "react";
import GoogleBtn from "./GoogleBtn";

interface GoogleBtnParams {
  profileType: string,
  disabled: boolean, 
  route?: string
}

const GoogleProvider:FC<GoogleBtnParams> = ({ profileType, disabled, route }) => {
  return (
    <>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENTID as string}
      >
        <GoogleBtn profileType={profileType} disabled={disabled} route={route} />
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleProvider;
