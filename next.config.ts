import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // Important pour le support des fonctions backend sur Vercel ou autre
};

export default nextConfig;
