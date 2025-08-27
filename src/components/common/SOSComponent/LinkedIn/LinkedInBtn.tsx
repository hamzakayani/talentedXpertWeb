import React from 'react'
import { Icon } from '@iconify/react';
import apiCall from '@/services/apiCall/apiCall';
import { useAppDispatch } from '@/store/Store';
import { toast } from 'react-toastify';
import { useNavigation } from '@/hooks/useNavigation';
import { saveToken, setAuthState } from "@/reducers/AuthSlice";


const LinkedInBtn = ({ profileType }: { profileType: string }) => {
    const dispatch = useAppDispatch();
    const { navigate } = useNavigation();


    const onLinkedInLoad = (caseType: any) => {
        let url = '';
        let redirect_url = window.location.hostname.startsWith('www') ? `${process.env.DOMAIN_WWW}/signin` : `${process.env.DOMAIN}/signin`; // Your local development URL
        const linkedinClientId = process.env.REACT_APP_LINKEDIN_APPID;
        const linkedinSecret = process.env.REACT_APP_LINKEDIN_SECRET_KEY;
        const scopes = ['email', 'profile', 'openid']; // Specify the scopes you need

        const scopeString = scopes.join(' '); // Join the scopes with a space

        const state = Math.random().toString(36).substring(2); // Generate a random state parameter for security

        url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${redirect_url}&scope=${scopeString}`;
        console.log('url', url)
        const win: Window | null = window.open(url, 'windowname11', 'width=800, height=600');
        if (win) win.focus();
        const pollTimer = window.setInterval(async function () {
            try {
                if (win) {
                    if (win.document.URL.indexOf(redirect_url) !== -1) {
                        window.clearInterval(pollTimer);
                        const urlSearchParams = new URLSearchParams(win.location.search);
                        let code = urlSearchParams.get('code');
                        console.log('code', code)
                        let error = urlSearchParams.get('error');
                        let errorDescription = urlSearchParams.get('error_description');
                        const state = caseType;
                        console.log("code, error, errorDescription", code, error, errorDescription);
                        win.close();
                        // window.close();

                        if (code && !error && !errorDescription) {
                            console.log('api call')
                            try {
                                const response: any = await apiCall(
                                    '/users/signIn/linkedin',
                                    { token: code, roleId: 3, redirectUrl: redirect_url, profileType: profileType },
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
                            // onNetworkInfo({ code, redirectW: window.location.hostname.startsWith('www') ? true : false, signupType: 'LinkedIn' });
                        } else if (error && errorDescription) {
                            const object = {
                                case: state,
                                platform: 'IN',
                                artifacts: [],
                                isApiOnOff: true,
                                error: { message: errorDescription.split('+').join(' ') },
                            };
                            // onNetworkInfo(object);
                        }
                    }
                }
            } catch (error) {
                // Handle errors here
            }
        }, 100);
    };

    return (
        <button type='button' className='signin-rectangle' onClick={onLinkedInLoad}>
            <Icon icon="flowbite:linkedin-solid" className='text-white fs-20' />
        </button>
    )
}

export default LinkedInBtn