import type { Property, FurnishingStatus } from "@/components/property/PropertyCard";

export enum ListingType {
  RENT = 'Rent',
  SALE = 'Sale',
  LEASE = 'Lease',
}

export enum PropertyType {
  HOUSE = 'House',
  APARTMENT = 'Apartment',
  VILLA = 'Villa',
  TOWNHOME = 'Townhome',
}

export enum PropertyStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface BackendProperty {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  listingType: ListingType | string;
  propertyType: PropertyType | string;
  address: string;
  locality?: string;
  city: string;
  country?: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms: number;
  areaSquareMeters?: number;
  area?: number;
  yearBuilt: number;
  amenities: string[];
  imageUrls?: string[];
  propertyImages?: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  floorPlans?: Array<{ id?: string; floorName?: string; customName?: string; imageUrl: string }> | string;
  status?: PropertyStatus;
  /** Assigned listing agent (user id), when set by admin or API */
  assignedAgentId?: number;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

export function mapBackendProperty(property: BackendProperty): Property {
  // Normalize listingType to Rent or Sale
  const isRent = property.listingType?.toLowerCase() === "rent" || property.listingType?.toLowerCase() === "lease";
  
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: property.currency || "INR",
    maximumFractionDigits: 0,
  }).format(Number(property.price) || 0);

  // Convert sq meters to sq ft if area is not provided directly
  const areaValue = property.area || property.areaSquareMeters || 0;
  const areaSqFt = Math.round((Number(areaValue) || 0) * 10.7639);

  const images = property.propertyImages?.length 
    ? property.propertyImages 
    : (property.imageUrls?.length ? property.imageUrls : [PLACEHOLDER_IMAGE]);

  return {
    id: String(property.id),
    title: property.title || "Untitled Property",
    location: [property.address, property.locality, property.city].filter(Boolean).join(", "),
    price: formattedPrice,
    priceLabel: isRent ? "/month" : "",
    priceValue: Number(property.price) || 0,
    type: isRent ? "rent" : "buy",
    bedrooms: Number(property.bedrooms || property.rooms) || 0,
    bathrooms: Number(property.bathrooms) || 0,
    area: `${areaSqFt.toLocaleString("en-IN")} sq.ft`,
    image: property.thumbnailUrl || images[0],
    images,
    isVerified: property.status === PropertyStatus.APPROVED,
    furnishing: "unfurnished" as Extract<FurnishingStatus, "unfurnished">,
    ownerName: "Owner",
    status: property.status,
  };
}
