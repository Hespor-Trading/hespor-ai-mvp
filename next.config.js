/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/undefined',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
