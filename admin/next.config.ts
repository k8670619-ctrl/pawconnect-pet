import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.pawconnect.ai', 'ui-avatars.com'],
  },
};

export default nextConfig;
