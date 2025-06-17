import withPWA from 'next-pwa';

const nextConfig = {
  // Add more Next.js options here if needed
};

// Export the configuration with PWA support
export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(nextConfig); 


