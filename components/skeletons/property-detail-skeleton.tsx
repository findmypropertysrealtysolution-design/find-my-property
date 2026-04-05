import { Skeleton } from "@/components/ui/skeleton";
import { PropertyGridSkeleton } from "@/components/skeletons/property-grid-skeleton";

export function PropertyDetailSkeleton() {
  return (
    <div className="pb-20 pt-6">
      <div className="relative w-full">
        <Skeleton className="aspect-[21/9] w-full rounded-none md:rounded-lg" />
      </div>
      <div className="container mx-auto mt-8 max-w-6xl px-4">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4 max-w-xl" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="w-full shrink-0 space-y-3 lg:w-80">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="mt-16">
          <Skeleton className="mb-6 h-7 w-40" />
          <PropertyGridSkeleton columns="featured" count={4} />
        </div>
      </div>
    </div>
  );
}
