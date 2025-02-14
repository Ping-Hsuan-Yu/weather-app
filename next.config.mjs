/** @type {import('next').NextConfig} */
const nextConfig = {
//   serverRuntimeConfig: {
//     GRAPHQL_API: "https://opendata.cwa.gov.tw/linked/graphql",
//   },
//   publicRuntimeConfig: {
//     GRAPHQL_API: "/api/graphql",
//   },
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: "https://opendata.cwa.gov.tw/linked/graphql",
      },
    ];
  },
};
export default nextConfig;
