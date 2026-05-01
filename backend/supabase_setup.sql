-- =========================================================
-- AUTO-LOC — Supabase SQL Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================

-- ── TABLE B: CARS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,           -- SUV, Berline, Sportive, 4x4
  brand         TEXT NOT NULL,
  price_per_day INTEGER NOT NULL,        -- in DZD
  description   TEXT,
  specs         JSONB,                   -- { power, speed, transmission, fuel, seats, year }
  rating        NUMERIC(2,1) DEFAULT 4.5,
  reviews       INTEGER DEFAULT 0,
  tag           TEXT,                    -- 'Populaire', 'Nouveau', 'Premium'...
  available     BOOLEAN DEFAULT TRUE,
  image_url     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE C: RESERVATIONS ──────────────────────────────────
-- Table A (users) is managed by Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS reservations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id        INTEGER NOT NULL REFERENCES cars(id),
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  total_price   INTEGER NOT NULL,        -- in DZD
  license_url   TEXT,                   -- Supabase Storage URL (permis de conduire)
  ref           TEXT UNIQUE NOT NULL,   -- 'ALQ-2025-XXXX'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────
-- CRITICAL: Users can only see their own reservations

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policy: select own reservations only
CREATE POLICY "Users see own reservations"
  ON reservations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: insert own reservations only
CREATE POLICY "Users insert own reservations"
  ON reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: update own reservations only
CREATE POLICY "Users update own reservations"
  ON reservations FOR UPDATE
  USING (auth.uid() = user_id);

-- Cars are readable by everyone (no RLS needed, or allow all reads)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cars readable by all"
  ON cars FOR SELECT
  USING (TRUE);

-- ── SUPABASE STORAGE ───────────────────────────────────────
-- Create bucket manually in Dashboard > Storage > New Bucket
-- Bucket name: licenses
-- Public: YES (so URLs work in the app)
--
-- Or run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('licenses', 'licenses', true);

-- ── SEED: CARS DATA ────────────────────────────────────────
INSERT INTO cars (name, category, brand, price_per_day, description, specs, rating, reviews, tag) VALUES
(
  'Mercedes G63 AMG', 'SUV', 'Mercedes', 45000,
  'Le légendaire SUV militaire réimaginé en supercar de luxe. Puissance brute et élégance absolue.',
  '{"power":"585 ch","speed":"220 km/h","transmission":"Automatique","fuel":"Essence","seats":5,"year":2024}',
  4.9, 48, 'Populaire'
),
(
  'Range Rover Vogue', 'SUV', 'Range Rover', 38000,
  'Le SUV britannique par excellence. Raffinement intérieur, capacité tout-terrain et prestance incomparable.',
  '{"power":"400 ch","speed":"209 km/h","transmission":"Automatique","fuel":"Hybride","seats":5,"year":2024}',
  4.8, 36, 'Nouveau'
),
(
  'Volkswagen Golf R', 'Sportive', 'Volkswagen', 18000,
  'La compacte la plus emblématique élevée au rang de sportive. 4Motion, performance et plaisir de conduite.',
  '{"power":"333 ch","speed":"250 km/h","transmission":"Automatique","fuel":"Essence","seats":5,"year":2023}',
  4.7, 62, NULL
),
(
  'Mercedes E-Class', 'Berline', 'Mercedes', 28000,
  'La berline de référence alliant technologie de pointe, confort exceptionnel et design signature Mercedes.',
  '{"power":"340 ch","speed":"250 km/h","transmission":"Automatique","fuel":"Hybride","seats":5,"year":2024}',
  4.8, 41, NULL
),
(
  'BMW 5 Series', 'Berline', 'BMW', 26000,
  'La berline sportive bavaroise dans toute sa splendeur. Dynamisme, technologie et confort en parfait équilibre.',
  '{"power":"374 ch","speed":"250 km/h","transmission":"Automatique","fuel":"Essence","seats":5,"year":2024}',
  4.7, 29, NULL
),
(
  'Audi Q8', 'SUV', 'Audi', 35000,
  'Le SUV coupé de prestige qui redéfinit les codes du luxe automobile. Design saisissant, intérieur hi-tech.',
  '{"power":"400 ch","speed":"250 km/h","transmission":"Automatique","fuel":"Essence","seats":5,"year":2023}',
  4.8, 33, 'Exclusif'
),
(
  'Porsche Cayenne', 'SUV', 'Porsche', 42000,
  'Le SUV qui ne compromet pas. Performances de supercar, praticité d''un SUV, luxe d''une Porsche.',
  '{"power":"440 ch","speed":"263 km/h","transmission":"Automatique","fuel":"Hybride","seats":5,"year":2024}',
  4.9, 27, 'Premium'
),
(
  'Toyota Land Cruiser 300', '4x4', 'Toyota', 32000,
  'La légende japonaise de la fiabilité et du tout-terrain. Conquérez tous les terrains en toute confiance.',
  '{"power":"415 ch","speed":"210 km/h","transmission":"Automatique","fuel":"Diesel","seats":7,"year":2024}',
  4.9, 55, 'Fiable'
),
(
  'Mercedes S-Class', 'Berline', 'Mercedes', 55000,
  'La berline ultime de Mercedes. Le sommet de la technologie automobile, du confort et du prestige.',
  '{"power":"435 ch","speed":"250 km/h","transmission":"Automatique","fuel":"Hybride","seats":5,"year":2024}',
  5.0, 18, 'Ultra-luxe'
),
(
  'Audi A4', 'Berline', 'Audi', 22000,
  'L''entrée dans le monde Audi. Design avant-gardiste, technologie quattro et finitions irréprochables.',
  '{"power":"265 ch","speed":"250 km/h","transmission":"Automatique","fuel":"Essence","seats":5,"year":2023}',
  4.6, 44, NULL
);
