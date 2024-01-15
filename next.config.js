/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost'
            },
            {
                protocol: 'https',
                hostname: '**'
            },
            {
                protocol: 'http',
                hostname: '**'
            },
            {
                protocol: 'http',
                hostname: '**.**'
            },
            {
                protocol: 'https',
                hostname: '**.**'
            }
        ]
    }
}

module.exports = nextConfig
