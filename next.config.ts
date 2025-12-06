import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Optimizare Pachete (Tree-Shaking)
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      '@rainbow-me/rainbowkit', 
      'wagmi', 
      'viem'
    ],
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
  
  // 3. FIX CAPITAL PENTRU EROAREA METAMASK / ASYNC STORAGE
  webpack: (config: any) => {
    // Partea existentă (păstrată)
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding",
      "tap",
      "desm",
      "fastbench",
      "why-is-node-running"
    );

    // ✅ AICI ESTE FIX-UL NOU CARE LIPSEA:
    // Îi spunem lui Next.js: "Dacă cineva cere pachetul de mobil, dă-i 'false' (ignori-l)"
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
};

export default nextConfig;