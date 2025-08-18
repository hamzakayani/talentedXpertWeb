/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, { isServer, dev }) => {
        // Fix for react-form-stepper webpack HMR issue
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        
        // Handle problematic packages
        config.module.rules.push({
            test: /\.m?js$/,
            resolve: {
                fullySpecified: false,
            },
        });
        
        // Disable HMR for problematic packages in development
        if (dev) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    ...config.optimization.splitChunks,
                    cacheGroups: {
                        ...config.optimization.splitChunks.cacheGroups,
                        default: false,
                        vendors: false,
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules/,
                            priority: 20,
                        },
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                    },
                },
            };
        }
        
        return config;
    },
    env:{
        BASE_URL: process.env.BASE_URL,
        BASE_URL_AI: process.env.BASE_URL_AI,
        DOMAIN: process.env.DOMAIN,
        REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY,
        REACT_APP_STRIPE_TEST_SECRET_KEY: process.env.REACT_APP_STRIPE_TEST_SECRET_KEY, 
        REACT_APP_GOOGLE_CLIENTID: process.env.REACT_APP_GOOGLE_CLIENTID,
        REACT_APP_LINKEDIN_APPID: process.env.REACT_APP_LINKEDIN_APPID,
        REACT_APP_LINKEDIN_SECRET_KEY: process.env.REACT_APP_LINKEDIN_SECRET_KEY,
        REACT_APP_GOOGLE_CLIENT_SECRET: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
        REACT_APP_GOOGLE_MAP_API_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        REACT_APP_VIDEOSDK_API_KEY: process.env.REACT_APP_VIDEOSDK_API_KEY,
        REACT_APP_VIDEOSDK_SECRET_KEY: process.env.REACT_APP_VIDEOSDK_SECRET_KEY,
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
