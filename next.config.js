/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI
const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST
const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT
const backendUri2 = process.env.NEXT_PUBLIC_BACKEND_URI2


/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
])

module.exports = withTM({
  trailingSlash: false,
  reactStrictMode: false,
  experimental: {
    esmExternals: true
  },
  eslint: {
    ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
},
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },

  async rewrites() {

    if (!backendHost || !backendPort || !backendUri) {
        throw new Error("NEXT_PUBLIC_BACKEND_* variables not defined",backendUri,backendHost,backendPort)
      }

return [

      {
        basePath: false,
        source: `/${backendUri}/:path*`,
        destination: `${backendHost}:${backendPort}/${backendUri}/:path*`,
      },

      {
        // Redirection WebSocket
        source: '/ws/:path*',
        destination: `${backendHost}:${backendPort}/ws/:path*`,

      },

    ];
  },
  devServer: {
    proxy: {
      '/ws': {
        target: `${backendHost}:${backendPort}`,
        ws: true, // <-- active WebSocket proxy
        changeOrigin: true,
      },
    },
  },
  async headers() {
    return [
      {
        source: `/${backendUri2}/:path*`,
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Change this to allow specific origins
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },


})

