import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ 1. OPTIMIZARE JS: Activăm Tree-Shaking agresiv pentru bibliotecile grele
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      '@rainbow-me/rainbowkit', 
      'wagmi', 
      'viem'
    ],
  },

  // ✅ 2. IMAGINI (Păstrat din codul tău)
  images: {
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
    ],
  },
  
  typescript: {
    // Ignoră erorile de TS la build
    ignoreBuildErrors: true,
  },
  
  // ✅ 3. FIX WALLET CONNECT (Păstrat din codul tău)
  webpack: (config: any) => {
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding",
      "tap",
      "desm",
      "fastbench",
      "why-is-node-running"
    );
    return config;
  },
};

export default nextConfig;