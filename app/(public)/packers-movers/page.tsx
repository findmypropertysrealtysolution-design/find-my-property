import type { Metadata } from "next";
import PackersMoversPage from "@/modules/services/PackersMoversPage";
import { SITE_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Packers & Movers",
  description: `Book trusted packers & movers with ${SITE_NAME}. Transparent pricing, verified crews, and on-time moves across the city and beyond.`,
  openGraph: {
    title: `Packers & Movers | ${SITE_NAME}`,
    description: `Request a free moving quote from ${SITE_NAME}. Verified crews, transparent pricing, on-time delivery.`,
    type: "website",
  },
  alternates: {
    canonical: "/packers-movers",
  },
};

export default function Page() {
  return <PackersMoversPage />;
}
