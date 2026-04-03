import type { NextConfig } from "next";

const replitDomain = process.env.REPLIT_DEV_DOMAIN;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  ...(replitDomain
    ? {
        allowedDevOrigins: [
          `https://${replitDomain}`,
          `https://*.${replitDomain.split(".").slice(-2).join(".")}`,
        ],
      }
    : {}),
};

export default nextConfig;
