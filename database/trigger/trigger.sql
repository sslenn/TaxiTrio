-- TaxiTrio Triggers

-- ─── 1. Auto-update updated_at on all tables ───────────────────────────────

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'users','vehicles','routes','transportation_packages',
    'bookings','payment_records','custom_trip_requests','reviews','notifications'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at()',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ─── 2. Insert a row into booking_status_history when booking status changes ─

CREATE OR REPLACE FUNCTION fn_log_booking_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO booking_status_history (booking_id, status, changed_by)
    VALUES (NEW.id, NEW.status, NULL);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_status_log
AFTER UPDATE OF status ON bookings
FOR EACH ROW EXECUTE FUNCTION fn_log_booking_status();

-- ─── 3. Create notification when payment status changes to verified/rejected ─

CREATE OR REPLACE FUNCTION fn_notify_payment_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'verified' THEN
      INSERT INTO notifications (user_id, title, message)
      VALUES (NEW.traveler_id, 'Payment Verified',
              'Your payment has been verified. Your booking is now being processed.');
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO notifications (user_id, title, message)
      VALUES (NEW.traveler_id, 'Payment Rejected',
              'Your payment was rejected. Please re-upload your proof of payment.');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_payment_status_notify
AFTER UPDATE OF status ON payment_records
FOR EACH ROW EXECUTE FUNCTION fn_notify_payment_status();

-- ─── 4. Notify traveler when driver accepts or rejects a booking ─────────────

CREATE OR REPLACE FUNCTION fn_notify_booking_driver_action()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'accepted' THEN
      INSERT INTO notifications (user_id, title, message)
      VALUES (NEW.traveler_id, 'Driver Accepted',
              'Your driver has accepted the booking. Get ready!');
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO notifications (user_id, title, message)
      VALUES (NEW.traveler_id, 'Driver Rejected',
              'Your assigned driver has rejected the booking. We will reassign shortly.');
    ELSIF NEW.status = 'completed' THEN
      INSERT INTO notifications (user_id, title, message)
      VALUES (NEW.traveler_id, 'Trip Completed',
              'Your trip has been completed. Thank you for choosing TaxiTrio!');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_driver_action_notify
AFTER UPDATE OF status ON bookings
FOR EACH ROW EXECUTE FUNCTION fn_notify_booking_driver_action();

-- ─── 5. Set vehicle unavailable when assigned to an active booking ────────────

CREATE OR REPLACE FUNCTION fn_vehicle_availability()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.vehicle_id IS NOT NULL THEN
    IF NEW.status IN ('driver_assigned','accepted','en_route','arrived','in_progress') THEN
      UPDATE vehicles SET is_available = FALSE WHERE id = NEW.vehicle_id;
    ELSIF NEW.status IN ('completed','cancelled','rejected') THEN
      UPDATE vehicles SET is_available = TRUE WHERE id = NEW.vehicle_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_vehicle_availability
AFTER UPDATE OF status ON bookings
FOR EACH ROW EXECUTE FUNCTION fn_vehicle_availability();
