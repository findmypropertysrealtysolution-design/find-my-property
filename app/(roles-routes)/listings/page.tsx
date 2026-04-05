"use client";

import { useAuth } from "@/contexts/auth-context";
import TenantListings from "@/modules/tenant/TenantListings";
import AgentListings from "@/modules/agent/AgentListings";

export default function ListingsPage() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) return null;

  if (user?.role === "agent") return <AgentListings />;
  if (user?.role === "admin" || user?.role === "tenant") return <TenantListings />;
  return null;
}
