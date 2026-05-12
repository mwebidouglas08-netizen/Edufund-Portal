/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Do NOT set output:'standalone' on Vercel — it breaks deployment.
  // Standalone is only for Docker/Render/Railway.
  // Vercel handles its own optimised output automatically.

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },

  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
