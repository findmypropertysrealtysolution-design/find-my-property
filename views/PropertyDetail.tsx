"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { sampleProperties } from "@/data/properties";
import { useProperties, useProperty } from "@/hooks/use-properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, ArrowLeft, Phone, User, Heart, Play, Plus, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";
import { SITE_NAME } from "@/lib/branding";

const PropertyDetail = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: properties } = useProperties();
  const { data: propertyData, isLoading } = useProperty(id);
  const allProperties = properties?.length ? properties : sampleProperties;
  const property = propertyData || allProperties.find((p) => p.id === id);
  const [activeFloor, setActiveFloor] = useState("Ground");
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const notFoundContent = (
    <div className="pt-12 md:pt-16 pb-20 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
      <Link href="/properties">
        <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties</Button>
      </Link>
    </div>
  );

  if (isLoading && !property) {
    return (
      <div className="pt-6 pb-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Loading property...</h1>
      </div>
    );
  }

  if (!property) {
    return <div className="pt-6 pb-20 text-center">{notFoundContent}</div>;
  }

  const images = property.images || [property.image];
  const similarProperties = allProperties.filter((p) => p.id !== id).slice(0, 4);

  const amenities = ["Garden", "Solar Panels", "Tennis Court", "Swimming Pool", "Fireplace", "Outdoor Kitchen"];
  const floors = ["Ground", "First", "Second"];

  const mainContent = (
    <div className="pt-6 pb-20">
        {/* Hero Image - Large, wide aspect ratio with gallery & actions */}
        <div className="relative w-full">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
            <img
              src={images[mainImageIndex] ?? images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Back button */}
            <Link
              href="/properties"
              className="absolute top-6 left-6 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors z-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* Thumbnail strip top-right - clickable */}
            {images.length > 1 && (
              <div className="absolute top-6 right-6 flex gap-2 z-10">
                {images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMainImageIndex(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      mainImageIndex === i ? "border-white ring-2 ring-white/50" : "border-white/40 hover:border-white/60"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title, price & address overlay bottom-left */}
            <div className="absolute bottom-6 left-6 right-24 z-10 min-w-0">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-white drop-shadow-sm break-words">
                {property.title} · <span>{property.price}</span>
              </h1>
              <p className="flex items-center gap-1.5 text-white/90 mt-1 text-sm md:text-base break-words min-w-0">
                <MapPin className="w-4 h-4 shrink-0" /> <span className="min-w-0">{property.location}</span>
              </p>
            </div>

            {/* Action buttons bottom-right: play (video/slideshow) + favorite */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-10">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-colors"
                title="Video tour / Slideshow"
              >
                <Play className="w-5 h-5 ml-0.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsFavorited((f) => !f)}
                className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                  isFavorited ? "bg-primary text-primary-foreground" : "bg-white/90 text-foreground hover:bg-white"
                }`}
                title="Favorite"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Details Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {[
                  { icon: Bed, value: `${property.bedrooms}`, label: "Room" },
                  { icon: Bath, value: `${property.bathrooms}+`, label: "Bathrooms" },
                  { icon: Square, value: property.area, label: "Area" },
                  { icon: Calendar, value: "2012", label: "Year Built" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-heading font-semibold text-foreground text-sm">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-heading font-semibold text-foreground text-base mb-3">Description</h2>
                <p className="text-muted-foreground text-sm leading-relaxed wrap-break-word">
                  If serene living is what you&apos;re after, this property is a must-see! This beautiful {property.bedrooms} BHK property is located in the heart of {property.location.split(",")[0]}.
                  The property is {property.furnishing} and spans {property.area}. It features {property.bathrooms} bathroom{property.bathrooms > 1 ? "s" : ""} and
                  is perfect for families or professionals looking for a comfortable living space.
                  The locality offers excellent connectivity, nearby schools, hospitals, and shopping centers.
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="rounded-full text-xs font-normal px-3 py-1">
                    {property.type === "rent" ? "Rent" : "Buy"}
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-xs font-normal px-3 py-1">
                    House
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-xs font-normal px-3 py-1">
                    {property.location.split(",")[0]}
                  </Badge>
                </div>
              </motion.div>

              {/* Amenities & Features */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-heading font-semibold text-foreground text-base mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floor Plans */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-heading font-semibold text-foreground text-base mb-3">Floor Plans</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Living Spaces are more easily interpreted. All-In-Ones color floor plan option clearly defines your listing&apos;s living spaces, making them obvious and clearly visible to your potential buyers/clients.
                </p>
                <div className="flex gap-2 mb-4">
                  {floors.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setActiveFloor(floor)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        activeFloor === floor
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-primary/10">
                  <img
                    src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80"
                    alt={`${activeFloor} floor plan`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Video */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-heading font-semibold text-foreground text-base mb-3">Video</h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-muted relative">
                  <img
                    src={images[0]}
                    alt="Property video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[20px] border-l-foreground border-y-[12px] border-y-transparent ml-1.5" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-heading font-semibold text-foreground text-base mb-3">Location</h2>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                  {process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ? (
                    <iframe
                      title="Property location"
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&q=${encodeURIComponent(property.location)}`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> View on Google Maps
                      </span>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Agent Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                {/* Owner Info */}
                <div className="flex items-center gap-3 mb-6 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-foreground text-sm wrap-break-word">
                      {property.ownerName || "Property Owner"}
                    </p>
                    <p className="text-xs text-muted-foreground wrap-break-word">Listed by owner · {SITE_NAME}</p>
                    
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Listed on Mar 2025 · Ref #{property.id}
                </p>

                <div className="border-t border-border pt-4 flex gap-2">
                  <Button className="flex-1 gap-2" size="lg">
                    <Phone className="w-4 h-4" /> Contact Owner
                  </Button>
                  <Button variant="outline" size="lg" className="px-3">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Similar Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold text-foreground text-xl">Similar Listings</h2>
              <Link href="/properties" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                See all listing
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
    </div>
  );

  return mainContent;
};

export default PropertyDetail;
