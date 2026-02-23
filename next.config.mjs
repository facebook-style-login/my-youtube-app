/** @type {import('next').NextConfig} */
const nextConfig = {
    // Your existing config here

    // This is a workaround for a known issue with the new `lucide-react` versions.
    // It ensures that the package is correctly processed by Next.js.
    experimental: {
        serverComponentsExternalPackages: ['@google/generative-ai'],
    },
};

export default nextConfig;
