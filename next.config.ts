import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ AICI ESTE FIX-UL PENTRU IMAGINI (YouTube)
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
  
  // Fix pentru WalletConnect (module lipsă)
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