import PropertyDetail from "@/modules/properties/PropertyDetail";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePropertyPageMetadata } from "@/lib/seo/generate-property-metadata";
import { getBackendPropertyForSeo } from "@/lib/seo/property-for-seo";
import { buildRealEstateListingJsonLd } from "@/lib/seo/jsonld";
import { parsePropertyIdFromSlugParam } from "@/lib/property-slug";
import { getCachedPropertyById } from "@/lib/server/cached-properties";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generatePropertyPageMetadata(slug);
}

export default async function PropertyBySlugPage({ params }: Props) {
  const { slug } = await params;
  const id = parsePropertyIdFromSlugParam(slug);
  const row = await getCachedPropertyById(id!);
  const path = `/property/${slug}`;

  return (
    <>
      {row ? <JsonLd data={buildRealEstateListingJsonLd(row, path)} /> : null}
      <PropertyDetail />
    </>
  );
}
