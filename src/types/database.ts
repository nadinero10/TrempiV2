export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  language: string;
  created_at: string;
}

export type EventVisibility = "public" | "private";

export interface Event {
  id: string;
  event_code: string;
  visibility: EventVisibility;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  organizer_id: string;
  created_at: string;
}

export type TransportationType =
  | "private_car"
  | "shared_taxi"
  | "bus"
  | "shuttle"
  | "other";

export type TransportationStatus =
  | "active"
  | "full"
  | "completed"
  | "cancelled";

export interface Transportation {
  id: string;
  event_id: string;
  user_id: string;
  transportation_type: TransportationType;
  status: TransportationStatus;
  from_city: string;
  pickup_point: string | null;
  available_seats: number;
  total_seats: number;
  price: number | null;
  notes: string | null;
  driver_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  departure_time: string | null;
  return_time: string | null;
  bus_company: string | null;
  pickup_area: string | null;
  destination: string | null;
  frequency: string | null;
  created_at: string;
}

export interface TransportationStop {
  id: string;
  transportation_id: string;
  stop_name: string;
  city: string;
  location: string | null;
  stop_time: string | null;
  order_index: number;
}

export type TransportationRequestStatus = "pending" | "matched" | "cancelled";

export interface TransportationRequest {
  id: string;
  event_id: string;
  user_id: string;
  from_city: string;
  pickup_point: string | null;
  preferred_time: string | null;
  passengers: number;
  contact: string | null;
  notes: string | null;
  status: TransportationRequestStatus;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile };
      events: { Row: Event };
      transportations: { Row: Transportation };
      transportation_stops: { Row: TransportationStop };
      transportation_requests: { Row: TransportationRequest };
      notifications: { Row: Notification };
    };
  };
}
