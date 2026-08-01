import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: process.env.STANDALONE ? 'standalone' : undefined,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
