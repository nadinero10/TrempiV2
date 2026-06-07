import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRealtimeSubscription } from "@/hooks/useRealtime";

export function useEventRealtime(eventId: string) {
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["transport", eventId] });
    queryClient.invalidateQueries({ queryKey: ["transport", "requests", eventId] });
  }, [queryClient, eventId]);

  useRealtimeSubscription(
    "transportations",
    eventId ? `event_id=eq.${eventId}` : undefined,
    invalidate,
  );

  useRealtimeSubscription(
    "transportation_requests",
    eventId ? `event_id=eq.${eventId}` : undefined,
    invalidate,
  );
}
