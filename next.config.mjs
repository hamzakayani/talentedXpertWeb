/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env:{
        BASE_URL: process.env.BASE_URL,
        BASE_URL_AI: process.env.BASE_URL_AI,
        DOMAIN: process.env.DOMAIN,
        REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY,
        REACT_APP_STRIPE_TEST_SECRET_KEY: process.env.REACT_APP_STRIPE_TEST_SECRET_KEY, 
        REACT_APP_GOOGLE_CLIENTID: process.env.REACT_APP_GOOGLE_CLIENTID,
        REACT_APP_LINKEDIN_APPID: process.env.REACT_APP_LINKEDIN_APPID,
        REACT_APP_LINKEDIN_SECRET_KEY: process.env.REACT_APP_LINKEDIN_SECRET_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'telentexpert-public-s3.s3.us-east-2.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'telentexpert.s3.us-east-2.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'talentexpert.s3.us-east-2.amazonaws.com',
            },
        ],
    },
};

export default nextConfig;
