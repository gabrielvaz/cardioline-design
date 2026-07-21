import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cardioline/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cardioline.com',
      },
    ],
  },
};

export default nextConfig;
