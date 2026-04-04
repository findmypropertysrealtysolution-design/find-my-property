"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type LeadStatus } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export function useLeads() {
  const { user, isAuthReady } = useAuth();
  return useQuery({
    queryKey: ["leads", "me"],
    queryFn: api.getMyLeads,
    enabled: isAuthReady && user?.role === "agent",
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: LeadStatus }) => api.updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", "me"] });
      toast({ title: "Lead updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Could not update lead",
        variant: "destructive",
      });
    },
  });
}

export function useCreateLead() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: api.createLead,
    onSuccess: () => {
      toast({
        title: "Enquiry sent",
        description: "The listing agent will get your details and can reach out soon.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not send enquiry",
        description: error.message || "Try again later.",
        variant: "destructive",
      });
    },
  });
}
