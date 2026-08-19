import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextConfig: any = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  allowedDevOrigins: ["ais-dev-3hqpgbipu3zk3uddo6a7go-471777998107.europe-west2.run.app"],
};

export default nextConfig as NextConfig;
