import type { Metadata } from "next";
import Properties from "@/modules/properties/Properties";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBrowseCollectionJsonLd } from "@/lib/seo/jsonld";
import { getBranding } from "@/lib/branding/server";
import { absoluteUrl } from "@/lib/seo/site";

const BROWSE_TITLE = "Browse verified listings";
const BROWSE_DESCRIPTION =
  "Filter homes for rent or sale by city, locality, budget, BHK, furnishing, and more. Switch between map and list views.";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getBranding();
  return {
    title: BROWSE_TITLE,
    description: BROWSE_DESCRIPTION,
    alternates: { canonical: "/browse" },
    openGraph: {
      url: absoluteUrl("/browse"),
      title: `${BROWSE_TITLE} | ${siteName}`,
      description: BROWSE_DESCRIPTION,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${BROWSE_TITLE} | ${siteName}`,
      description: BROWSE_DESCRIPTION,
    },
  };
}

export default async function BrowsePage() {
  const collection = await buildBrowseCollectionJsonLd();
  return (
    <>
      <JsonLd data={collection} />
      <Properties />
    </>
  );
}
