import { Skeleton } from "@/components/ui/skeleton";

/** Matches `PropertyCard` layout: image + title/price/meta lines. */
export function PropertyCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-4/3 w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-5 w-1/2" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
