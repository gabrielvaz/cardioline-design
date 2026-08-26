import type { NextConfig } from 'next';

/**
 * The prototype ships as a static export to GitHub Pages, which serves it from
 * a repository subpath and has no Node runtime — hence `output: 'export'`, the
 * `basePath`, and unoptimized images (the optimizer is a server feature).
 *
 * `BASE_PATH` is set by the Pages workflow; local `next dev` leaves it empty so
 * the app still runs at `http://localhost:3001/`.
 */
const basePath = process.env.BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  /* `next/image` skips basePath when unoptimized, so components prefix
     public/ paths themselves via lib/asset.ts. */
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  /* GitHub Pages resolves `/exams/ECG-2401` to `/exams/ECG-2401/index.html`,
     so every route needs its own directory. */
  trailingSlash: true,
  transpilePackages: ['@cardioline/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cardioline.com',
      },
    ],
  },
};

export default nextConfig;
