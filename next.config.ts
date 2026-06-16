import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

// if we're in development, set up the dev platform
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default withNextIntl(nextConfig);
