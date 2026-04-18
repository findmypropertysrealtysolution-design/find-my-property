"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ClearSystemLogsInput,
  SystemLogsQuery,
} from "@/end-points/system-logs";

export function useSystemLogs(query?: SystemLogsQuery) {
  return useQuery({
    queryKey: ["system-logs", query ?? null],
    queryFn: () => api.getSystemLogs(query),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useClearSystemLogs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ClearSystemLogsInput = {}) => api.clearSystemLogs(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["system-logs"] });
    },
  });
}
