"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Settings } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useAdminSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["admin-settings"],
    queryFn: api.getSettings,
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin-settings"], updated);
      toast({
        title: "Settings saved",
        description: "Your configuration has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save settings",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
