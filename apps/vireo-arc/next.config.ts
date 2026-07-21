import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cardioline/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
