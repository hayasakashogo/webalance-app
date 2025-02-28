import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zhbaymjqqthseiolmoen.supabase.co",
      },
    ],
  },
};

export default nextConfig;
