/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de produção
  output: 'standalone',
  
  // Experimental features
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Configurações de imagem
  images: {
    domains: [
      'localhost',
      'api.telegrambotmanager.com',
      'telegram.org',
      'core.telegram.org'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  
  // Rewrites para API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
      }
    ]
  },
  
  // Webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Otimizações para bundle
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        reactflow: {
          test: /[\\/]node_modules[\\/](reactflow|@reactflow)[\\/]/,
          name: 'reactflow',
          chunks: 'all',
        },
      },
    }
    
    // Aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    }
    
    return config
  },
  
  // Configurações de ambiente
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Configurações de PWA (se necessário)
  ...(process.env.NODE_ENV === 'production' && {
    generateBuildId: async () => {
      return `build-${Date.now()}`
    }
  }),
}

module.exports = nextConfig