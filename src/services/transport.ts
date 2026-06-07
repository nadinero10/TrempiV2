import { supabase } from "@/lib/supabase";
import type {
  Transportation,
  TransportationStop,
  TransportationRequest,
} from "@/types/database";

export type CreateTransportInput = Omit<Transportation, "id" | "created_at">;
export type CreateStopInput = Omit<TransportationStop, "id">;
export type CreateRequestInput = Omit<TransportationRequest, "id" | "created_at">;

export async function getTransportationsByEvent(
  eventId: string,
): Promise<(Transportation & { stops: TransportationStop[] })[]> {
  const { data, error } = await supabase
    .from("transportations")
    .select("*, stops:transportation_stops(*)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as (Transportation & { stops: TransportationStop[] })[];
}

export async function createTransportation(
  data: CreateTransportInput,
): Promise<Transportation> {
  const { data: transport, error } = await supabase
    .from("transportations")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return transport;
}

export async function updateTransportation(
  id: string,
  data: Partial<CreateTransportInput>,
): Promise<Transportation> {
  const { data: transport, error } = await supabase
    .from("transportations")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return transport;
}

export async function deleteTransportation(id: string): Promise<void> {
  const { error } = await supabase
    .from("transportations")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function addStop(
  transportationId: string,
  stop: CreateStopInput,
): Promise<TransportationStop> {
  const { data, error } = await supabase
    .from("transportation_stops")
    .insert({ ...stop, transportation_id: transportationId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeStop(stopId: string): Promise<void> {
  const { error } = await supabase
    .from("transportation_stops")
    .delete()
    .eq("id", stopId);
  if (error) throw error;
}

export async function getRequestsByEvent(
  eventId: string,
): Promise<TransportationRequest[]> {
  const { data, error } = await supabase
    .from("transportation_requests")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createRequest(
  data: CreateRequestInput,
): Promise<TransportationRequest> {
  const { data: request, error } = await supabase
    .from("transportation_requests")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return request;
}

export async function deleteRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from("transportation_requests")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getMatchingTransportation(
  eventId: string,
  fromCity: string,
): Promise<Transportation[]> {
  const { data, error } = await supabase
    .from("transportations")
    .select("*")
    .eq("event_id", eventId)
    .eq("from_city", fromCity)
    .eq("status", "active")
    .gt("available_seats", 0);
  if (error) throw error;
  return data;
}
