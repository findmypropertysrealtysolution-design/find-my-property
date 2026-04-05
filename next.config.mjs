/** @type {import('next').NextConfig} */
const nextConfig = {
    /** Enables `"use cache"`, `cacheTag`, `cacheLife`, and tag invalidation via `revalidateTag`. */
    cacheComponents: true,
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "187.127.133.141",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
        ],
    },

    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
            },
        ];
    },
}

export default nextConfig
