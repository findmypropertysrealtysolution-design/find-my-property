import { Skeleton } from "@/components/ui/skeleton";

/** Instant fallback for Next.js `loading.tsx` route segments (streaming shell). */
export function RouteLoadingShell() {
  return (
    <div className="min-h-[50vh] w-full p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-[280px] w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
