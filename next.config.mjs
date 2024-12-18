/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.aceternity.com", "upload.wikimedia.org"],
  },
  output: "standalone",
};

export default nextConfig;
