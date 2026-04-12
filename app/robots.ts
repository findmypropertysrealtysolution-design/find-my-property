import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/profile",
        "/settings",
        "/listings",
        "/favorites",
        "/leads",
        "/reports",
        "/analytics",
        "/alerts",
        "/approvals",
        "/agents",
        "/properties",
        "/onboarding",
        "/logout",
        "/add-property",
        "/edit-property",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
