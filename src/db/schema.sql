-- Trempi V2 - Supabase Database Schema
-- Complete production migration

-- ============================================================
-- FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION generate_event_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  code_exists BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM events WHERE event_code = result) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_event_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_code IS NULL OR NEW.event_code = '' THEN
    NEW.event_code := generate_event_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_code TEXT UNIQUE NOT NULL,
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT NOT NULL,
  organizer_name TEXT,
  organizer_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transportations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  transportation_type TEXT NOT NULL CHECK (transportation_type IN ('private_car', 'shared_taxi', 'bus', 'shuttle', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'completed', 'cancelled')),
  from_city TEXT,
  pickup_point TEXT,
  available_seats INTEGER DEFAULT 0,
  total_seats INTEGER DEFAULT 0,
  price NUMERIC(10,2),
  notes TEXT,
  driver_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  departure_time TIME,
  return_time TIME,
  bus_company TEXT,
  pickup_area TEXT,
  destination TEXT,
  frequency TEXT,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transportation_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transportation_id UUID REFERENCES transportations(id) ON DELETE CASCADE NOT NULL,
  stop_name TEXT NOT NULL,
  city TEXT,
  location TEXT,
  stop_time TIME,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transportation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  from_city TEXT NOT NULL,
  pickup_point TEXT,
  preferred_time TIME,
  passengers INTEGER DEFAULT 1,
  contact TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER set_event_code_trigger
  BEFORE INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION set_event_code();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER transportations_updated_at
  BEFORE UPDATE ON transportations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER transportation_requests_updated_at
  BEFORE UPDATE ON transportation_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- events policies
CREATE POLICY "events_select_public"
  ON events FOR SELECT
  USING (visibility = 'public' OR organizer_id = auth.uid());

CREATE POLICY "events_insert_authenticated"
  ON events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "events_update_organizer"
  ON events FOR UPDATE
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "events_delete_organizer"
  ON events FOR DELETE
  USING (organizer_id = auth.uid());

-- transportations policies
CREATE POLICY "transportations_select"
  ON transportations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = transportations.event_id
      AND (events.visibility = 'public' OR events.organizer_id = auth.uid())
    )
  );

CREATE POLICY "transportations_insert_authenticated"
  ON transportations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "transportations_update_owner"
  ON transportations FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "transportations_delete_owner"
  ON transportations FOR DELETE
  USING (user_id = auth.uid());

-- transportation_stops policies
CREATE POLICY "transportation_stops_select"
  ON transportation_stops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM transportations
      JOIN events ON events.id = transportations.event_id
      WHERE transportations.id = transportation_stops.transportation_id
      AND (events.visibility = 'public' OR events.organizer_id = auth.uid())
    )
  );

CREATE POLICY "transportation_stops_insert_owner"
  ON transportation_stops FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM transportations
      WHERE transportations.id = transportation_stops.transportation_id
      AND transportations.user_id = auth.uid()
    )
  );

CREATE POLICY "transportation_stops_update_owner"
  ON transportation_stops FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM transportations
      WHERE transportations.id = transportation_stops.transportation_id
      AND transportations.user_id = auth.uid()
    )
  );

CREATE POLICY "transportation_stops_delete_owner"
  ON transportation_stops FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM transportations
      WHERE transportations.id = transportation_stops.transportation_id
      AND transportations.user_id = auth.uid()
    )
  );

-- transportation_requests policies
CREATE POLICY "transportation_requests_select"
  ON transportation_requests FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = transportation_requests.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "transportation_requests_insert_authenticated"
  ON transportation_requests FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "transportation_requests_update_owner"
  ON transportation_requests FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "transportation_requests_delete_owner"
  ON transportation_requests FOR DELETE
  USING (user_id = auth.uid());

-- notifications policies
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_authenticated"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_visibility ON events(visibility);
CREATE INDEX idx_transportations_event_id ON transportations(event_id);
CREATE INDEX idx_transportations_user_id ON transportations(user_id);
CREATE INDEX idx_transportation_stops_transportation_id ON transportation_stops(transportation_id);
CREATE INDEX idx_transportation_requests_event_id ON transportation_requests(event_id);
CREATE INDEX idx_transportation_requests_user_id ON transportation_requests(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================================
-- REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE transportations;
ALTER PUBLICATION supabase_realtime ADD TABLE transportation_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
