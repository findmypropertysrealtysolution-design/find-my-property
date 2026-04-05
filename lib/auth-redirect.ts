import type { User } from "@/contexts/auth-context";

export function getPostAuthRoute(user: User | null) {
  if (!user) return "/login";
  if (!user.onboardingCompleted) return "/onboarding";
  return "/dashboard";
}
