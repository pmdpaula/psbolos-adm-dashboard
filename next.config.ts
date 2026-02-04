import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "github.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "cdn.jsdelivr.net" },
      { hostname: "testingbot.com" },
    ],
  },
  transpilePackages: ["@mui/x-data-grid"],
};

export default nextConfig;
