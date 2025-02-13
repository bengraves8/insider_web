/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'app.stakd.co',
      }
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /node_modules\/undici\/lib\/.*\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    });
    return config;
  }
};

module.exports = nextConfig;