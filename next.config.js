/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Add rule for Handlebars
    config.module.rules.push({
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

module.exports = nextConfig; 