import { NextConfig } from 'next';
import { env } from './lib/env';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable API routes in app directory (default in Next.js 14)
};

// Validate environment variables at build/start time
try {
  env;
} catch (error: unknown) {
  console.error('❌ Environment validation failed:', error instanceof Error ? error.message : String(error));
  throw error;
}

export default nextConfig;