/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['huggingface.co', 'replicate.delivery', 'placehold.co'],
  },
}

module.exports = nextConfig 