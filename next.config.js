// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  eslint: {
    // dirs: ['components', 'layouts', 'lib', 'pages']
  },
  async headers() {
    return [
      {
        source: "/:path*{/}?",
        headers: [
          {
            key: "Permissions-Policy",
            value: "interest-cohort=()",
          },
        ],
      },
    ];
  },
  transpilePackages: ["dayjs"],

  // // Optional optimizations
  // experimental: {
  //   modularizeImports: {
  //     // Example: only import needed functions to shrink bundles
  //     lodash: {
  //       transform: "lodash/{{member}}",
  //     },
  //     "date-fns": {
  //       transform: "date-fns/{{member}}",
  //     },
  //   },
  // },

  // webpack: (config, { dev, isServer }) => {
  //   // 🪶 Optional: Replace React with Preact in production client build
  //   if (!dev && !isServer) {
  //     Object.assign(config.resolve.alias, {
  //       react: "preact/compat",
  //       "react-dom/test-utils": "preact/test-utils",
  //       "react-dom": "preact/compat",
  //     });
  //   }
  //   return config;
  // },
});
