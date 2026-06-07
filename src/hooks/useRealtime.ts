import { useEffect } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useRealtimeSubscription(
  table: string,
  filter: string | undefined,
  onEvent: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  useEffect(() => {
    const channelName = `realtime-${table}-${filter ?? "all"}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        onEvent,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, onEvent]);
}
