import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    // Add rule for Handlebars
    config.module?.rules?.push({
      test: /\.js$/,
      include: /node_modules\/handlebars/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    });
    return config;
  },
  // Enable static exports
  output: 'export',
  // Disable image optimization
  images: {
    unoptimized: true
  }
};

export default nextConfig;
