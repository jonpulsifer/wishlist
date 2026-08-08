import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Partial prerendering: the shell prerenders, every runtime read streams in
  // through its own Suspense boundary. `partialPrefetching` needs this on.
  cacheComponents: true,
  partialPrefetching: true,
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
  // `/wishlists` listed the groups people share, which a Wishlist is not: it is
  // one person's collection, and the group is a Family. The word moved, so the
  // route follows it — and thirty people have the old one bookmarked.
  async redirects() {
    return [
      { source: '/wishlists', destination: '/families', permanent: true },
    ];
  },
};

export default nextConfig;
