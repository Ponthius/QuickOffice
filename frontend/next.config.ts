import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.140.143.58:8001/api/:path*",
      },
    ];
  },
};

export default nextConfig;