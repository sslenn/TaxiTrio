-- TaxiTrio Database Schema
-- DDL: Create Tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types
CREATE TYPE user_role AS ENUM ('traveler', 'driver', 'admin');
CREATE TYPE booking_type AS ENUM ('city_ride', 'intercity', 'package');
CREATE TYPE booking_status AS ENUM (
  'pending_payment', 'payment_verified', 'driver_assigned',
  'accepted', 'rejected', 'en_route', 'arrived',
  'in_progress', 'completed', 'cancelled'
);
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE custom_trip_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE vehicle_type AS ENUM ('sedan', 'suv', 'van', 'minibus', 'bus');

-- USERS
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  phone       VARCHAR(20),
  password    VARCHAR(255) NOT NULL,
  role        user_role NOT NULL DEFAULT 'traveler',
  avatar_url  VARCHAR(500),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- VEHICLES
CREATE TABLE vehicles (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  plate_number   VARCHAR(20) NOT NULL UNIQUE,
  type           vehicle_type NOT NULL,
  brand          VARCHAR(50),
  model          VARCHAR(50),
  capacity       INT NOT NULL CHECK (capacity > 0),
  is_available   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROUTES
CREATE TABLE routes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin        VARCHAR(150) NOT NULL,
  destination   VARCHAR(150) NOT NULL,
  distance_km   NUMERIC(8,2) NOT NULL CHECK (distance_km > 0),
  base_price    NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
  duration_hrs  NUMERIC(5,2),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (origin, destination)
);

-- TRANSPORTATION PACKAGES
CREATE TABLE transportation_packages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(150) NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  duration_days INT NOT NULL CHECK (duration_days > 0),
  max_persons   INT NOT NULL CHECK (max_persons > 0),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BOOKINGS
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  vehicle_id      UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  route_id        UUID REFERENCES routes(id) ON DELETE SET NULL,
  package_id      UUID REFERENCES transportation_packages(id) ON DELETE SET NULL,
  booking_type    booking_type NOT NULL,
  status          booking_status NOT NULL DEFAULT 'pending_payment',
  pickup_location VARCHAR(255),
  dropoff_location VARCHAR(255),
  pickup_time     TIMESTAMPTZ,
  total_fare      NUMERIC(10,2) NOT NULL CHECK (total_fare >= 0),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PAYMENT RECORDS
CREATE TABLE payment_records (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id     UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  traveler_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount         NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  payment_method VARCHAR(50) NOT NULL,
  proof_url      VARCHAR(500),
  status         payment_status NOT NULL DEFAULT 'pending',
  verified_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CUSTOM TRIP REQUESTS
CREATE TABLE custom_trip_requests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin           VARCHAR(150) NOT NULL,
  destination      VARCHAR(150) NOT NULL,
  travel_date      DATE NOT NULL,
  passengers       INT NOT NULL CHECK (passengers > 0),
  special_requests TEXT,
  status           custom_trip_status NOT NULL DEFAULT 'pending',
  admin_note       TEXT,
  quoted_price     NUMERIC(10,2),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(150) NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BOOKING STATUS HISTORY
CREATE TABLE booking_status_history (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status     booking_status NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_bookings_traveler ON bookings(traveler_id);
CREATE INDEX idx_bookings_driver ON bookings(driver_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payment_records_booking ON payment_records(booking_id);
CREATE INDEX idx_payment_records_status ON payment_records(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_bsh_booking ON booking_status_history(booking_id);
CREATE INDEX idx_reviews_driver ON reviews(driver_id);
CREATE INDEX idx_vehicles_driver ON vehicles(driver_id);
