import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['zhbaymjqqthseiolmoen.supabase.co'], // Supabaseのドメインを追加
  },
};

export default nextConfig;
