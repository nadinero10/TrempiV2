export const APP_NAME = "Trempi";

export const DEFAULT_LANGUAGE = "en";

export const LANGUAGES = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
] as const;

export const TRANSPORTATION_TYPES = [
  { value: "private_car", label: "Private Car" },
  { value: "shared_taxi", label: "Shared Taxi" },
  { value: "bus", label: "Bus" },
  { value: "shuttle", label: "Shuttle" },
  { value: "other", label: "Other" },
] as const;

export const RIDE_STATUSES = [
  { value: "active", label: "Active" },
  { value: "full", label: "Full" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const EVENT_VISIBILITIES = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
] as const;
