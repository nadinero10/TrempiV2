import { supabase } from "@/lib/supabase";
import type { Event } from "@/types/database";

export interface CreateEventInput {
  title: string;
  description?: string;
  image_url?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location: string;
  visibility: Event["visibility"];
  organizer_name?: string;
  organizer_contact?: string;
}

export async function getPublicEvents(limit?: number): Promise<Event[]> {
  let query = supabase
    .from("events")
    .select("*")
    .eq("visibility", "public")
    .order("date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getEventByCode(code: string): Promise<Event> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_code", code)
    .single();
  if (error) throw error;
  return data;
}

export async function getEventsByOrganizer(userId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", userId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createEvent(data: CreateEventInput): Promise<Event> {
  const { data: event, error } = await supabase
    .from("events")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return event;
}

export async function updateEvent(
  id: string,
  data: Partial<CreateEventInput>,
): Promise<Event> {
  const { data: event, error } = await supabase
    .from("events")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return event;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export async function searchEvents(
  query: string,
  filters?: { publicOnly?: boolean; date?: string },
): Promise<Event[]> {
  const pattern = `%${query}%`;
  let q = supabase
    .from("events")
    .select("*")
    .or(`title.ilike.${pattern},location.ilike.${pattern}`)
    .order("date", { ascending: false });

  if (filters?.publicOnly) {
    q = q.eq("visibility", "public");
  }
  if (filters?.date) {
    q = q.eq("date", filters.date);
  }

  const { data, error } = await q;
  if (error) throw error;
  return data;
}
