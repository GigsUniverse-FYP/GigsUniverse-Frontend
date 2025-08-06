import createPWA from 'next-pwa';
import type { NextConfig } from 'next';

// Create PWA configuration separately
const pwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
};

// Create withPWA enhancer function
const withPWA = createPWA(pwaConfig);

// Define Next.js configuration
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
};

// Apply PWA enhancement
export default withPWA(nextConfig);