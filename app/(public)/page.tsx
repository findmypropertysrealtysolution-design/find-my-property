import type { Metadata } from "next";
import Home from "@/modules/public/Index";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonld";
import { getBranding } from "@/lib/branding/server";
import { absoluteUrl } from "@/lib/seo/site";

/** Marketing hero — stable absolute URL for Open Graph (matches landing hero asset). */
const HOME_OG_IMAGE =
  "https://framerusercontent.com/images/oSCsz14veQXmjGyGMAQAK0BUUA.png?width=1200&height=630";

const HOME_DESCRIPTION =
  "Search verified flats, houses, and villas for rent or sale. Filter by city, budget, and BHK — message owners directly without broker fees.";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getBranding();
  const homeTitle = `${siteName} — Verified rentals & home sales in India`;
  return {
    title: { absolute: homeTitle },
    description: HOME_DESCRIPTION,
    alternates: { canonical: "/" },
    openGraph: {
      url: absoluteUrl("/"),
      title: homeTitle,
      description: HOME_DESCRIPTION,
      images: [
        { url: HOME_OG_IMAGE, width: 1200, height: 630, alt: `Browse homes on ${siteName}` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description: HOME_DESCRIPTION,
      images: [HOME_OG_IMAGE],
    },
  };
}

export default async function Page() {
  const [org, web, { siteName }] = await Promise.all([
    buildOrganizationJsonLd(),
    buildWebSiteJsonLd(),
    getBranding(),
  ]);
  return (
    <>
      <JsonLd data={[org, web]} />
      <Home siteName={siteName} />
    </>
  );
}
