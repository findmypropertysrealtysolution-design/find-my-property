"use client";

import { useMemo, useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/auth-context";

import { propertyFormSchema, getDefaultValues, type PropertyFormValues } from "./add-property-modules/schema";
import { BasicInformation } from "./add-property-modules/BasicInformation";
import { PropertyOverview } from "./add-property-modules/PropertyOverview";
import { LocationSection } from "./add-property-modules/LocationSection";
import { DescriptionFields, AmenitiesFields } from "./add-property-modules/DescriptionAmenities";
import { PropertyImagesSection } from "./add-property-modules/PropertyImagesSection";
import { VideoSection } from "./add-property-modules/VideoSection";
import { FloorPlansSection } from "./add-property-modules/FloorPlansSection";
import { AdminAgentAssignment } from "./add-property-modules/AdminAgentAssignment";

const BASE_SECTIONS = [
  "basic",
  "overview",
  "location",
  "description",
  "amenities",
  "images",
  "video",
  "floorplans",
] as const;

const AddProperty = ({ initialData }: { initialData?: BackendProperty }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role === "admin";

  const defaultOpenSections = useMemo(() => {
    const s = [...BASE_SECTIONS];
    if (isAdmin) s.push("basic", "description");
    return s;
  }, [isAdmin]);

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
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    try {
      const payload: Record<string, unknown> = {
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

      if (isAdmin) {
          const aid = Number(data.assignedAgentId);
        if (Number.isFinite(aid) && aid > 0) {
          payload.assignedAgentId = aid;
        }
      }

      if (initialData?.id) {
        await api.updateProperty(String(initialData.id), payload);
        toast({ title: "Property updated", description: "Your listing has been updated successfully." });
      } else {
        await api.createProperty(payload);
        toast({ title: "Property submitted", description: "Your listing has been created successfully." });
      }

      router.push(`/${user?.role}/listings`);
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

  const triggerClass =
    "px-6 py-4 text-left font-heading font-semibold text-base text-foreground hover:no-underline [&[data-state=open]]:bg-muted/40";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenant/listings">
            <ArrowLeft className="h-4 w-4" />
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
          <Accordion
            type="multiple"
            defaultValue={defaultOpenSections}
            className="w-full rounded-xl border border-border bg-card shadow-sm"
          >
            <AccordionItem value="basic" className="border-b border-border last:border-b-0">
              <AccordionTrigger className={triggerClass}>Basic Information</AccordionTrigger>
              <AccordionContent className="px-6">
                <BasicInformation />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="overview" className="border-b border-border last:border-b-0">
              <AccordionTrigger className={triggerClass}>Property Overview</AccordionTrigger>
              <AccordionContent className="px-6">
                <PropertyOverview />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="location" className="border-b border-border last:border-b-0">
              <AccordionTrigger className={triggerClass}>Location</AccordionTrigger>
              <AccordionContent className="px-6">
                <LocationSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="description" className="border-b border-border last:border-b-0">
              <AccordionTrigger className={triggerClass}>Description</AccordionTrigger>
              <AccordionContent className="px-6">
                <DescriptionFields />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="amenities" className="border-b border-border last:border-b-0">
              <AccordionTrigger className={triggerClass}>Amenities &amp; Features</AccordionTrigger>
              <AccordionContent className="px-6">
                <AmenitiesFields />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="images" className="border-b border-border last:border-b-0">
              <AccordionTrigger className={triggerClass}>Property Images</AccordionTrigger>
              <AccordionContent className="px-6">
                <PropertyImagesSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="video" className="border-b border-border last:border-b-0">
              <AccordionTrigger className={triggerClass}>Video</AccordionTrigger>
              <AccordionContent className="px-6">
                <VideoSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="floorplans" className="border-b border-border last:border-b-0">
              <AccordionTrigger className={triggerClass}>Floor Plans</AccordionTrigger>
              <AccordionContent className="px-6">
                <FloorPlansSection />
              </AccordionContent>
            </AccordionItem>

            {isAdmin && (
              <AccordionItem value="admin-agent" className="border-b border-border last:border-b-0 border-t-2 border-primary/20">
                <AccordionTrigger className={triggerClass}>
                  Listing agent <span className="ml-2 text-xs font-normal text-primary">(admin only)</span>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  <AdminAgentAssignment />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          <div className="flex gap-3">
            <Button type="submit" size="lg" className="flex-1" disabled={loading}>
              <Upload className="mr-2 h-4 w-4" /> {loading ? "Saving…" : initialData ? "Save Changes" : "Create Property"}
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
