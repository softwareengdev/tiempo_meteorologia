import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'basemaps.cartocdn.com' },
      { protocol: 'https', hostname: 'tile.openstreetmap.org' },
    ],
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
      '@tanstack/react-query',
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/clima', destination: '/', permanent: true },
      { source: '/tiempo', destination: '/', permanent: true },
      { source: '/home', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;

