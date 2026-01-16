/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  // Force dynamic rendering for all pages since we use localStorage
  output: 'standalone',
}

module.exports = nextConfig
