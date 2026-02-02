import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },

  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  transpilePackages: ['reshaped'],
  cacheLife: {
    carousel: {
      stale: 60,
      revalidate: 300,
      expire: 3600,
    },
  },
  experimental: {
    useCache: true,
    optimizePackageImports: ['reshaped'],
  },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      ...(process.env.CDN_URL
        ? (() => {
            try {
              const url = new URL(process.env.CDN_URL);
              return [
                {
                  protocol: url.protocol.replace(':', '') as 'http' | 'https',
                  hostname: url.hostname,
                  pathname: '/**/uploads/**',
                },
              ];
            } catch {
              return [];
            }
          })()
        : []),
      // Development: Local Strapi
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Development: Custom Host Strapi
      {
        protocol: 'http',
        hostname: 'dev.api.legacy',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Production: CDN for media assets
      {
        protocol: 'https',
        hostname: 'lps-static.sereducacional.com',
        pathname: '/bo-assets/uploads/**',
      },
      // QA: CDN for media assets
      {
        protocol: 'https',
        hostname: 'lps-static.qa.sereducacional.com',
        pathname: '/bo-assets/uploads/**',
      },
      // Strapi Cloud (temporary, can be removed after migration)
      {
        protocol: 'https',
        hostname: 'cozy-joy-a6787fb158.media.strapiapp.com',
      },
      // Placeholder images
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.it',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
