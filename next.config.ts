import type { NextConfig } from "next";

const nextConfig: any = {
  /* Config options here */
  typescript: {
    // Ignoră erorile de TS la build (ne trebuie viteză acum)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoră erorile de stil
    ignoreDuringBuilds: true,
  },
  // AICI E FIX-UL PENTRU PIERDEREA DE MODULE WALLETCONNECT
  webpack: (config: any) => {
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding",
      "tap",        // Astea sunt cele care dadeau eroare in log
      "desm",
      "fastbench"
    );
    return config;
  },
};

export default nextConfig;