/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env:{
        BASE_URL: process.env.BASE_URL,
        DOMAIN: process.env.DOMAIN 
    }
};

export default nextConfig;
