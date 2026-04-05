import { PropertyCardSkeleton } from "@/components/skeletons/property-card-skeleton";
import { cn } from "@/lib/utils";

type PropertyGridSkeletonProps = {
  count?: number;
  className?: string;
  /** Match featured section: 4 cols on lg */
  columns?: "featured" | "list";
};

export function PropertyGridSkeleton({
  count = 4,
  className,
  columns = "featured",
}: PropertyGridSkeletonProps) {
  const grid =
    columns === "featured"
      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      : "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={cn(grid, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
