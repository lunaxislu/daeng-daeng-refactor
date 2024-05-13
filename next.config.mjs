/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  // output: 'export',
  images: {
    unoptimized: true,
    domains: ['localhost', '*'],
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/v2/:path*/',
        destination: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/:path*/`,
      },
    ];
  },
};

export default nextConfig;
