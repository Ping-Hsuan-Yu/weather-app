/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/graphql',
            destination: 'https://opendata.cwa.gov.tw/linked/graphql',
          },
        ]
      },
};
export default nextConfig;
