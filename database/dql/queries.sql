-- TaxiTrio DQL: Common Queries

-- 1. All active routes with pricing
SELECT id, origin, destination, distance_km, base_price, duration_hrs
FROM routes
WHERE is_active = TRUE
ORDER BY origin, destination;

-- 2. All active transportation packages
SELECT id, name, description, price, duration_days, max_persons
FROM transportation_packages
WHERE is_active = TRUE
ORDER BY price;

-- 3. Traveler's bookings with status
SELECT b.id, b.booking_type, b.status, b.pickup_location, b.dropoff_location,
       b.pickup_time, b.total_fare,
       r.origin, r.destination,
       u.full_name AS driver_name
FROM bookings b
LEFT JOIN routes r ON b.route_id = r.id
LEFT JOIN users u ON b.driver_id = u.id
WHERE b.traveler_id = $1
ORDER BY b.created_at DESC;

-- 4. Driver assigned bookings
SELECT b.id, b.booking_type, b.status, b.pickup_location, b.dropoff_location,
       b.pickup_time, b.total_fare,
       t.full_name AS traveler_name, t.phone AS traveler_phone,
       v.plate_number, v.brand, v.model
FROM bookings b
JOIN users t ON b.traveler_id = t.id
LEFT JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.driver_id = $1
  AND b.status IN ('driver_assigned','accepted','en_route','arrived','in_progress')
ORDER BY b.pickup_time;

-- 5. Driver earnings (completed trips)
SELECT COUNT(*) AS total_trips,
       SUM(b.total_fare) AS gross_earnings,
       SUM(b.total_fare * 0.8) AS net_earnings
FROM bookings b
WHERE b.driver_id = $1
  AND b.status = 'completed';

-- 6. Admin: all pending payments
SELECT pr.id, pr.amount, pr.payment_method, pr.proof_url, pr.created_at,
       u.full_name AS traveler_name,
       b.booking_type, b.total_fare
FROM payment_records pr
JOIN users u ON pr.traveler_id = u.id
JOIN bookings b ON pr.booking_id = b.id
WHERE pr.status = 'pending'
ORDER BY pr.created_at;

-- 7. Admin: booking statistics
SELECT
  COUNT(*) AS total_bookings,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
  COUNT(*) FILTER (WHERE status = 'pending_payment') AS pending_payment,
  SUM(total_fare) FILTER (WHERE status = 'completed') AS total_revenue
FROM bookings;

-- 8. Booking status history for a specific booking
SELECT bsh.status, bsh.note, bsh.created_at,
       u.full_name AS changed_by
FROM booking_status_history bsh
LEFT JOIN users u ON bsh.changed_by = u.id
WHERE bsh.booking_id = $1
ORDER BY bsh.created_at;

-- 9. Top rated drivers
SELECT u.id, u.full_name,
       ROUND(AVG(r.rating), 2) AS avg_rating,
       COUNT(r.id) AS total_reviews
FROM users u
JOIN reviews r ON u.id = r.driver_id
WHERE u.role = 'driver'
GROUP BY u.id, u.full_name
ORDER BY avg_rating DESC;

-- 10. Admin: custom trip requests pending review
SELECT ctr.id, ctr.origin, ctr.destination, ctr.travel_date,
       ctr.passengers, ctr.special_requests, ctr.created_at,
       u.full_name AS traveler_name, u.phone
FROM custom_trip_requests ctr
JOIN users u ON ctr.traveler_id = u.id
WHERE ctr.status = 'pending'
ORDER BY ctr.created_at;

-- 11. Monthly revenue report
SELECT DATE_TRUNC('month', b.created_at) AS month,
       COUNT(*) AS bookings,
       SUM(b.total_fare) AS revenue
FROM bookings b
WHERE b.status = 'completed'
GROUP BY 1
ORDER BY 1 DESC;

-- 12. Available vehicles (not currently on a trip)
SELECT v.id, v.plate_number, v.type, v.brand, v.model, v.capacity,
       u.full_name AS driver_name, u.phone AS driver_phone
FROM vehicles v
JOIN users u ON v.driver_id = u.id
WHERE v.is_available = TRUE
  AND u.is_active = TRUE;
