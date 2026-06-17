-- Dynamic Routing & Pricing Schema Update

-- 1. Add coordinates and travel metadata to the bookings table
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS pickup_lat DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS pickup_lng DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS dropoff_lat DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS dropoff_lng DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS distance_km DECIMAL(8, 2),
  ADD COLUMN IF NOT EXISTS duration_mins INT;

-- 2. Create the pricing_rules table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_type    vehicle_type NOT NULL, -- ENUM: 'sedan', 'suv', 'van', 'minibus', 'bus'
  booking_type    booking_type NOT NULL, -- ENUM: 'city_ride', 'intercity', 'package'
  base_fare       NUMERIC(10, 2) NOT NULL DEFAULT 1.00,  -- The base starting fare (e.g. $1.00)
  per_km_rate     NUMERIC(10, 2) NOT NULL DEFAULT 0.50,  -- Price per kilometer
  per_minute_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.05,  -- Price per minute
  surge_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 1.00,  -- Peak hours multiplier
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vehicle_type, booking_type)
);

-- 3. Seed initial pricing rules
INSERT INTO pricing_rules (vehicle_type, booking_type, base_fare, per_km_rate, per_minute_rate, surge_multiplier) VALUES
  ('sedan', 'city_ride', 1.50, 0.70, 0.05, 1.00),
  ('sedan', 'intercity', 5.00, 0.60, 0.00, 1.00),
  ('suv',   'city_ride', 2.50, 1.00, 0.08, 1.00),
  ('suv',   'intercity', 10.00, 0.90, 0.00, 1.00),
  ('van',   'city_ride', 3.00, 1.20, 0.10, 1.00),
  ('van',   'intercity', 12.00, 1.10, 0.00, 1.00)
ON CONFLICT (vehicle_type, booking_type) DO NOTHING;
