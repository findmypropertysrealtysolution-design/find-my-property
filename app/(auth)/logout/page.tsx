"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function LogoutPage() {
  const { logout, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady) return;
    void (async () => {
      await logout();
      router.replace("/login");
    })();
  }, [isAuthReady, logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Signing out…</p>
    </div>
  );
}
