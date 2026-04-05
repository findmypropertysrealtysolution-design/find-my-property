import { Skeleton } from "@/components/ui/skeleton";

export function ListingRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
      <Skeleton className="h-24 w-full shrink-0 rounded-lg sm:w-36" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4 max-w-md" />
        <Skeleton className="h-4 w-1/2 max-w-sm" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="ml-auto h-4 w-24" />
        </div>
      </div>
      <div className="flex gap-2 border-t border-border pt-4 sm:mt-0 sm:flex-col sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
        <Skeleton className="h-8 w-full rounded-md sm:w-20" />
        <Skeleton className="h-8 w-full rounded-md sm:w-20" />
      </div>
    </div>
  );
}

type ListingGridSkeletonProps = { rows?: number };

export function ListingGridSkeleton({ rows = 4 }: ListingGridSkeletonProps) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <ListingRowSkeleton key={i} />
      ))}
    </div>
  );
}
