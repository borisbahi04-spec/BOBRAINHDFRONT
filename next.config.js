/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

// Variables d'env REST API
const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI || 'flash-backend/api/v1'
const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || 3336

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

  // -----------------------
  // Rewrites REST API
  // -----------------------
  async rewrites() {
    return [
      {
        source: `/${backendUri}/:path*`,
        destination: `http://127.0.0.1:${backendPort}/${backendUri}/:path*`, // localhost du backend
      },
      // Pas de rewrite pour WebSocket (Socket.IO gère namespace /ws)
    ]
  },

  // -----------------------
  // Headers (CORS)
  // -----------------------
  async headers() {
    return [
      {
        source: `/${backendUri}/:path*`,
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },

  // -----------------------
  // DevServer Proxy (dev uniquement)
  // -----------------------
  devServer: {
    proxy: {
      '/ws': {
        target: `http://127.0.0.1:${backendPort}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
