import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPublicEvents,
  getEventByCode,
  getEventsByOrganizer,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
} from "@/services/events";
import type { CreateEventInput } from "@/services/events";
import { useAuth } from "@/providers/AuthProvider";

export function usePublicEvents(limit?: number) {
  return useQuery({
    queryKey: ["events", "public", limit],
    queryFn: () => getPublicEvents(limit),
  });
}

export function useEvent(code: string) {
  return useQuery({
    queryKey: ["events", "code", code],
    queryFn: () => getEventByCode(code),
    enabled: !!code,
  });
}

export function useMyEvents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["events", "organizer", user?.id],
    queryFn: () => getEventsByOrganizer(user!.id),
    enabled: !!user,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventInput) => createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventInput> }) =>
      updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useSearchEvents(
  query: string,
  filters?: { publicOnly?: boolean; date?: string },
) {
  return useQuery({
    queryKey: ["events", "search", query, filters],
    queryFn: () => searchEvents(query, filters),
    enabled: query.length > 0,
  });
}
