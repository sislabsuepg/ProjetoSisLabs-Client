import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET || "http://localhost:3400";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  basePath: "/sislabs",
  assetPrefix: "/sislabs/",
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
