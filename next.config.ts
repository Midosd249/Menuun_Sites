import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/templates/atelier-09", destination: "/templates/atelier-09/index.html" },
        { source: "/templates/atelier-09/", destination: "/templates/atelier-09/index.html" }
      ]
    };
  }
};

export default nextConfig;
