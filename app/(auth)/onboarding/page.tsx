import { RequireAuth } from "@/components/auth/route-guards";
import Onboarding from "@/modules/auth/Onboarding";

export default function OnboardingPage() {
  return (
    <RequireAuth>
      <Onboarding />
    </RequireAuth>
  );
}
