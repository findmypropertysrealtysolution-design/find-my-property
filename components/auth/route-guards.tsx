"use client";

import type { ReactElement, ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getPostAuthRoute, parseSafeReturnPath } from "@/lib/auth-redirect";

export function RequireAuth({ children }: { children: ReactElement }) {
  const { isAuthenticated, isAuthReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isAuthenticated) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const from = `${pathname}${search}${hash}`;
      router.replace(`/login?from=${encodeURIComponent(from)}`);
    }
  }, [isAuthReady, isAuthenticated, pathname, router]);

  if (!isAuthReady) return null;
  if (!isAuthenticated) return null;
  return children;
}

export function RequireCompletedProfile({ children }: { children: ReactElement }) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady) return;
    if (user && !user.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [isAuthReady, user, router]);

  if (!isAuthReady) return null;
  if (user && !user.onboardingCompleted) return null;
  return children;
}

export function PublicAuthRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) return;
    const params = new URLSearchParams(window.location.search);
    const safeFrom = parseSafeReturnPath(params.get("from"));
    router.replace(safeFrom || getPostAuthRoute(user));
  }, [isAuthReady, isAuthenticated, user, router]);

  if (!isAuthReady) return children;
  if (isAuthenticated) return null;
  return children;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthReady, isAuthenticated, pathname, router]);

  if (!isAuthReady) return null;
  if (!isAuthenticated) return null;
  return children;
}
