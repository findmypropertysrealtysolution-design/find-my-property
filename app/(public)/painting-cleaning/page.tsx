import type { Metadata } from "next";
import PaintingCleaningPage from "@/modules/services/PaintingCleaningPage";
import { SITE_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Painting & Cleaning",
  description: `Book painting, deep cleaning, sofa & kitchen cleaning with ${SITE_NAME}. Vetted crews, eco-safe materials, and a satisfaction guarantee.`,
  openGraph: {
    title: `Painting & Cleaning | ${SITE_NAME}`,
    description: `Request painting or cleaning services from ${SITE_NAME}. Professional, insured, and on-time.`,
    type: "website",
  },
  alternates: {
    canonical: "/painting-cleaning",
  },
};

export default function Page() {
  return <PaintingCleaningPage />;
}
