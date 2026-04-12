import type { Metadata } from "next";
import AboutPage from "@/modules/public/AboutPage";
import { SITE_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE_NAME} — verified listings, direct contact, and a product built for renters, owners, and agents.`,
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description: `Learn about ${SITE_NAME} and how we approach property search.`,
  },
};

export default function Page() {
  return <AboutPage />;
}
