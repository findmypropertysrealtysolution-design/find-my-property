import type { Metadata } from "next";
import Home from "@/modules/public/Index";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonld";
import { SITE_NAME } from "@/lib/branding";
import { absoluteUrl } from "@/lib/seo/site";

/** Marketing hero — stable absolute URL for Open Graph (matches landing hero asset). */
const HOME_OG_IMAGE =
  "https://framerusercontent.com/images/oSCsz14veQXmjGyGMAQAK0BUUA.png?width=1200&height=630";

const HOME_TITLE = `${SITE_NAME} — Verified rentals & home sales in India`;
const HOME_DESCRIPTION =
  "Search verified flats, houses, and villas for rent or sale. Filter by city, budget, and BHK — message owners directly without broker fees.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    url: absoluteUrl("/"),
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: HOME_OG_IMAGE, width: 1200, height: 630, alt: "Browse homes on Find My Property" }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [HOME_OG_IMAGE],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
      <Home />
    </>
  );
}
