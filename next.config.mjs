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
}

export default nextConfig
