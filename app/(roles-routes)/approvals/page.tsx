import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PropertyApproval from "@/modules/admin/PropertyApproval";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading…
        </div>
      }
    >
      <PropertyApproval />
    </Suspense>
  );
}
