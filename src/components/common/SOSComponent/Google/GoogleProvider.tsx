import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { FC } from "react";
import GoogleBtn from "./GoogleBtn";

interface GoogleBtnParams {
  profileType: string,
  disabled: boolean
}

const GoogleProvider:FC<GoogleBtnParams> = ({ profileType, disabled }) => {
  return (
    <>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENTID as string}
      >
        <GoogleBtn profileType={profileType} disabled={disabled} />
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleProvider;
