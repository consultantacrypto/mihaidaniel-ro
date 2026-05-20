import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // @ts-ignore - Ignorăm eroarea de tip, proprietatea e validă pentru Next.js 16+
  turbopack: {},



  // 1. Optimizare Pachete (Tree-Shaking)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // 2. Optimizare Imagini
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Redirect-uri pentru trafic vechi
  async redirects() {
    return [
      // Dezactivat pentru Faza 3 (portal /en) — nu redirecta /en către home
      // {
      //   source: '/en',
      //   destination: '/',
      //   permanent: true,
      // },
      {
        source: '/blogs/crypto-news',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pages/cursuri',
        destination: '/#curs',
        permanent: true,
      },
      {
        source: '/products/consultanta-crypto',
        destination: '/consultanta-crypto',
        permanent: true,
      },
      {
        source: '/products/consultanta',
        destination: '/consultanta-crypto',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);