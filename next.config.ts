import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Note: output: 'standalone' removed - Vercel handles this automatically
  // Setting it manually can cause routes-manifest.json errors on Vercel

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://campus-teranga-backend.onrender.com/api',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Campus Teranga Admin',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    NEXT_PUBLIC_APP_ENVIRONMENT: process.env.NEXT_PUBLIC_APP_ENVIRONMENT || 'production',
  },

  // Image optimization
  images: {
    domains: ['campus-teranga-backend.onrender.com'],
    unoptimized: true, // For Vercel deployment
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
