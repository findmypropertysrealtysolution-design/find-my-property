import { RequireAuth } from "@/components/auth/route-guards";
import PropertyDetail from "@/views/PropertyDetail";

export default function PropertyPage() {
  return (
    <RequireAuth>
      <PropertyDetail />
    </RequireAuth>
  );
}
