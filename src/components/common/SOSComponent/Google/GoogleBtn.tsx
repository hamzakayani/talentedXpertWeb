import React from 'react'
import { Icon } from '@iconify/react';
import { useGoogleLogin } from '@react-oauth/google'
import { useAppDispatch } from '@/store/Store';
import { useNavigation } from '@/hooks/useNavigation';
import apiCall from '@/services/apiCall/apiCall';
import { saveToken, setAuthState } from "@/reducers/AuthSlice";
import { toast } from 'react-toastify';

const GoogleBtn = ({ profileType }: { profileType: string }) => {
    const dispatch = useAppDispatch();
    const { navigate } = useNavigation();

    let redirect_url = window.location.hostname.startsWith('www') ? `${process.env.DOMAIN_WWW}/signin` : `${process.env.DOMAIN}/signin`; // Your local development URL
    const googleSuccessResponse = useGoogleLogin({

        onSuccess: async (tokenResponse) => {
            if (tokenResponse?.code) {
                console.log('tokenResponse', tokenResponse);
                try {
                    const response: any = await apiCall(
                        '/users/signIn/google',
                        { token: "4/0AVMBsJi8gR48q98NkNdZch8tpGGZcEixWSvQMpyDsLQ2z3HrTGfrg257w84-KBg4qRJkxw", roleId: 3, profileType: profileType },
                        'post',
                        true,
                        null,
                        null,
                        null,
                        true

                    );
                    console.log('LinkedIn sign-in success:', response?.data, response?.data?.access_token);
                    if (response?.data?.access_token) {
                        dispatch(saveToken(response.data.access_token));
                        localStorage?.setItem("accessToken", response.data.access_token);
                        dispatch(setAuthState(true));
                        localStorage.setItem("profileType", profileType);
                        localStorage.setItem("access", "true");
                        toast.success("Signed in Successfully");
                        navigate("/dashboard");
                    }

                } catch (apiErr: any) {
                    console.error('LinkedIn sign-in failed:', apiErr);
                    alert(`LinkedIn sign-in failed: ${apiErr?.message || apiErr}`);
                }
            }
        },
        onError: () => {
            console.error('Google login failed');
        },
        flow: 'auth-code',
        scope: 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.profile',
    });
        
    return (
        <button type='button' className='signin-rectangle me-2' onClick={() => googleSuccessResponse()}>
            <Icon icon="flat-color-icons:google" />
        </button>
    )
}

export default GoogleBtn