/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env:{
        BASE_URL: process.env.BASE_URL,
        DOMAIN: process.env.DOMAIN 
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
