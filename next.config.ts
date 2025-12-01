import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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