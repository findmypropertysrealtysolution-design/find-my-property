import type { Metadata } from "next";
import AboutPage from "@/modules/public/AboutPage";
import { getBranding } from "@/lib/branding/server";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getBranding();
  return {
    title: "About",
    description: `Learn about ${siteName} — verified listings, direct contact, and a product built for renters, owners, and agents.`,
    openGraph: {
      title: `About | ${siteName}`,
      description: `Learn about ${siteName} and how we approach property search.`,
    },
  };
}

export default async function Page() {
  const { siteName } = await getBranding();
  return <AboutPage siteName={siteName} />;
}
