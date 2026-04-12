import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shown when slug is invalid or property is missing from API/cache. */
export function PropertyDetailNotFound() {
  return (
    <div className="pt-12 pb-20 text-center md:pt-16">
      <h1 className="mb-4 font-heading text-2xl font-bold text-foreground">Property Not Found</h1>
      <Link href="/browse">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
        </Button>
      </Link>
    </div>
  );
}
