import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "http://13.140.143.58:8001"
    : "http://127.0.0.1:8000");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Use the local Django server during development; deployments can
        // override this with BACKEND_URL (for example, port 8001).
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${backendUrl}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
