import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  basePath: "/sislabs",
  assetPrefix: "/sislabs/",
  trailingSlash: true,
};

export default nextConfig;
