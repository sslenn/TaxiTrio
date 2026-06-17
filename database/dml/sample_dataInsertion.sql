-- TaxiTrio Sample Data
-- Passwords are bcrypt hash of "Password123!" for all seeded users

INSERT INTO users (id, full_name, email, phone, password, role) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Admin TaxiTrio', 'admin@taxitrio.com', '+85512000001',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImR8.O96', 'admin'),
  ('a1000000-0000-0000-0000-000000000002', 'Dara Chan', 'dara@driver.com', '+85512000002',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImR8.O96', 'driver'),
  ('a1000000-0000-0000-0000-000000000003', 'Sophea Lim', 'sophea@driver.com', '+85512000003',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImR8.O96', 'driver'),
  ('a1000000-0000-0000-0000-000000000004', 'Maly Ros', 'maly@traveler.com', '+85512000004',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImR8.O96', 'traveler'),
  ('a1000000-0000-0000-0000-000000000005', 'James Carter', 'james@traveler.com', '+85512000005',
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImR8.O96', 'traveler');

INSERT INTO vehicles (id, driver_id, plate_number, type, brand, model, capacity) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002',
   'PP-1234A', 'sedan', 'Toyota', 'Camry', 4),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003',
   'PP-5678B', 'suv', 'Toyota', 'Fortuner', 6);

INSERT INTO routes (id, origin, destination, distance_km, base_price, duration_hrs) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Phnom Penh', 'Siem Reap', 314.00, 25.00, 6.0),
  ('c1000000-0000-0000-0000-000000000002', 'Phnom Penh', 'Sihanoukville', 230.00, 20.00, 4.5),
  ('c1000000-0000-0000-0000-000000000003', 'Phnom Penh', 'Kampot', 148.00, 15.00, 3.0),
  ('c1000000-0000-0000-0000-000000000004', 'Siem Reap', 'Battambang', 170.00, 12.00, 3.5);

INSERT INTO transportation_packages (id, name, description, price, duration_days, max_persons) VALUES
  ('d1000000-0000-0000-0000-000000000001',
   'Angkor Explorer', '2-day Siem Reap temple tour with private driver', 150.00, 2, 4),
  ('d1000000-0000-0000-0000-000000000002',
   'Coastal Escape', '3-day Sihanoukville beach trip', 200.00, 3, 6),
  ('d1000000-0000-0000-0000-000000000003',
   'Kampot Riverside', '1-day Kampot scenic tour', 60.00, 1, 4);

INSERT INTO bookings (id, traveler_id, driver_id, vehicle_id, route_id, booking_type, status, pickup_location, dropoff_location, pickup_time, total_fare) VALUES
  ('e1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000004',
   'a1000000-0000-0000-0000-000000000002',
   'b1000000-0000-0000-0000-000000000001',
   'c1000000-0000-0000-0000-000000000001',
   'intercity', 'completed',
   'Toul Kork, Phnom Penh', 'Pub Street, Siem Reap',
   NOW() - INTERVAL '3 days', 25.00),
  ('e1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000005',
   NULL, NULL, NULL,
   'city_ride', 'pending_payment',
   'BKK1, Phnom Penh', 'Russian Market, Phnom Penh',
   NOW() + INTERVAL '2 hours', 8.00);

INSERT INTO payment_records (booking_id, traveler_id, amount, payment_method, status, verified_by, verified_at) VALUES
  ('e1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000004',
   25.00, 'ABA Bank', 'verified',
   'a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days 23 hours');

INSERT INTO reviews (booking_id, traveler_id, driver_id, rating, comment) VALUES
  ('e1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000004',
   'a1000000-0000-0000-0000-000000000002',
   5, 'Excellent driver, very punctual and friendly!');

INSERT INTO booking_status_history (booking_id, status, changed_by) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'pending_payment', 'a1000000-0000-0000-0000-000000000004'),
  ('e1000000-0000-0000-0000-000000000001', 'payment_verified', 'a1000000-0000-0000-0000-000000000001'),
  ('e1000000-0000-0000-0000-000000000001', 'driver_assigned', 'a1000000-0000-0000-0000-000000000001'),
  ('e1000000-0000-0000-0000-000000000001', 'accepted', 'a1000000-0000-0000-0000-000000000002'),
  ('e1000000-0000-0000-0000-000000000001', 'completed', 'a1000000-0000-0000-0000-000000000002'),
  ('e1000000-0000-0000-0000-000000000002', 'pending_payment', 'a1000000-0000-0000-0000-000000000005');

INSERT INTO notifications (user_id, title, message) VALUES
  ('a1000000-0000-0000-0000-000000000004', 'Booking Confirmed', 'Your trip to Siem Reap has been completed.'),
  ('a1000000-0000-0000-0000-000000000005', 'Awaiting Payment', 'Please upload payment proof for your city ride.');
