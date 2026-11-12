/** @type {import('next').NextConfig} */
const nextConfig = {
  // Content is read from /content at build time; Keystatic edits those files.
  outputFileTracingIncludes: { '/**': ['./content/**/*'] },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
export default nextConfig;
