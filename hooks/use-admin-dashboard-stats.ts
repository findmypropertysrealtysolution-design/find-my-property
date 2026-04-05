"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: api.getDashboardStats,
    staleTime: 60_000,
  });
}
