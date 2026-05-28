import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    // NOTE: rewrites() runs at BUILD time in Next.js, not at runtime.
    // BACKEND_URL must therefore be available as a build arg (see Dockerfile).
    // We fall back to NEXT_PUBLIC_BACKEND_URL which CI already passes, so the
    // app keeps working even if BACKEND_URL was not provided to the build.
    const backend = (
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:4000"
    ).replace(/\/+$/, "");
    return [
      {
        source: "/hubs/:path*",
        destination: `${backend}/hubs/:path*`,
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(process.cwd())],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      return [
        {
          source: "/_next/static/:path*",
          headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
        },
      ];
    }
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "metwalilabs.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fstorage.syrian-medical.tech",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    // Find the default file-loader rule for SVGs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg"),
    );
    // Add SVGR loader before the file-loader
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      use: ["@svgr/webpack"], // <- SVGR loader
    });
    return config;
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
