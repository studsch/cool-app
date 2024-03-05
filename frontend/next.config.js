/** @type {import('next').NextConfig} */
const nextConfig = {};

const localConfig = {
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
    
};

module.exports = localConfig; 

