/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/@:path",
        destination: `/profile/:path`,
      },
      {
        source: "/dashboard",
        destination: "/overview",
      },
      {
        source: "/dashboard/:path",
        destination: "/overview/:path",
      },
    ];
  },
};

export default nextConfig;
