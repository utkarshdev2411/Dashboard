import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      'dribbble.com',
      'res.cloudinary.com',
      'cdn.dummyjson.com',
      'www.pngmart.com', 
    ],
  },
};

export default nextConfig;
