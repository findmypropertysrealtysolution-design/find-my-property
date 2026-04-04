import { z } from "zod";
import type { BackendProperty } from "@/lib/property-mapper";

const propertyTypeOptions = ["Apartment", "House", "Villa", "Townhome"] as const;
const listingTypeOptions = ["Rent", "Sale", "Lease"] as const;

type PropertyTypeOption = (typeof propertyTypeOptions)[number];
type ListingTypeOption = (typeof listingTypeOptions)[number];

const isPropertyTypeOption = (value: string): value is PropertyTypeOption =>
  propertyTypeOptions.includes(value as PropertyTypeOption);

const isListingTypeOption = (value: string): value is ListingTypeOption =>
  listingTypeOptions.includes(value as ListingTypeOption);

export const propertyFormSchema = z.object({
  propertyType: z.enum(propertyTypeOptions, {
    required_error: "Please select a property type.",
  }),
  listingType: z.enum(listingTypeOptions, {
    required_error: "Please select a listing type.",
  }),
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title is too long."),
  
  bedrooms: z.string().min(1, "Please select number of bedrooms."),
  bathrooms: z.string().min(1, "Please select number of bathrooms."),
  area: z.string().min(1, "Area is required."),
  yearBuilt: z.coerce.number().min(1900, "Year must be 1900 or later.").max(new Date().getFullYear() + 5, "Year cannot be too far in the future."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  
  address: z.string().min(5, "Address must be at least 5 characters."),
  locality: z.string().min(2, "Locality is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().optional(),
  country: z.string().min(2, "Country is required."),
  
  description: z.string().optional(),
  
  amenities: z.array(z.string()).default([]),
  
  videoUrl: z.string().optional(),
  
  propertyImages: z.array(z.string()).default([]),
  thumbnailUrl: z.string().optional(),
  
  floorPlans: z.array(
    z.object({
      id: z.string(),
      floorName: z.string(),
      customName: z.string().optional(),
      imageUrl: z.string().min(1, "Floor plan image is required if added."),
    })
  ).default([]),

  /** Set by admins only in the UI; optional on create/update */
  assignedAgentId: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export const getDefaultValues = (initialData?: BackendProperty): Partial<PropertyFormValues> => {
  const propertyType =
    initialData?.propertyType && isPropertyTypeOption(initialData.propertyType)
      ? initialData.propertyType
      : "Apartment";
  const listingType =
    initialData?.listingType && isListingTypeOption(initialData.listingType)
      ? initialData.listingType
      : "Rent";

  return {
    propertyType,
    listingType,
    title: initialData?.title || "",
    bedrooms: initialData?.bedrooms ? String(initialData.bedrooms) : (initialData?.rooms ? String(initialData.rooms) : ""),
    bathrooms: initialData?.bathrooms ? String(initialData.bathrooms) : "",
    area: initialData?.area ? String(Math.round(initialData.area * 10.7639)) : (initialData?.areaSquareMeters ? String(Math.round(initialData.areaSquareMeters * 10.7639)) : ""),
    yearBuilt: initialData?.yearBuilt || new Date().getFullYear(),
    price: initialData?.price || 0,
    address: initialData?.address || "",
    locality: initialData?.locality || "",
    city: initialData?.city || "",
    state: "", // missing from BackendProperty natively but can be derived
    country: initialData?.country || "India",
    description: initialData?.description || "",
    amenities: initialData?.amenities || [],
    videoUrl: initialData?.videoUrl || "", 
    propertyImages: initialData?.propertyImages || initialData?.imageUrls || [],
    thumbnailUrl: initialData?.thumbnailUrl || initialData?.propertyImages?.[0] || initialData?.imageUrls?.[0] || "",
    floorPlans: initialData?.floorPlans 
      ? (Array.isArray(initialData.floorPlans) && initialData.floorPlans.length > 0 
          ? initialData.floorPlans.map((fp: Record<string, string>, idx: number) => ({
              id: fp.id || String(idx + 1),
              floorName: fp.floorName || "ground",
              customName: fp.customName || "",
              imageUrl: fp.imageUrl || ""
            }))
          : [{ id: "1", floorName: "ground", customName: "", imageUrl: typeof initialData.floorPlans === "string" ? initialData.floorPlans : "" }])
      : [{ id: "1", floorName: "ground", customName: "", imageUrl: "" }],
      assignedAgentId:
      initialData?.assignedAgentId != null && initialData.assignedAgentId > 0
        ? String(initialData.assignedAgentId)
        : "",
  };
};
