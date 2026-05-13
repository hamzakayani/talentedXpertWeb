/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }

        config.module.rules.push({
            test: /\.m?js$/,
            resolve: {
                fullySpecified: false,
            },
        });

        return config;
    },
    env:{
        BASE_URL: process.env.BASE_URL,
        BASE_URL_AI: process.env.BASE_URL_AI,
        DOMAIN: process.env.DOMAIN,
        DOMAIN_WWW: process.env.DOMAIN_WWW,
        REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY,
        REACT_APP_STRIPE_TEST_SECRET_KEY: process.env.REACT_APP_STRIPE_TEST_SECRET_KEY, 
        REACT_APP_GOOGLE_CLIENTID: process.env.REACT_APP_GOOGLE_CLIENTID,
        REACT_APP_LINKEDIN_APPID: process.env.REACT_APP_LINKEDIN_APPID,
        REACT_APP_LINKEDIN_SECRET_KEY: process.env.REACT_APP_LINKEDIN_SECRET_KEY,
        REACT_APP_GOOGLE_CLIENT_SECRET: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
        REACT_APP_GOOGLE_MAP_API_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        REACT_APP_GOOGLE_MAP_ID: process.env.REACT_APP_GOOGLE_MAP_ID,
        REACT_APP_VIDEOSDK_API_KEY: process.env.REACT_APP_VIDEOSDK_API_KEY,
        REACT_APP_VIDEOSDK_SECRET_KEY: process.env.REACT_APP_VIDEOSDK_SECRET_KEY,
        REACT_APP_VIDEOSDK_ENDPOINT: process.env.REACT_APP_VIDEOSDK_ENDPOINT,
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
            // for production bucket
            {
                protocol: 'https',
                hostname: 'talentexpert-public-prod.s3.us-east-2.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'talentegxpert-public-prod.s3.us-east-2.amazonaws.com',
            },
            // for dev bucket
            {
                protocol: 'https',
                hostname: 'talentexpert-public-dev.s3.us-east-2.amazonaws.com',
            }            
        ],
    },
};

export default nextConfig;
