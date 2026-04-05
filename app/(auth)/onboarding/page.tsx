import { Suspense } from "react";
import { RequireAuth } from "@/components/auth/route-guards";
import Onboarding from "@/modules/auth/Onboarding";

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <RequireAuth>
        <Onboarding />
      </RequireAuth>
    </Suspense>
  );
}
