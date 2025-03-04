import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true, // Hoặc false nếu bạn muốn redirect tạm thời
      },
    ];
  },
};

export default nextConfig;
