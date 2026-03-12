/** @type {import('next').NextConfig} */
import { env } from './lib/env';

const nextConfig = {
  reactStrictMode: true,
  // Enable API routes in app directory (default in Next.js 14)
};

// Validate environment variables at build/start time
try {
  env;
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  throw error;
}

export default nextConfig;