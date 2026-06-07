-- Trempi V2 - Seed Data
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Step 1: Create a system organizer user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  '0501234567@phone.trempi.app',
  crypt('seed_user_password', gen_salt('bf')),
  now(),
  '{"full_name": "Trempi Demo", "phone": "+972501234567"}'::jsonb,
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Create the profile
INSERT INTO profiles (id, full_name, phone, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Trempi Demo',
  '+972501234567',
  'organizer'
) ON CONFLICT (id) DO NOTHING;

-- Step 3: Create two example events
INSERT INTO events (id, event_code, organizer_id, visibility, title, description, date, start_time, end_time, location, organizer_name, organizer_contact)
VALUES
(
  gen_random_uuid(),
  'TECH2026',
  '00000000-0000-0000-0000-000000000001',
  'public',
  'Tech Meetup Haifa 2026',
  'Join us for the biggest tech meetup in Haifa! Networking, talks, and workshops about AI, web development, and startups. Free food and drinks included.',
  (CURRENT_DATE + INTERVAL '7 days')::DATE,
  '18:00',
  '22:00',
  'Haifa, Matam Tech Park',
  'Trempi Demo',
  '+972501234567'
),
(
  gen_random_uuid(),
  'WEDDING1',
  '00000000-0000-0000-0000-000000000001',
  'public',
  'Sarah & Ahmad Wedding',
  'We are getting married! Join us to celebrate this special day. Transportation coordination for guests coming from different cities.',
  (CURRENT_DATE + INTERVAL '14 days')::DATE,
  '19:00',
  '23:30',
  'Nazareth, Golden Hall',
  'Trempi Demo',
  '+972501234567'
);

-- Step 4: Add some example transportation offers for the Tech Meetup
INSERT INTO transportations (event_id, user_id, transportation_type, status, from_city, pickup_point, available_seats, total_seats, departure_time, driver_name, phone, whatsapp, notes)
SELECT 
  e.id,
  '00000000-0000-0000-0000-000000000001',
  'private_car',
  'active',
  'Tel Aviv',
  'Azrieli Center',
  3,
  4,
  '17:00',
  'David Cohen',
  '+972521234567',
  '+972521234567',
  'Leaving from Azrieli at 5pm sharp. AC in car. Can take 3 passengers.'
FROM events e WHERE e.event_code = 'TECH2026';

INSERT INTO transportations (event_id, user_id, transportation_type, status, from_city, pickup_point, available_seats, total_seats, departure_time, driver_name, phone, whatsapp, notes)
SELECT 
  e.id,
  '00000000-0000-0000-0000-000000000001',
  'shared_taxi',
  'active',
  'Jerusalem',
  'Central Bus Station',
  5,
  6,
  '16:30',
  'Mohammed Hassan',
  '+972541234567',
  '+972541234567',
  'Shared taxi from Jerusalem. Cost split between passengers (around 30 NIS each).'
FROM events e WHERE e.event_code = 'TECH2026';

-- Add transportation for the Wedding
INSERT INTO transportations (event_id, user_id, transportation_type, status, from_city, pickup_point, available_seats, total_seats, departure_time, return_time, bus_company, phone, whatsapp, notes)
SELECT 
  e.id,
  '00000000-0000-0000-0000-000000000001',
  'bus',
  'active',
  'Haifa',
  'Haifa Central Station',
  35,
  50,
  '18:00',
  '00:00',
  'Egged Tours',
  '+972501234567',
  '+972501234567',
  'Organized bus for wedding guests from Haifa. Round trip included.'
FROM events e WHERE e.event_code = 'WEDDING1';

INSERT INTO transportations (event_id, user_id, transportation_type, status, from_city, pickup_point, available_seats, total_seats, departure_time, driver_name, phone, whatsapp, notes)
SELECT 
  e.id,
  '00000000-0000-0000-0000-000000000001',
  'private_car',
  'active',
  'Akko',
  'Akko Train Station',
  2,
  4,
  '18:30',
  'Lina Rizk',
  '+972531234567',
  '+972531234567',
  'Coming from Akko, can pick up 2 more people on the way.'
FROM events e WHERE e.event_code = 'WEDDING1';

-- Done! You should now see 2 events with rides available.
-- Access them at:
--   /event/TECH2026
--   /event/WEDDING1
