"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSystemLogs() {
  return useQuery({
    queryKey: ["system-logs"],
    queryFn: api.getSystemLogs,
    staleTime: 30_000, // Logs are relatively fresh
    refetchInterval: 60_000, // Auto-refresh every minute
  });
}
