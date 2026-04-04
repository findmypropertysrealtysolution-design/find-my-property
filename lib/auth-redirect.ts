import type { User } from "@/contexts/auth-context";

export function getPostAuthRoute(user: User | null) {
  if (!user) return "/login";
  if (!user.onboardingCompleted) return "/onboarding";
  if (user.role === "admin") return "/admin";
  if (user.role === "agent") return "/agent";
  return "/tenant";
}
