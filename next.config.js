const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);
