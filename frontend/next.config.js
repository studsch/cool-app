/** @type {import('next').NextConfig} */
const nextConfig = {};

const localConfig = {
    // experimental: {
    //     serverActions: true,
    //   },
    webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        });
      
        return config;
    },
    images: {
        domains: ['localhost'],
    },
    reactStrictMode: false,
    env: {
        MINIO_PUBLIC_DOMEN_URL: process.env.MINIO_PUBLIC_DOMEN_URL,
    }
    
};

module.exports = localConfig; 

