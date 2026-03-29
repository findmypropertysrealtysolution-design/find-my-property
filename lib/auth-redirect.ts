import type { User } from "@/contexts/AuthContext";

export function getPostAuthRoute(user: User | null) {
  if (!user) return "/login";
  if (!user.onboardingCompleted) return "/onboarding";
  if (user.role === "admin") return "/admin";
  if (user.role === "agent") return "/agent";
  if (user.role === "company") return "/company";
  return "/tenant";
}
