import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.lexoya.com',
        port: '',
        pathname: '/longbio-gca/profiles/**',
      },
      {
        protocol: 'https',
        hostname: 'api.longbio.me',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
