"use server";

import { revalidateTag } from "next/cache";
import { TAGS } from "@/config/tags";

/** Call after create/update/delete so `use cache` property data refreshes on the next request. */
export async function revalidatePropertyListingCache(propertyId?: string) {
  revalidateTag(TAGS.properties, "max");
  if (propertyId) {
    revalidateTag(TAGS.property(propertyId), "max");
  }
}
