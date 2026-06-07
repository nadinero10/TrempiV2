import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import type { Transportation, TransportationRequest } from "@/types/database";

export function useMyTransportations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transport", "my", user?.id],
    queryFn: async (): Promise<Transportation[]> => {
      const { data, error } = await supabase
        .from("transportations")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useMyRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transport", "requests", "my", user?.id],
    queryFn: async (): Promise<TransportationRequest[]> => {
      const { data, error } = await supabase
        .from("transportation_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
