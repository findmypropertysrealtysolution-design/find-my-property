import { Property } from "@/components/property/PropertyCard";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/branding";
import { absoluteUrl, getSiteUrl, toAbsoluteImageUrl } from "@/lib/seo/site";

export function buildOrganizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    email: SUPPORT_EMAIL,
  };
}

export function buildWebSiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/browse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBrowseCollectionJsonLd() {
  const url = absoluteUrl("/browse");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Browse listings | ${SITE_NAME}`,
    description:
      "Search verified homes and commercial spaces for rent or sale across India. Filter by city, budget, BHK, and more.",
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
  };
}

export function buildRealEstateListingJsonLd(row?: Property, pathname?: string) {
  const url = absoluteUrl(pathname ?? "");
  if (!row) return null;
  const images = (row.images?.filter(Boolean) ?? [])
    .slice(0, 8)
    .map((u) => toAbsoluteImageUrl(u))
    .filter((x): x is string => Boolean(x));
  const primary = toAbsoluteImageUrl(row.image) ?? images[0];

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: row.title,
    description: row.description ?? undefined,
    url,
    image: images.length ? images : primary ? [primary] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: row.location,
      addressLocality: row.locality,
      addressRegion: row.city,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: String(row.price ?? 0),
      priceCurrency: row.currency || "INR",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}
