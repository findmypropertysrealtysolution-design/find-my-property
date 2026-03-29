"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { api } from "@/lib/api";
import type { BackendProperty } from "@/lib/property-mapper";
import { Form } from "@/components/ui/form";

import { propertyFormSchema, getDefaultValues, type PropertyFormValues } from "./add-property-modules/schema";
import { BasicInformation } from "./add-property-modules/BasicInformation";
import { PropertyOverview } from "./add-property-modules/PropertyOverview";
import { LocationSection } from "./add-property-modules/LocationSection";
import { DescriptionAmenities } from "./add-property-modules/DescriptionAmenities";
import { PropertyImagesSection } from "./add-property-modules/PropertyImagesSection";
import { VideoSection } from "./add-property-modules/VideoSection";
import { FloorPlansSection } from "./add-property-modules/FloorPlansSection";

const AddProperty = ({ initialData }: { initialData?: BackendProperty }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const onSubmit = async (data: PropertyFormValues) => {
    setLoading(true);

    const allImageUrls = [...data.propertyImages];
    const validFloorPlans = data.floorPlans.filter((fp) => {
      const url = fp.imageUrl.trim();
      if (!url) return false;
      try { new URL(url); return true; } catch { return false; }
    });

    try {
      const payload = {
        title: data.title.trim(),
        description: data.description?.trim() || "Property listed via tenant dashboard",
        price: data.price,
        currency: "INR",
        listingType: data.listingType,
        propertyType: data.propertyType,
        address: data.address.trim(),
        locality: data.locality?.trim() || data.city.trim(),
        city: data.city.trim(),
        state: data.state?.trim(),
        country: data.country?.trim() || "India",
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        area: Number((Number(data.area) / 10.7639).toFixed(2)),
        yearBuilt: data.yearBuilt,
        amenities: data.amenities,
        propertyImages: allImageUrls,
        thumbnailUrl: data.thumbnailUrl || allImageUrls[0] || "",
        videoUrl: data.videoUrl,
        floorPlans: validFloorPlans,
      };

      if (initialData?.id) {
        await api.updateProperty(String(initialData.id), payload);
        toast({ title: "Property updated", description: "Your listing has been updated successfully." });
      } else {
        await api.createProperty(payload);
        toast({ title: "Property submitted", description: "Your listing has been created successfully." });
      }
      
      router.push("/tenant/listings");
    } catch (error) {
      toast({
        title: "Unable to save property",
        description: error instanceof Error ? error.message : "Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenant/listings">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            {initialData ? "Edit Property" : "Add Property"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {initialData ? "Update your property listing details" : "Create a new property listing"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <BasicInformation />
          <PropertyOverview />
          <LocationSection />
          <DescriptionAmenities />
          <PropertyImagesSection />
          <VideoSection />
          <FloorPlansSection />

          <div className="flex gap-3">
            <Button type="submit" size="lg" className="flex-1" disabled={loading}>
              <Upload className="w-4 h-4 mr-2" /> {loading ? "Saving…" : initialData ? "Save Changes" : "Create Property"}
            </Button>
            <Button type="button" variant="outline" size="lg" asChild>
              <Link href="/tenant/listings">Cancel</Link>
            </Button>
          </div>
        </motion.form>
      </Form>
    </div>
  );
};

export default AddProperty;
