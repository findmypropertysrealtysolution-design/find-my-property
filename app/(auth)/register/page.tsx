import { Suspense } from "react";
import { PublicAuthRoute } from "@/components/auth/route-guards";
import Register from "@/modules/auth/Register";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <PublicAuthRoute>
        <Register />
      </PublicAuthRoute>
    </Suspense>
  );
}
