import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransportationsByEvent,
  createTransportation,
  deleteTransportation,
  getRequestsByEvent,
  createRequest,
  getMatchingTransportation,
} from "@/services/transport";
import type { CreateTransportInput, CreateRequestInput } from "@/services/transport";

export function useEventTransportation(eventId: string) {
  return useQuery({
    queryKey: ["transport", eventId],
    queryFn: () => getTransportationsByEvent(eventId),
    enabled: !!eventId,
  });
}

export function useCreateTransportation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransportInput) => createTransportation(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transport", variables.event_id],
      });
    },
  });
}

export function useDeleteTransportation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; eventId: string }) =>
      deleteTransportation(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transport", variables.eventId],
      });
    },
  });
}

export function useEventRequests(eventId: string) {
  return useQuery({
    queryKey: ["transport", "requests", eventId],
    queryFn: () => getRequestsByEvent(eventId),
    enabled: !!eventId,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRequestInput) => createRequest(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transport", "requests", variables.event_id],
      });
    },
  });
}

export function useMatchingTransport(eventId: string, fromCity: string) {
  return useQuery({
    queryKey: ["transport", "matching", eventId, fromCity],
    queryFn: () => getMatchingTransportation(eventId, fromCity),
    enabled: !!eventId && !!fromCity,
  });
}
