const withPWA = require("next-pwa")({
  dest: "public",
  maximumFileSizeToCacheInBytes: 20485760,
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== "production",
});
/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
});
module.exports = nextConfig;
