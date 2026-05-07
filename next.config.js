/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/robots.txt',
          destination: '/api/robots',
        },
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
      ],
    };
  },
};

module.exports = nextConfig;
