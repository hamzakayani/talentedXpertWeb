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
                hostname: 'skill-yah-dev-bucket.s3.amazonaws.com',
            },
        ],
    },
};

export default nextConfig;
