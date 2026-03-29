import { RequireAuth } from "@/components/auth/route-guards";
import Onboarding from "@/views/Onboarding";

export default function OnboardingPage() {
  return (
    <RequireAuth>
      <Onboarding />
    </RequireAuth>
  );
}
