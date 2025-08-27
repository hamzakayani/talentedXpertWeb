import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import GoogleBtn from './GoogleBtn'

const GoogleProvider = ({ profileType }: { profileType: string }) => {
    return (
        <>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID as string}>
                <GoogleBtn profileType={profileType} />
            </GoogleOAuthProvider>
        </>
    )
}

export default GoogleProvider