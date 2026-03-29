import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: api.getProperties,
    staleTime: 60_000,
  });
}

export function useMyProperties() {
  return useQuery({
    queryKey: ["properties", "my"],
    queryFn: api.getMyProperties,
    staleTime: 60_000,
  });
}

export function useProperty(id?: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => api.getProperty(id as string),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}
