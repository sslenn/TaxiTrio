--
-- PostgreSQL database dump
--

\restrict j4Yp2HSl2Clq7nuhpg4p75RSrtRzDI8zJaMopLldVgqjdhtpdk7cSy7yLsuPZ3W

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-11 20:09:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17397)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 884 (class 1247 OID 17424)
-- Name: booking_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status AS ENUM (
    'pending_payment',
    'payment_verified',
    'driver_assigned',
    'accepted',
    'rejected',
    'en_route',
    'arrived',
    'in_progress',
    'completed',
    'cancelled'
);


ALTER TYPE public.booking_status OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 17416)
-- Name: booking_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_type AS ENUM (
    'city_ride',
    'intercity',
    'package'
);


ALTER TYPE public.booking_type OWNER TO postgres;

--
-- TOC entry 890 (class 1247 OID 17454)
-- Name: custom_trip_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.custom_trip_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.custom_trip_status OWNER TO postgres;

--
-- TOC entry 887 (class 1247 OID 17446)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'verified',
    'rejected'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 17409)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'traveler',
    'driver',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 893 (class 1247 OID 17462)
-- Name: vehicle_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vehicle_type AS ENUM (
    'sedan',
    'suv',
    'van',
    'minibus',
    'bus'
);


ALTER TYPE public.vehicle_type OWNER TO postgres;

--
-- TOC entry 242 (class 1255 OID 17772)
-- Name: fn_log_booking_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_log_booking_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO booking_status_history (booking_id, status, changed_by)
    VALUES (NEW.id, NEW.status, NULL);
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_log_booking_status() OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 17776)
-- Name: fn_notify_booking_driver_action(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_notify_booking_driver_action() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.fn_notify_booking_driver_action() OWNER TO postgres;

--
-- TOC entry 243 (class 1255 OID 17774)
-- Name: fn_notify_payment_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_notify_payment_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.fn_notify_payment_status() OWNER TO postgres;

--
-- TOC entry 241 (class 1255 OID 17762)
-- Name: fn_set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_set_updated_at() OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 17778)
-- Name: fn_vehicle_availability(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_vehicle_availability() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.fn_vehicle_availability() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 17726)
-- Name: booking_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_status_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid NOT NULL,
    status public.booking_status NOT NULL,
    changed_by uuid,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.booking_status_history OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17562)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    traveler_id uuid NOT NULL,
    driver_id uuid,
    vehicle_id uuid,
    route_id uuid,
    package_id uuid,
    booking_type public.booking_type NOT NULL,
    status public.booking_status DEFAULT 'pending_payment'::public.booking_status NOT NULL,
    pickup_location text,
    dropoff_location text,
    pickup_time timestamp with time zone,
    total_fare numeric(10,2) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    pickup_lat numeric(10,8),
    pickup_lng numeric(11,8),
    dropoff_lat numeric(10,8),
    dropoff_lng numeric(11,8),
    distance_km numeric(8,2),
    duration_mins integer,
    CONSTRAINT bookings_total_fare_check CHECK ((total_fare >= (0)::numeric))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17643)
-- Name: custom_trip_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_trip_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    traveler_id uuid NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    travel_date date NOT NULL,
    passengers integer NOT NULL,
    special_requests text,
    status public.custom_trip_status DEFAULT 'pending'::public.custom_trip_status NOT NULL,
    admin_note text,
    quoted_price numeric(10,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    traveler_response text,
    telegram_contact character varying(100),
    is_urgent_requested boolean DEFAULT false,
    travel_time character varying(50),
    CONSTRAINT custom_trip_requests_passengers_check CHECK ((passengers > 0))
);


ALTER TABLE public.custom_trip_requests OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17703)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    title character varying(150) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17606)
-- Name: payment_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_records (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid NOT NULL,
    traveler_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method character varying(50) NOT NULL,
    proof_url character varying(500),
    status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payment_records_amount_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.payment_records OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17780)
-- Name: pricing_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pricing_rules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    vehicle_type public.vehicle_type NOT NULL,
    booking_type public.booking_type NOT NULL,
    base_fare numeric(10,2) DEFAULT 1.00 NOT NULL,
    per_km_rate numeric(10,2) DEFAULT 0.50 NOT NULL,
    per_minute_rate numeric(10,2) DEFAULT 0.05 NOT NULL,
    surge_multiplier numeric(3,2) DEFAULT 1.00 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pricing_rules OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17669)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid NOT NULL,
    traveler_id uuid NOT NULL,
    driver_id uuid,
    rating smallint NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17519)
-- Name: routes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    origin character varying(150) NOT NULL,
    destination character varying(150) NOT NULL,
    distance_km numeric(8,2) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    duration_hrs numeric(5,2),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT routes_base_price_check CHECK ((base_price >= (0)::numeric)),
    CONSTRAINT routes_distance_km_check CHECK ((distance_km > (0)::numeric))
);


ALTER TABLE public.routes OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17540)
-- Name: transportation_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transportation_packages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    duration_days integer NOT NULL,
    max_persons integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT transportation_packages_duration_days_check CHECK ((duration_days > 0)),
    CONSTRAINT transportation_packages_max_persons_check CHECK ((max_persons > 0)),
    CONSTRAINT transportation_packages_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.transportation_packages OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17473)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20),
    password character varying(255),
    role public.user_role DEFAULT 'traveler'::public.user_role NOT NULL,
    avatar_url character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    reset_password_token character varying(255),
    reset_password_expires timestamp with time zone,
    must_change_password boolean DEFAULT false,
    status character varying(50) DEFAULT 'active'::character varying,
    activation_token character varying(255),
    token_expires_at timestamp with time zone,
    license_number character varying(50)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17495)
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    driver_id uuid,
    plate_number character varying(20) NOT NULL,
    type public.vehicle_type NOT NULL,
    brand character varying(50),
    model character varying(50),
    capacity integer NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT vehicles_capacity_check CHECK ((capacity > 0))
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- TOC entry 5220 (class 0 OID 17726)
-- Dependencies: 229
-- Data for Name: booking_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_status_history (id, booking_id, status, changed_by, note, created_at) FROM stdin;
ba5a2906-a704-4fd5-9898-ee69c9c41b7b	e1000000-0000-0000-0000-000000000001	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 15:30:42.546372+07
d99f0a17-d0fa-420b-ba48-413d0f9ffc85	e1000000-0000-0000-0000-000000000001	payment_verified	a1000000-0000-0000-0000-000000000001	\N	2026-06-14 15:30:42.546372+07
bd891a53-46fb-4ec5-9675-ef6e971adbde	e1000000-0000-0000-0000-000000000001	driver_assigned	a1000000-0000-0000-0000-000000000001	\N	2026-06-14 15:30:42.546372+07
8c808c6c-d744-470d-8736-11d7c0b386b2	e1000000-0000-0000-0000-000000000001	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 15:30:42.546372+07
c98cd215-187c-42f3-b47c-ad51367f9e00	e1000000-0000-0000-0000-000000000001	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 15:30:42.546372+07
dfe06d76-59fa-43c3-8cd2-370d9c5df0f4	e1000000-0000-0000-0000-000000000002	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-14 15:30:42.546372+07
88823759-5e33-4583-879e-0498336d17a8	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 16:04:36.864+07
f9940c57-121e-4ebd-bf24-5503940363dc	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	payment_verified	\N	\N	2026-06-14 16:10:45.851992+07
99ff9ab6-d024-40d3-b115-8f4dec7bef1b	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	driver_assigned	\N	\N	2026-06-14 16:11:55.295332+07
1dd9fc0c-6be8-4c64-bc78-64727d12d57e	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	accepted	\N	\N	2026-06-14 16:12:55.242709+07
e3f2a2b2-3c72-4925-acf5-b00bb960cea5	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 16:12:55.272+07
a078c6b7-fe83-4fce-8416-5c900781901e	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	en_route	\N	\N	2026-06-14 16:12:56.507641+07
3e272c39-a864-4bc4-ab55-839e5c095900	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	en_route	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 16:12:56.514+07
ecee9611-f554-4d30-a3b0-c0ab3e9d53d6	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	arrived	\N	\N	2026-06-14 16:13:01.372881+07
e39d0bbd-d428-447c-981a-f868f117676b	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	arrived	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 16:13:01.38+07
840a658e-522c-482b-b43d-09afa5ce4951	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	in_progress	\N	\N	2026-06-14 16:13:02.681121+07
c3624059-809d-4931-a443-4855046a325d	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	in_progress	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 16:13:02.687+07
c460e89c-9790-437b-90c2-01279b0c897e	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	completed	\N	\N	2026-06-14 16:13:03.424529+07
3bd60061-5760-4f33-8bba-45bc53bfc2eb	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 16:13:03.435+07
45225238-1ccc-40b0-8181-8f93b323b616	45324760-571a-4b6a-9c1b-c529bfd41471	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 19:55:24.69+07
53d9dbbc-b38c-4ce1-ae22-7a78bf14bc97	45324760-571a-4b6a-9c1b-c529bfd41471	payment_verified	\N	\N	2026-06-14 19:57:02.522162+07
48ec4659-08d7-4091-a991-dcce269c079c	45324760-571a-4b6a-9c1b-c529bfd41471	driver_assigned	\N	\N	2026-06-14 19:57:02.671901+07
0931925a-f584-4d25-804a-08b1f84b39c0	45324760-571a-4b6a-9c1b-c529bfd41471	accepted	\N	\N	2026-06-14 19:58:54.35341+07
a7e7ce3e-c975-48ae-9a9e-371efc40a74b	45324760-571a-4b6a-9c1b-c529bfd41471	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 19:58:54.382+07
7316c072-788b-43d9-b92b-ff84ff470cad	45324760-571a-4b6a-9c1b-c529bfd41471	en_route	\N	\N	2026-06-14 19:58:58.984168+07
44096b77-67f9-4f4b-a55b-a688b96a7860	45324760-571a-4b6a-9c1b-c529bfd41471	en_route	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 19:58:58.991+07
7fec3ba0-020f-4ae4-909f-129edb234629	45324760-571a-4b6a-9c1b-c529bfd41471	arrived	\N	\N	2026-06-14 19:59:00.593256+07
b26f85cf-59fb-4544-bf14-ae0a5ab93151	45324760-571a-4b6a-9c1b-c529bfd41471	arrived	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 19:59:00.6+07
9fb6e163-235a-435b-9808-19e2031b09b8	45324760-571a-4b6a-9c1b-c529bfd41471	in_progress	\N	\N	2026-06-14 19:59:01.333745+07
38437da8-60d7-4691-a3ca-b2db662c8444	45324760-571a-4b6a-9c1b-c529bfd41471	in_progress	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 19:59:01.344+07
861fa062-c74e-4273-95cf-084554d1592e	45324760-571a-4b6a-9c1b-c529bfd41471	completed	\N	\N	2026-06-14 19:59:02.40235+07
e1b0fac4-4069-4cb7-b19d-fb80ed55642b	45324760-571a-4b6a-9c1b-c529bfd41471	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 19:59:02.417+07
7ed477c9-ea63-446f-9553-dc441d66aceb	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 20:03:04.787+07
6e959131-33b9-4105-a8e6-dbd8230cd4e9	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	payment_verified	\N	\N	2026-06-14 20:04:02.520954+07
54e915a7-74e3-4cfe-8336-7e77ac1d75e9	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	driver_assigned	\N	\N	2026-06-14 20:04:02.664501+07
9e9f0a37-52fa-403a-9239-19c537b79afe	679b3d50-13e6-41fe-99cd-f77c94e985ec	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 20:10:39.705+07
679a4a48-121e-4575-9515-1747e875fbe2	679b3d50-13e6-41fe-99cd-f77c94e985ec	payment_verified	\N	\N	2026-06-14 20:10:43.228748+07
4dcb0e79-2abf-4e7d-914a-0f76bcf1be93	679b3d50-13e6-41fe-99cd-f77c94e985ec	driver_assigned	\N	\N	2026-06-14 20:10:43.392246+07
716fe0ca-6ab7-433c-92be-a53c1428b5d9	90007974-66f4-44fc-9ae5-318423187a09	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 20:16:08.554+07
683efa7a-d543-46ab-b41f-2a235642ca77	90007974-66f4-44fc-9ae5-318423187a09	payment_verified	\N	\N	2026-06-14 20:16:10.663834+07
28066723-df68-456e-bce3-0c585319a688	f69a578e-3169-4ea0-b79e-917e67fac614	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 20:18:04.139+07
b56ec5a1-0cda-46c6-a319-f95c119da752	f69a578e-3169-4ea0-b79e-917e67fac614	payment_verified	\N	\N	2026-06-14 20:18:06.989827+07
72de913b-e1f9-499c-9851-061ae8c34b4f	2662755e-6641-4296-9ae4-50cf86d7e4f4	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 20:20:48.793+07
511dfcd6-22be-4730-9fff-35705e6e999c	2662755e-6641-4296-9ae4-50cf86d7e4f4	payment_verified	\N	\N	2026-06-14 20:20:51.04639+07
f3d66511-363d-49d9-b523-cc73d2560966	c9706437-79f7-47e6-9b0b-63f9728933d1	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 20:22:41.135+07
db6967eb-557a-4e9d-a7b1-5bdca75f9b0e	2662755e-6641-4296-9ae4-50cf86d7e4f4	cancelled	\N	\N	2026-06-14 21:31:39.379334+07
c09f251c-414a-4b1a-be11-628d97912d2a	90007974-66f4-44fc-9ae5-318423187a09	cancelled	\N	\N	2026-06-14 21:31:46.66269+07
3bd95e92-d23d-40f0-9cb6-9e2553901235	f69a578e-3169-4ea0-b79e-917e67fac614	cancelled	\N	\N	2026-06-14 21:31:51.053447+07
462097a7-12aa-4d44-96f8-9640a31b2c95	b968d6ef-0a6d-4ac1-9edd-d536d503fbad	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 22:04:54.03+07
bf779a47-4eff-4361-8020-fd9018487157	b968d6ef-0a6d-4ac1-9edd-d536d503fbad	payment_verified	\N	\N	2026-06-14 22:05:00.159638+07
c0aaeafc-4b36-4ab5-86b8-b44cea3a109c	c9706437-79f7-47e6-9b0b-63f9728933d1	cancelled	\N	\N	2026-06-14 22:12:23.014775+07
101d54b0-1211-4179-8d2d-71582d7e1d1f	194d7b83-35e9-407b-9e0c-80302177c5d9	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 22:20:34.538+07
ee33341f-3031-4b08-86be-748e7c8605e0	194d7b83-35e9-407b-9e0c-80302177c5d9	payment_verified	\N	\N	2026-06-14 22:21:16.895409+07
11b8271c-ec7d-478f-8907-f5de09d24c37	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	accepted	\N	\N	2026-06-14 22:25:11.648346+07
4d942198-778e-4b15-a48f-c4438b2274b7	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:25:11.73+07
be80087f-f97b-4e44-9357-6c0f58748e46	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	en_route	\N	\N	2026-06-14 22:25:16.904468+07
aee3ff67-a087-4952-96c3-fd072f7a35ff	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	en_route	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:25:16.924+07
d22d7fff-65b4-450d-84aa-32b34d6ee82b	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	arrived	\N	\N	2026-06-14 22:25:19.102882+07
3fa749ca-99fb-4a5b-aec2-1d82e87e9394	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	arrived	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:25:19.109+07
bef81063-8cef-4223-b1a3-15ce84c3acc0	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	in_progress	\N	\N	2026-06-14 22:25:20.650104+07
8ab05b0c-ee99-41b0-b163-2d0457d27c9b	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	in_progress	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:25:20.655+07
77ae9fc5-a75e-476f-8afd-0012870756a7	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	completed	\N	\N	2026-06-14 22:25:21.507127+07
c9803913-da39-4d20-87a6-d6c9b826e237	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:25:21.519+07
1d46ff4a-3c8c-4b7d-a460-1cd64ba5be57	e1000000-0000-0000-0000-000000000002	cancelled	\N	\N	2026-06-14 22:40:25.03017+07
0e7e72aa-099c-4965-ac9b-559a51ef112f	7d472b5f-2150-4801-8e64-31e33a493b55	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-14 22:40:49.22+07
dfdb7a39-eced-4091-a1b5-490ac8401608	7d472b5f-2150-4801-8e64-31e33a493b55	payment_verified	\N	\N	2026-06-14 22:40:51.433841+07
804f7e60-8824-4783-a639-facbb294e4d3	7d472b5f-2150-4801-8e64-31e33a493b55	driver_assigned	\N	\N	2026-06-14 22:40:51.555924+07
07d346c7-e99d-42f4-ade9-19af4d254062	69e93538-6e2a-4b92-b15e-6f3aa15e4f9d	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-14 22:41:56.588+07
c8966864-fd86-44e5-aefc-19ced3f36511	ad7d67ef-1c20-4716-bbc1-3589c91b28e6	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-14 22:43:45.581+07
8385fae4-b44d-44a2-b5bc-3046950b4755	ad7d67ef-1c20-4716-bbc1-3589c91b28e6	cancelled	\N	\N	2026-06-14 22:46:37.775762+07
5e480b0d-2538-4beb-b301-ef1e2b46f7b9	69e93538-6e2a-4b92-b15e-6f3aa15e4f9d	cancelled	\N	\N	2026-06-14 22:47:09.677641+07
40dc247b-6832-4cba-9066-f7d7e33f034e	0270641b-228e-4eb7-8ec8-87de27e633b3	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-14 22:47:34.076+07
c3c02718-f8d5-4458-af27-7beed41a982b	0270641b-228e-4eb7-8ec8-87de27e633b3	payment_verified	\N	\N	2026-06-14 22:48:36.446305+07
8d151ebf-0d7c-476c-b1c9-22bade938be8	0270641b-228e-4eb7-8ec8-87de27e633b3	driver_assigned	\N	\N	2026-06-14 22:50:19.202866+07
0a2fac91-7fde-4580-9183-adbc49024370	7d472b5f-2150-4801-8e64-31e33a493b55	accepted	\N	\N	2026-06-14 22:51:43.753502+07
37ae4166-e636-4374-844e-f88f174e6f41	7d472b5f-2150-4801-8e64-31e33a493b55	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:51:43.841+07
89da7b3e-93de-4b9c-9b93-0291d009e8bb	7d472b5f-2150-4801-8e64-31e33a493b55	en_route	\N	\N	2026-06-14 22:51:45.964596+07
9cc942ee-5d01-4b72-9cac-090531013bee	7d472b5f-2150-4801-8e64-31e33a493b55	en_route	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:51:45.97+07
e0183ede-1a08-43a0-9bd8-151e0ba803e9	7d472b5f-2150-4801-8e64-31e33a493b55	arrived	\N	\N	2026-06-14 22:51:46.543666+07
89e99750-2df5-4c90-8447-10ff60e5a764	7d472b5f-2150-4801-8e64-31e33a493b55	arrived	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:51:46.66+07
25a555b7-8d2e-4247-94a7-c3f7e800d189	7d472b5f-2150-4801-8e64-31e33a493b55	in_progress	\N	\N	2026-06-14 22:51:46.890285+07
df0387f8-f000-4e71-b992-05f90addc214	7d472b5f-2150-4801-8e64-31e33a493b55	in_progress	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:51:46.898+07
4d1d60a5-6227-4293-9309-3fe528d20411	7d472b5f-2150-4801-8e64-31e33a493b55	completed	\N	\N	2026-06-14 22:51:47.322652+07
7a47c67f-643a-4927-bee5-de44432571af	7d472b5f-2150-4801-8e64-31e33a493b55	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:51:47.564+07
edc1917d-bd85-4129-8589-4685c5e5d530	0270641b-228e-4eb7-8ec8-87de27e633b3	rejected	\N	\N	2026-06-14 22:55:36.46802+07
eecfadcd-9e7a-495b-b120-e7308bc46a37	0270641b-228e-4eb7-8ec8-87de27e633b3	rejected	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 22:55:36.525+07
e0d3ca1c-a58d-44d6-b0a2-41eafdff057c	59a825de-0804-4d70-a01f-afead04b1b0f	pending_payment	a1000000-0000-0000-0000-000000000004	\N	2026-06-14 23:08:37.589+07
c43fcd6e-2f7c-47e6-b008-4cf55c23475a	59a825de-0804-4d70-a01f-afead04b1b0f	payment_verified	\N	\N	2026-06-14 23:08:39.704625+07
05b73710-dd8e-40ec-a3f7-6864c3a17874	59a825de-0804-4d70-a01f-afead04b1b0f	driver_assigned	\N	\N	2026-06-14 23:08:39.810854+07
fed0f447-b689-4086-bc7d-f1840bb2552d	59a825de-0804-4d70-a01f-afead04b1b0f	accepted	\N	\N	2026-06-14 23:10:21.201413+07
778a03e5-9cc0-437f-9d39-e558c3f8ca92	59a825de-0804-4d70-a01f-afead04b1b0f	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 23:10:21.272+07
d31ac4a8-33fd-436b-882c-9fbc3e407edb	59a825de-0804-4d70-a01f-afead04b1b0f	en_route	\N	\N	2026-06-14 23:10:24.176678+07
1df7a668-ed00-49d0-a594-45e30d673777	59a825de-0804-4d70-a01f-afead04b1b0f	en_route	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 23:10:24.182+07
725a87d5-ddd9-4743-a5bb-43376d7bf665	59a825de-0804-4d70-a01f-afead04b1b0f	arrived	\N	\N	2026-06-14 23:10:24.913801+07
ca56604a-e5e3-40ec-bbf9-030517e46ba1	59a825de-0804-4d70-a01f-afead04b1b0f	arrived	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 23:10:24.918+07
f82b7ae9-a844-4ca3-8434-1c322a7b93a6	59a825de-0804-4d70-a01f-afead04b1b0f	in_progress	\N	\N	2026-06-14 23:10:25.339275+07
8923b15d-3476-490c-a2ed-03c59b0edea8	59a825de-0804-4d70-a01f-afead04b1b0f	in_progress	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 23:10:25.387+07
fb787386-c696-498a-89e0-371da64ce028	59a825de-0804-4d70-a01f-afead04b1b0f	completed	\N	\N	2026-06-14 23:10:25.863064+07
f62bbb25-73d1-4c85-8c1f-008c7dcfd22d	59a825de-0804-4d70-a01f-afead04b1b0f	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 23:10:26.023+07
4413b3f2-1807-4ded-a61b-63df5944b70f	b968d6ef-0a6d-4ac1-9edd-d536d503fbad	driver_assigned	\N	\N	2026-06-14 23:10:26.042721+07
9eb2adf6-1851-4f4a-a350-bfe6b1095362	b968d6ef-0a6d-4ac1-9edd-d536d503fbad	rejected	\N	\N	2026-06-14 23:10:29.250036+07
ca6fa49e-fef8-4842-97f2-807c75d546a7	b968d6ef-0a6d-4ac1-9edd-d536d503fbad	rejected	a1000000-0000-0000-0000-000000000002	\N	2026-06-14 23:10:29.267+07
a37e28d0-e3f4-4b24-845a-c2526197831b	6169f21a-5865-44a8-8773-57377491c668	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-15 21:18:53.709+07
79174f03-2972-41fe-b038-94af3747bce5	6169f21a-5865-44a8-8773-57377491c668	payment_verified	\N	\N	2026-06-15 21:19:00.15479+07
5de4b9f0-1b5c-45f3-bb17-c43b2f43f931	6169f21a-5865-44a8-8773-57377491c668	driver_assigned	\N	\N	2026-06-15 21:19:00.426987+07
83b084d7-76ec-487d-9a21-ef9566294e92	6169f21a-5865-44a8-8773-57377491c668	accepted	\N	\N	2026-06-15 21:21:53.431973+07
93d4d2ea-9dad-4d70-926f-3dbe7d5c2b95	6169f21a-5865-44a8-8773-57377491c668	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-15 21:21:53.475+07
fd8f8bc8-2c63-4cc8-976e-aba301bed513	6169f21a-5865-44a8-8773-57377491c668	en_route	\N	\N	2026-06-15 21:22:00.930805+07
0b890c99-030f-4bb2-b0e7-92caf5133994	6169f21a-5865-44a8-8773-57377491c668	en_route	a1000000-0000-0000-0000-000000000002	\N	2026-06-15 21:22:00.941+07
5ea7b436-b2cc-41fb-97fe-1bbf29472df2	6169f21a-5865-44a8-8773-57377491c668	arrived	\N	\N	2026-06-15 21:22:01.36004+07
682696a6-466d-4758-9bd4-04ea4da0a685	6169f21a-5865-44a8-8773-57377491c668	arrived	a1000000-0000-0000-0000-000000000002	\N	2026-06-15 21:22:01.367+07
d7a7be59-6086-406f-aaad-02fd95e34bc9	6169f21a-5865-44a8-8773-57377491c668	in_progress	\N	\N	2026-06-15 21:22:01.601542+07
f558c127-5d95-46fe-86de-43d33b7e11ba	6169f21a-5865-44a8-8773-57377491c668	in_progress	a1000000-0000-0000-0000-000000000002	\N	2026-06-15 21:22:01.608+07
f6dd5a56-2ed0-45aa-806a-ca4120f016b0	6169f21a-5865-44a8-8773-57377491c668	completed	\N	\N	2026-06-15 21:22:01.831075+07
ad03f932-b1e6-45e5-a27e-8567a82b4d70	6169f21a-5865-44a8-8773-57377491c668	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-15 21:22:01.84+07
5bc428de-e2c8-4fe4-b960-ac0544e0ff22	f9180f67-50b2-4957-9238-fadc9f0b3b03	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-15 21:27:27.374+07
c1788c88-e5e4-47a2-8296-f3ced67e4e40	f9180f67-50b2-4957-9238-fadc9f0b3b03	payment_verified	\N	\N	2026-06-15 21:27:29.13015+07
7e2b16dd-9995-41c1-ba76-dbb247ad3855	f9180f67-50b2-4957-9238-fadc9f0b3b03	driver_assigned	\N	\N	2026-06-15 21:27:29.221115+07
eeaae936-07c0-4fe6-aedb-89f5e128bdd1	f9180f67-50b2-4957-9238-fadc9f0b3b03	rejected	\N	\N	2026-06-15 21:42:46.102294+07
9fe01f11-db1e-428c-8b0a-07729a7de9a4	f9180f67-50b2-4957-9238-fadc9f0b3b03	rejected	a1000000-0000-0000-0000-000000000002	\N	2026-06-15 21:42:46.14+07
0748b9e7-4f53-4982-bdf2-11c382f13ef4	ea3e3624-6d8d-4813-b610-020f365e3860	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-15 22:09:25.251+07
e0f63ca8-dcf2-4049-9602-3528ad1c9979	ea3e3624-6d8d-4813-b610-020f365e3860	payment_verified	\N	\N	2026-06-15 22:41:49.887584+07
94dd9c24-be28-413e-aab4-a5b7ad43884b	ea3e3624-6d8d-4813-b610-020f365e3860	driver_assigned	\N	\N	2026-06-15 22:41:50.551211+07
9299f3f6-72d2-428d-aee9-651ce0458412	57f80fbc-0151-4e18-89b1-8b1ea21696d9	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-16 00:18:54.112+07
0c0fa8a4-e931-4e9d-bf4c-b692d7434525	57f80fbc-0151-4e18-89b1-8b1ea21696d9	payment_verified	\N	\N	2026-06-16 00:18:55.635008+07
79e0a636-eda8-4fd1-b3c9-9191f7a2c156	1e90f44e-435f-4df4-a93f-a3305ac42ee2	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-16 00:20:39.415+07
1eeaca78-3210-46ba-b888-c6188fa515b7	1e90f44e-435f-4df4-a93f-a3305ac42ee2	cancelled	\N	\N	2026-06-16 00:20:43.207249+07
b1fa209b-b567-4bca-8640-61b240255f22	0331e1fe-597e-417b-8fed-64ef2b7b862b	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-16 00:33:32.902+07
f3f38f8b-dd08-4f80-a552-254f65abfae5	0331e1fe-597e-417b-8fed-64ef2b7b862b	payment_verified	\N	\N	2026-06-16 00:34:05.310902+07
b33f685f-a47b-46e9-8ec4-50548835c7cb	6ff5ac6b-2238-4544-b8ac-c181e9aa814b	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-16 08:17:16.874+07
7cbecc13-8ae1-44be-9265-2218793c84d9	2cc4e9f5-5525-466b-9b46-e066a75565e4	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-16 08:17:40.918+07
e40394f2-1e81-41e5-b88c-85bbeaa361b0	2cc4e9f5-5525-466b-9b46-e066a75565e4	payment_verified	\N	\N	2026-06-16 08:17:57.938971+07
b3ae3a45-9cca-4500-8267-db747674d588	242639e2-16fc-4ed9-b054-e147c4e957ef	pending_payment	d82778b5-8d2d-4f08-97d8-2620fb87c185	\N	2026-06-16 08:23:27.1+07
cd0d1f39-b81c-4b68-9aaa-ce84fc41db35	242639e2-16fc-4ed9-b054-e147c4e957ef	payment_verified	\N	\N	2026-06-16 08:23:33.293799+07
312329ce-e769-4f11-b3d7-76d101783daa	74f8c252-c86b-4a3e-9f2e-369c23cb336d	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-16 15:00:22.906+07
1d8e37d5-3132-421c-a0cb-4261943a12cb	74f8c252-c86b-4a3e-9f2e-369c23cb336d	payment_verified	\N	\N	2026-06-16 15:00:23.01638+07
05ef34a8-0e34-4908-b0b1-3937f1377e9a	4c37219b-d406-4ef2-8995-04d95506f2bd	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-16 15:01:37.897+07
06cbffa4-8ba0-4154-96ec-07c5e1752253	4c37219b-d406-4ef2-8995-04d95506f2bd	payment_verified	\N	\N	2026-06-16 15:01:37.949568+07
ef7c95ec-5f97-4628-859c-3737abf5eef2	f9180f67-50b2-4957-9238-fadc9f0b3b03	completed	\N	\N	2026-06-16 15:02:03.096559+07
29cf5720-37a0-4999-9c29-d329fd6a613b	ea3e3624-6d8d-4813-b610-020f365e3860	completed	\N	\N	2026-06-16 15:02:03.096559+07
8138d985-026a-45b3-a5fe-586e4e1319fb	57f80fbc-0151-4e18-89b1-8b1ea21696d9	completed	\N	\N	2026-06-16 15:02:03.096559+07
0c026791-2e22-44fc-9f12-c92c77298ed7	679b3d50-13e6-41fe-99cd-f77c94e985ec	completed	\N	\N	2026-06-16 15:02:03.096559+07
536731b1-abda-451f-9630-548e105b520f	0331e1fe-597e-417b-8fed-64ef2b7b862b	completed	\N	\N	2026-06-16 15:02:03.096559+07
991d3148-03c6-4d90-9ebb-034403504b03	6ff5ac6b-2238-4544-b8ac-c181e9aa814b	completed	\N	\N	2026-06-16 15:02:03.096559+07
c6219443-ab75-47e7-a3ce-7248c878cf72	2cc4e9f5-5525-466b-9b46-e066a75565e4	completed	\N	\N	2026-06-16 15:02:03.096559+07
ce3d50f7-2aef-4fe8-8d10-b4d48336fcdd	242639e2-16fc-4ed9-b054-e147c4e957ef	completed	\N	\N	2026-06-16 15:02:03.096559+07
d7928f2e-cfef-490d-8605-be79c75a9263	74f8c252-c86b-4a3e-9f2e-369c23cb336d	completed	\N	\N	2026-06-16 15:02:03.096559+07
49323870-8d38-4bc3-b171-cf89c990c036	194d7b83-35e9-407b-9e0c-80302177c5d9	completed	\N	\N	2026-06-16 15:02:03.096559+07
c780136c-aa10-4c38-bd14-61c5be578bfd	0270641b-228e-4eb7-8ec8-87de27e633b3	completed	\N	\N	2026-06-16 15:02:03.096559+07
73b366fe-bccc-4a8a-88ba-787b1495ff8e	b968d6ef-0a6d-4ac1-9edd-d536d503fbad	completed	\N	\N	2026-06-16 15:02:03.096559+07
95c18b48-4805-48ea-8e48-9e29b92fd1c5	4c37219b-d406-4ef2-8995-04d95506f2bd	completed	\N	\N	2026-06-16 15:02:03.096559+07
6f5d5d1d-894d-4e34-a497-52448ec4541b	0d1677a1-08e8-4b12-841e-d09713cf5791	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-16 15:02:10.041+07
a8fed2c9-e486-4925-9e87-5711efa281a5	0d1677a1-08e8-4b12-841e-d09713cf5791	payment_verified	\N	\N	2026-06-16 15:02:10.087918+07
4570cf4c-8199-485e-a5fe-e17111e8bec9	0d1677a1-08e8-4b12-841e-d09713cf5791	driver_assigned	\N	\N	2026-06-16 15:02:10.158833+07
bb33a5a8-16de-4cb8-8d3d-823622241134	0d1677a1-08e8-4b12-841e-d09713cf5791	accepted	\N	\N	2026-06-16 15:02:10.308951+07
7563dc92-380e-4a52-8ddb-f9f2ed45b706	0d1677a1-08e8-4b12-841e-d09713cf5791	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-16 15:02:10.319+07
41e99a9f-15ef-441f-927c-3cec058cbebd	0d1677a1-08e8-4b12-841e-d09713cf5791	completed	\N	\N	2026-06-16 15:02:10.334947+07
5aa8c9a1-4755-4d6f-851b-1b459255f533	0d1677a1-08e8-4b12-841e-d09713cf5791	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-16 15:02:10.343+07
a97dd8e8-35ae-4726-b1d6-9b9472368c09	288c0ea2-f918-4849-8892-96798a2c5275	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-16 15:04:52.222+07
b60ad07b-3b2b-4853-9b98-7e4ef72c71a9	288c0ea2-f918-4849-8892-96798a2c5275	payment_verified	\N	\N	2026-06-16 15:04:52.28362+07
165b589b-9ea0-49bf-a09a-6a319617a6c9	288c0ea2-f918-4849-8892-96798a2c5275	driver_assigned	\N	\N	2026-06-16 15:04:52.339762+07
b027397a-48dd-4c09-baed-a85e37c16f35	58a43460-0a63-4de5-9b50-34b909bbd3ee	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-16 15:05:11.51+07
4eb7debc-a008-4dbf-9f33-bcabe1357400	58a43460-0a63-4de5-9b50-34b909bbd3ee	payment_verified	\N	\N	2026-06-16 15:05:11.57496+07
6ab30206-43e6-48ea-ac48-5e2e1cd77e5b	58a43460-0a63-4de5-9b50-34b909bbd3ee	driver_assigned	\N	\N	2026-06-16 15:05:11.637335+07
1dd85f11-46f4-4b0c-be47-0b429c825a36	58a43460-0a63-4de5-9b50-34b909bbd3ee	accepted	\N	\N	2026-06-16 15:05:11.804043+07
47adf8d8-8559-4315-aa52-1e7f0e30af98	58a43460-0a63-4de5-9b50-34b909bbd3ee	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-16 15:05:11.825+07
968f567d-6b62-4b87-a2ad-08af366c8b78	58a43460-0a63-4de5-9b50-34b909bbd3ee	completed	\N	\N	2026-06-16 15:05:11.843702+07
3380274a-c516-4e70-b3ec-dc69c7fdb5ef	58a43460-0a63-4de5-9b50-34b909bbd3ee	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-16 15:05:11.85+07
b7c0916d-7d24-499e-9764-a1c2bf3e4bdf	865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	pending_payment	a1000000-0000-0000-0000-000000000005	\N	2026-06-16 15:09:38.275+07
9ca4dc32-0bf3-4843-ae42-1ba52a344625	865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	payment_verified	\N	\N	2026-06-16 15:09:38.353354+07
430c62e5-9d65-4931-91f4-5d461beaac3b	865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	driver_assigned	\N	\N	2026-06-16 15:09:38.423131+07
579bbc20-602b-47cf-b6c9-003706e67e48	865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	accepted	\N	\N	2026-06-16 15:09:38.600638+07
5c64f7f7-f569-4486-a4a9-f37abecd4188	865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-16 15:09:38.609+07
59b44e4a-46ef-444d-9288-e8fec4ae5647	865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	completed	\N	\N	2026-06-16 15:09:38.628275+07
9487efc0-bf2b-4ec1-96e2-09ee0da5f51c	865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-16 15:09:38.63+07
fbcf1442-6484-4b3c-a554-53c070b026f2	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-16 21:37:42.457+07
59590cbd-0854-459f-afad-3720e7d46702	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	payment_verified	\N	\N	2026-06-16 21:37:57.54519+07
4bd31b3c-9dac-4f32-b4f2-5c6d6038435e	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	driver_assigned	\N	\N	2026-06-16 21:37:57.812352+07
e0fdc12d-fd75-4feb-a3c6-418dfab499ad	6ff5ac6b-2238-4544-b8ac-c181e9aa814b	payment_verified	\N	\N	2026-06-17 12:36:02.012632+07
eb65e97d-5bd8-4e26-86d2-bfca2eba6635	1e90f44e-435f-4df4-a93f-a3305ac42ee2	payment_verified	\N	\N	2026-06-17 12:36:02.915451+07
6e24c9d3-8ab7-4665-a267-3bf37dfd5bc4	45a166ca-ae3b-46a4-807e-c65b4aea6616	pending_payment	d82778b5-8d2d-4f08-97d8-2620fb87c185	\N	2026-06-17 21:30:50.463+07
ab570477-6596-433f-af70-8e568afe6f10	45a166ca-ae3b-46a4-807e-c65b4aea6616	payment_verified	\N	\N	2026-06-17 21:31:52.958576+07
1f1be4ce-571e-4586-9a1d-2ee768383af3	207d102f-8365-4e4a-8ebb-8af53b1991f0	pending_payment	d82778b5-8d2d-4f08-97d8-2620fb87c185	\N	2026-06-17 21:33:17.155+07
67f4b309-3520-44a1-84c4-c78e27b28c83	207d102f-8365-4e4a-8ebb-8af53b1991f0	payment_verified	\N	\N	2026-06-17 21:33:27.146051+07
2a82f818-3835-44a0-a88a-086d18aec5ea	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	accepted	\N	\N	2026-06-17 21:41:11.913573+07
12237617-52af-4ba7-8b4d-b823c4fd7f19	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	accepted	a1000000-0000-0000-0000-000000000002	\N	2026-06-17 21:41:11.962+07
bc3cbcf5-e397-4292-a860-e32e550d3957	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	en_route	\N	\N	2026-06-17 21:41:16.567823+07
064b1ab4-9bf8-48e6-97a2-863aa779db41	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	en_route	a1000000-0000-0000-0000-000000000002	\N	2026-06-17 21:41:16.573+07
0f713a18-58c2-4d8f-8c9c-f4d8706dd2e1	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	arrived	\N	\N	2026-06-17 21:41:18.09466+07
0e855671-06ea-4407-b1b1-e24ef522d40f	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	arrived	a1000000-0000-0000-0000-000000000002	\N	2026-06-17 21:41:18.099+07
d0798181-4e67-4c5b-8da2-75cfc5ae5fb2	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	in_progress	\N	\N	2026-06-17 21:41:19.08559+07
9be925e5-aa87-45db-90f2-308f8ee51acd	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	in_progress	a1000000-0000-0000-0000-000000000002	\N	2026-06-17 21:41:19.093+07
56f2141a-bdc9-47d0-97b2-3e8984ef9cbb	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	completed	\N	\N	2026-06-17 21:41:20.445351+07
2c9c06ca-f03b-4443-9a8a-b06f853771e9	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	completed	a1000000-0000-0000-0000-000000000002	\N	2026-06-17 21:41:20.458+07
dc1ad72e-38f7-4327-88ac-6a4cc7dc4ad1	1e90f44e-435f-4df4-a93f-a3305ac42ee2	driver_assigned	\N	\N	2026-06-17 21:41:20.481479+07
cc659b2b-8731-45ac-88a5-111bb1dddab0	1e90f44e-435f-4df4-a93f-a3305ac42ee2	rejected	\N	\N	2026-06-17 21:41:30.439501+07
904e9147-6c05-4f38-b7b6-6a174f78a41e	1e90f44e-435f-4df4-a93f-a3305ac42ee2	rejected	a1000000-0000-0000-0000-000000000002	\N	2026-06-17 21:41:30.451+07
0e7cf455-d8d9-4f4e-a725-ced5791f91a5	1cfe9cec-85bf-450c-9534-29442d6befbe	pending_payment	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	2026-06-19 09:52:09.158+07
cee9dba6-3fae-4ccf-b59c-5f8d21cbcf7b	1cfe9cec-85bf-450c-9534-29442d6befbe	payment_verified	\N	\N	2026-06-19 09:52:34.139404+07
adc6294f-e8d9-47cf-86ce-db2e41bea7f7	1cfe9cec-85bf-450c-9534-29442d6befbe	driver_assigned	\N	\N	2026-06-19 09:52:35.039096+07
dc980a32-1122-4ad5-a301-f3ebe85ab9c4	243050da-4d69-4947-9dba-cd3fe618d215	pending_payment	d82778b5-8d2d-4f08-97d8-2620fb87c185	\N	2026-06-19 15:08:25.107+07
900c6822-56d2-4040-be58-76cb6a5aa121	f4996c1a-463d-4ff6-b51e-627d1cbefa1a	pending_payment	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	2026-06-20 15:50:07.975+07
55e997b8-70f8-4207-bd01-6361537f32d1	f4996c1a-463d-4ff6-b51e-627d1cbefa1a	payment_verified	\N	\N	2026-06-20 15:50:49.285119+07
0ae6169d-ba87-4697-b825-2a7518ef26c6	2cdc684d-0ebf-4e80-964d-ffb74e9bf291	pending_payment	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	2026-06-20 15:58:53.411+07
e435409b-fc03-4358-926f-2f6997502bba	2cdc684d-0ebf-4e80-964d-ffb74e9bf291	cancelled	\N	\N	2026-06-20 16:00:24.757275+07
0565e8fb-6ba8-4265-87b6-15ffe975e483	77bca187-d2b5-4003-b267-3e72909133da	pending_payment	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	2026-06-20 16:01:37.709+07
87f03d9c-15c7-4a3a-9608-6a625b68960c	19fef570-5140-4671-af4b-12a51339a50a	pending_payment	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	2026-06-20 16:50:03.807+07
09ae91cd-6d84-40cf-9e45-7492a44c5118	19fef570-5140-4671-af4b-12a51339a50a	payment_verified	\N	\N	2026-06-20 16:58:36.391673+07
400a5e02-d5b4-4e37-badb-1c254d479bc5	77bca187-d2b5-4003-b267-3e72909133da	cancelled	\N	\N	2026-06-20 17:02:37.03701+07
188350cd-1629-4903-9e10-355918fbe797	77bca187-d2b5-4003-b267-3e72909133da	payment_verified	\N	\N	2026-06-20 17:11:34.836055+07
31a50845-85e8-46cc-8810-4c4491700a8a	83d525b0-f11e-4987-ae33-5c8fd87ee4ca	pending_payment	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	2026-06-20 18:07:10.636+07
5d766d30-7007-4658-a93c-8dc651cb49bd	83d525b0-f11e-4987-ae33-5c8fd87ee4ca	payment_verified	\N	\N	2026-06-20 20:40:40.318056+07
11a8e3a1-e662-41fb-93ec-50bfcf6a20fa	04a196f1-d438-452e-ae6a-40268de1d4eb	pending_payment	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	2026-06-20 20:43:19.185+07
b0dc1081-6fc0-4f74-8b5f-37d3b92f6fcc	1e90f44e-435f-4df4-a93f-a3305ac42ee2	driver_assigned	\N	\N	2026-06-20 17:27:24.469287+07
8ebaad14-ec40-46ef-bcd9-892c8a48d8a8	83d525b0-f11e-4987-ae33-5c8fd87ee4ca	driver_assigned	\N	\N	2026-06-20 20:49:35.425131+07
44d1537e-7603-4410-a22b-d10e56ef951f	243050da-4d69-4947-9dba-cd3fe618d215	cancelled	\N	\N	2026-06-20 20:54:02.146276+07
550310a6-f5e4-4a7c-abbe-7b75daeed111	2bad961f-a9e9-48ff-9409-8bdd118900c3	pending_payment	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	2026-06-20 21:07:16.299+07
44e96cb8-2bf5-4c51-9b77-2de548b4f288	2bad961f-a9e9-48ff-9409-8bdd118900c3	payment_verified	\N	\N	2026-06-20 21:09:17.590773+07
d98ee6fe-ee4d-49d8-9f8c-500ce1f1d5cb	6ff5ac6b-2238-4544-b8ac-c181e9aa814b	driver_assigned	\N	\N	2026-06-20 17:33:16.781695+07
263b1f19-a79d-480c-870f-e81682c2b350	2bad961f-a9e9-48ff-9409-8bdd118900c3	driver_assigned	\N	\N	2026-06-21 19:09:32.558223+07
878e3cf5-09c6-4601-8eed-1282feaa8e7c	45a166ca-ae3b-46a4-807e-c65b4aea6616	driver_assigned	\N	\N	2026-06-20 17:36:07.77815+07
a4534e67-82f8-4640-a519-e87dfe80aa0b	207d102f-8365-4e4a-8ebb-8af53b1991f0	driver_assigned	\N	\N	2026-06-20 17:47:19.687802+07
31506249-34ce-4a59-a504-f1c93e4a89b6	f4996c1a-463d-4ff6-b51e-627d1cbefa1a	driver_assigned	\N	\N	2026-06-20 17:49:34.565265+07
2ff089a4-1de8-43ca-825a-bd9f31244cc5	77bca187-d2b5-4003-b267-3e72909133da	driver_assigned	\N	\N	2026-06-20 17:57:33.174713+07
457b1945-1564-4962-bd59-8d10c3d4563b	19fef570-5140-4671-af4b-12a51339a50a	driver_assigned	\N	\N	2026-06-20 18:01:47.499834+07
655e75a5-91af-41ea-9960-0ede897fbeb5	9fe54c5f-e154-445e-bb70-b27296a94cd9	pending_payment	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	2026-06-20 18:05:25.601+07
\.


--
-- TOC entry 5215 (class 0 OID 17562)
-- Dependencies: 224
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, traveler_id, driver_id, vehicle_id, route_id, package_id, booking_type, status, pickup_location, dropoff_location, pickup_time, total_fare, notes, created_at, updated_at, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, distance_km, duration_mins) FROM stdin;
e1000000-0000-0000-0000-000000000001	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	c1000000-0000-0000-0000-000000000001	\N	intercity	completed	Toul Kork, Phnom Penh	Pub Street, Siem Reap	2026-06-11 15:30:42.491888+07	25.00	\N	2026-06-14 15:30:42.491888+07	2026-06-14 15:30:42.491888+07	\N	\N	\N	\N	\N	\N
1cfe9cec-85bf-450c-9534-29442d6befbe	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	driver_assigned	Street 318, Sangkat Tuol Svay Prey Ti Pir, Khan Boeng Keng Kang, Phnom Penh, 120107, Cambodia	Koh Norea, Sangkat Chbar Ampov Ti Pir, Khan Chbar Ampov, Phnom Penh, 121202, Cambodia	2026-06-18 09:52:00+07	5.76		2026-06-19 09:52:09.054+07	2026-06-19 09:52:35.039096+07	11.55280152	104.90928849	11.54956397	104.94955035	5.56	7
6169f21a-5865-44a8-8773-57377491c668	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	National Highway 6, Phum Khtor, Sangkat Prek Liep, Khan Chroy Changvar, Phnom Penh, 121002, Cambodia	Phum Kandal, Sangkat Cheung Aek, Khan Dangkao, Phnom Penh, 120508, Cambodia	2026-06-19 22:30:00+07	15.96	please wait for me outside	2026-06-15 21:18:53.519+07	2026-06-15 21:22:01.831075+07	\N	\N	\N	\N	\N	\N
dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	Cadt	Aeon Meanchey	2026-06-02 16:04:00+07	8.00	please wait for me outside the school	2026-06-14 16:04:36.742+07	2026-06-14 16:13:03.424529+07	\N	\N	\N	\N	\N	\N
9fe54c5f-e154-445e-bb70-b27296a94cd9	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	\N	\N	\N	intercity	pending_payment	Baray Tirk Tla	Kirirom, Kompot	2026-06-09 10:30:00+07	70.00	Bespoke Custom Trip Request #dafa363d-c2ae-40bd-8c91-5bcb6767636a	2026-06-20 18:05:25.581+07	2026-06-20 18:05:25.581+07	\N	\N	\N	\N	\N	\N
04a196f1-d438-452e-ae6a-40268de1d4eb	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	\N	\N	\N	intercity	pending_payment	Baray Tirk Tla	Kirirom, Kompot	2026-06-09 10:30:00+07	70.00	Bespoke Custom Trip Request #dafa363d-c2ae-40bd-8c91-5bcb6767636a	2026-06-20 20:43:19.124+07	2026-06-20 20:43:19.124+07	\N	\N	\N	\N	\N	\N
1e90f44e-435f-4df4-a93f-a3305ac42ee2	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	\N	c1000000-0000-0000-0000-000000000003	\N	intercity	driver_assigned	Exhibition Street, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia	Exhibition Street, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia	2026-06-18 00:20:00+07	15.00	\N	2026-06-16 00:20:39.394+07	2026-06-20 17:27:24.520772+07	\N	\N	\N	\N	\N	\N
45324760-571a-4b6a-9c1b-c529bfd41471	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	Cadt	Aeon MeanChey	2026-06-20 08:54:00+07	8.00	wait for me outside the school	2026-06-14 19:55:24.533+07	2026-06-14 19:59:02.40235+07	\N	\N	\N	\N	\N	\N
2bad961f-a9e9-48ff-9409-8bdd118900c3	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	\N	\N	\N	city_ride	driver_assigned	SPACElogic Gallery, No. 5, Street 252, Sangkat Boeng Reang, Khan Daun Penh, Phnom Penh, 120204, Cambodia	Phum Trapeang Chrey, Sangkat Kakab 2, Khan Pou Senchey, Phnom Penh, 120913, Cambodia	2026-06-17 21:06:00+07	12.20	please give me a good taxi service	2026-06-20 21:07:16.221+07	2026-06-21 19:09:32.621425+07	11.55706214	104.92232037	11.55941666	104.82630770	13.84	20
2662755e-6641-4296-9ae4-50cf86d7e4f4	a1000000-0000-0000-0000-000000000004	\N	\N	\N	\N	city_ride	cancelled	Newton Sreet, Elite Town III, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia	Elite Town III, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia	2026-06-05 08:20:00+07	8.00		2026-06-14 20:20:48.615+07	2026-06-14 21:31:39.379334+07	\N	\N	\N	\N	\N	\N
90007974-66f4-44fc-9ae5-318423187a09	a1000000-0000-0000-0000-000000000004	\N	\N	\N	\N	city_ride	cancelled	Sangkat Stueng Mean Chey 3, Khan Mean Chey, Phnom Penh, 120605, Cambodia	Preah Monivong Boulevard (Street 93), Boeung Trabek, Sangkat Phsar Daeum Thkov, Khan Chamkar Mon, Phnom Penh, 120112, Cambodia	2026-06-03 09:16:00+07	8.00		2026-06-14 20:16:08.301+07	2026-06-14 21:31:46.66269+07	\N	\N	\N	\N	\N	\N
f69a578e-3169-4ea0-b79e-917e67fac614	a1000000-0000-0000-0000-000000000004	\N	\N	\N	\N	city_ride	cancelled	Embassy of Singapore, 129, Preah Norodom Boulevard (Street 41), Sangkat Chaktomuk, Khan Daun Penh, Phnom Penh, 120207, Cambodia	Pencil Shopping Center, Preah Sisowath Quay (Street 1), Sangkat Chaktomuk, Khan Daun Penh, Phnom Penh, 120207, Cambodia	2026-06-26 20:18:00+07	8.00		2026-06-14 20:18:03.981+07	2026-06-14 21:31:51.053447+07	\N	\N	\N	\N	\N	\N
c9706437-79f7-47e6-9b0b-63f9728933d1	a1000000-0000-0000-0000-000000000004	\N	\N	\N	\N	city_ride	cancelled	Tonle Sap Street, Sangkat Chroy Changvar, Khan Chroy Changvar, Phnom Penh, 121001, Cambodia	Kampuchea Krom Boulevard (Street 128), Sangkat Monourom, Khan Prampir Makara, Phnom Penh, 120305, Cambodia	2026-06-17 20:22:00+07	5.45		2026-06-14 20:22:41.11+07	2026-06-14 22:12:23.014775+07	\N	\N	\N	\N	\N	\N
f4996c1a-463d-4ff6-b51e-627d1cbefa1a	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	\N	\N	\N	city_ride	driver_assigned	Phum Damnak Thom, Sangkat Stueng Mean Chey 2, Khan Mean Chey, Phnom Penh, 120604, Cambodia	Koh Norea, Sangkat Veal Sbov, Khan Chbar Ampov, Phnom Penh, 121205, Cambodia	2026-06-21 07:30:00+07	9.04	Please wait me outside as you arrived	2026-06-20 15:50:07.888+07	2026-06-20 17:49:34.617109+07	11.53275892	104.89624294	11.54373347	104.96189125	9.81	14
57f80fbc-0151-4e18-89b1-8b1ea21696d9	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	\N	\N	\N	city_ride	completed	Street 211, Sangkat Veal Vong, Khan Prampir Makara, Phnom Penh, 120307, Cambodia	The Plaza Street, Sangkat Veal Vong, Khan Prampir Makara, Phnom Penh, 120307, Cambodia	2026-06-12 00:18:00+07	2.00		2026-06-16 00:18:53.999+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
6c967d7f-e8d2-4f96-8bcd-a19dafff714c	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	Psa Ler	Cadt	2026-06-20 08:05:00+07	8.00	be quick	2026-06-14 20:03:04.632+07	2026-06-14 22:25:21.507127+07	\N	\N	\N	\N	\N	\N
e1000000-0000-0000-0000-000000000002	a1000000-0000-0000-0000-000000000005	\N	\N	\N	\N	city_ride	cancelled	BKK1, Phnom Penh	Russian Market, Phnom Penh	2026-06-14 17:30:42.491888+07	8.00	\N	2026-06-14 15:30:42.491888+07	2026-06-14 22:40:25.03017+07	\N	\N	\N	\N	\N	\N
ad7d67ef-1c20-4716-bbc1-3589c91b28e6	a1000000-0000-0000-0000-000000000005	\N	\N	\N	\N	city_ride	cancelled	#467C, Street 310, Sangkat Boeng Keng Kang Ti Pir, Khan Boeng Keng Kang, Phnom Penh, 120103, Cambodia	Embassy of Pakistan, Street 310, Sangkat Boeng Keng Kang Ti Muoy, Khan Boeng Keng Kang, Phnom Penh, 120102, Cambodia	2026-06-14 22:44:00+07	2.14		2026-06-14 22:43:45.488+07	2026-06-14 22:46:37.775762+07	\N	\N	\N	\N	\N	\N
69e93538-6e2a-4b92-b15e-6f3aa15e4f9d	a1000000-0000-0000-0000-000000000005	\N	\N	\N	\N	city_ride	cancelled	Amazon, Street 199, Sangkat Tomnop Teuk, Khan Boeng Keng Kang, Phnom Penh, 120108, Cambodia	Mekong Promenade, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia	2026-06-11 22:41:00+07	4.18		2026-06-14 22:41:56.36+07	2026-06-14 22:47:09.677641+07	\N	\N	\N	\N	\N	\N
77bca187-d2b5-4003-b267-3e72909133da	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	\N	\N	\N	city_ride	driver_assigned	Talk Coffee, 35, Street 199, Sangkat Tomnop Teuk, Khan Boeng Keng Kang, Phnom Penh, 120108, Cambodia	Samdech Preah Sihanouk Boulevard (Street 274), Sangkat Boeng Reang, Khan Daun Penh, Phnom Penh, 120204, Cambodia	2026-06-20 18:01:00+07	3.42		2026-06-20 16:01:37.695+07	2026-06-20 17:57:33.229587+07	11.54945184	104.90551184	11.55596896	104.92070693	2.50	3
7d472b5f-2150-4801-8e64-31e33a493b55	a1000000-0000-0000-0000-000000000005	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	Samdech Preah Sihanouk Boulevard (Street 274), Sangkat Boeng Prolit, Khan Prampir Makara, Phnom Penh, 120308, Cambodia	First Investment Specialized Bank, Preah Norodom Boulevard (Street 41), Sangkat Boeng Keng Kang Ti Muoy, Khan Boeng Keng Kang, Phnom Penh, 120102, Cambodia	2026-06-11 00:40:00+07	2.53		2026-06-14 22:40:48.996+07	2026-06-14 22:51:47.322652+07	\N	\N	\N	\N	\N	\N
59a825de-0804-4d70-a01f-afead04b1b0f	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	Oknha Tep Phan (Street 182), Sangkat Phsar Depou Ti Bei, Khan Toul Kork, Phnom Penh, 120403, Cambodia	Wat Botum, Oknha Suor Srun (Street 7), Sangkat Chaktomuk, Khan Daun Penh, Phnom Penh, 120207, Cambodia	2026-06-12 23:10:00+07	4.46		2026-06-14 23:08:37.529+07	2026-06-14 23:10:25.863064+07	\N	\N	\N	\N	\N	\N
f9180f67-50b2-4957-9238-fadc9f0b3b03	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	\N	c1000000-0000-0000-0000-000000000003	\N	intercity	completed	Olympic Market, Street 310, Sangkat Olympic, Khan Boeng Keng Kang, Phnom Penh, 120105, Cambodia	Street 173, Sangkat Olympic, Khan Boeng Keng Kang, Phnom Penh, 120105, Cambodia	2026-06-19 21:29:00+07	15.00	\N	2026-06-15 21:27:27.343+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
ea3e3624-6d8d-4813-b610-020f365e3860	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	c1000000-0000-0000-0000-000000000001	\N	intercity	completed	Phum Prey Sa, Sangkat Prey Sa, Khan Dangkao, Phnom Penh, 120504, Cambodia	Sangkat Kbal Koh, Khan Chbar Ampov, Phnom Penh, 121207, Cambodia	2026-06-19 22:09:00+07	25.00	\N	2026-06-15 22:09:25.074+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
679b3d50-13e6-41fe-99cd-f77c94e985ec	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000003	b1000000-0000-0000-0000-000000000002	\N	\N	city_ride	completed	39, Oknha Nou Kan (Street 105), Sangkat Boeng Prolit, Khan Prampir Makara, Phnom Penh, 120308, Cambodia	cadt	2026-06-10 20:11:00+07	8.00	fast	2026-06-14 20:10:39.498+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
0331e1fe-597e-417b-8fed-64ef2b7b862b	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	\N	\N	\N	city_ride	completed	Samsung, Preah Monivong Boulevard (Street 93), Sangkat Boeng Reang, Khan Daun Penh, Phnom Penh, 120204, Cambodia	Street 232, Sangkat Boeng Prolit, Khan Prampir Makara, Phnom Penh, 120308, Cambodia	2026-06-11 00:33:00+07	2.00		2026-06-16 00:33:32.824+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
2cc4e9f5-5525-466b-9b46-e066a75565e4	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	\N	\N	\N	city_ride	completed	71, Street 223, Sangkat Phsar Daeum Kor, Khan Boeng Keng Kang, Phnom Penh, 120409, Cambodia	Phsar Kapko, Ke Nou (Street 9), Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia	2026-06-18 08:17:00+07	3.81		2026-06-16 08:17:40.83+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
242639e2-16fc-4ed9-b054-e147c4e957ef	d82778b5-8d2d-4f08-97d8-2620fb87c185	\N	\N	\N	d1000000-0000-0000-0000-000000000003	package	completed	Cadt	Aeon Mall Meanchey	2026-07-17 10:23:00+07	60.00	\N	2026-06-16 08:23:26.95+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
74f8c252-c86b-4a3e-9f2e-369c23cb336d	a1000000-0000-0000-0000-000000000005	\N	\N	\N	\N	city_ride	completed	Russian Market, Phnom Penh	Vattanac Capital, Phnom Penh	2026-06-16 16:00:22.609+07	3.53	\N	2026-06-16 15:00:22.843+07	2026-06-16 15:02:03.096559+07	11.55640000	104.92820000	11.57610000	104.92300000	2.60	4
194d7b83-35e9-407b-9e0c-80302177c5d9	a1000000-0000-0000-0000-000000000004	\N	\N	\N	\N	city_ride	completed	Ministry of Tourism, Czech Republic Boulevard (Street 169), Sangkat Orussey Ti Pir, Khan Prampir Makara, Phnom Penh, 120302, Cambodia	Preah Ang Non (Street 102), Boeung Kak Community, Sangkat Wat Phnom, Khan Daun Penh, Phnom Penh, 120210, Cambodia	2026-06-25 22:20:00+07	3.06	please be quick	2026-06-14 22:20:34.484+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
0270641b-228e-4eb7-8ec8-87de27e633b3	a1000000-0000-0000-0000-000000000005	\N	\N	\N	\N	city_ride	completed	Bake and Bake Bakery, 06b, Street 440, Boeung Trabek, Sangkat Tuol Tumpung Ti Muoy, Khan Chamkar Mon, Phnom Penh, 120112, Cambodia	Bake and Bake Bakery, 06b, Street 440, Boeung Trabek, Sangkat Tuol Tumpung Ti Muoy, Khan Chamkar Mon, Phnom Penh, 120112, Cambodia	2026-06-06 22:47:00+07	2.00		2026-06-14 22:47:33.991+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
b968d6ef-0a6d-4ac1-9edd-d536d503fbad	a1000000-0000-0000-0000-000000000004	\N	\N	c1000000-0000-0000-0000-000000000001	\N	intercity	completed	Siem Reap	Phnom Penh	2026-03-31 14:03:00+07	25.00	\N	2026-06-14 22:04:53.805+07	2026-06-16 15:02:03.096559+07	\N	\N	\N	\N	\N	\N
4c37219b-d406-4ef2-8995-04d95506f2bd	a1000000-0000-0000-0000-000000000005	\N	\N	\N	\N	city_ride	completed	Russian Market, Phnom Penh	Vattanac Capital, Phnom Penh	2026-06-16 16:01:37.604+07	3.53	\N	2026-06-16 15:01:37.881+07	2026-06-16 15:02:03.096559+07	11.55640000	104.92820000	11.57610000	104.92300000	2.60	4
2cdc684d-0ebf-4e80-964d-ffb74e9bf291	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	\N	c1000000-0000-0000-0000-000000000002	\N	intercity	cancelled	Cadt	Aeon 3 Meanchey	2026-06-25 07:00:00+07	20.00	\N	2026-06-20 15:58:53.324+07	2026-06-20 16:00:24.757275+07	\N	\N	\N	\N	\N	\N
0d1677a1-08e8-4b12-841e-d09713cf5791	a1000000-0000-0000-0000-000000000005	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	Russian Market, Phnom Penh	Vattanac Capital, Phnom Penh	2026-06-16 16:02:09.737+07	3.53	\N	2026-06-16 15:02:10.029+07	2026-06-16 15:02:10.334947+07	11.55640000	104.92820000	11.57610000	104.92300000	2.60	4
19fef570-5140-4671-af4b-12a51339a50a	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	\N	\N	\N	city_ride	driver_assigned	Yothapol Khemarak Phoumin Boulevard (Street 271), Phum Prek Toal, Sangkat Boeng Tumpun 1, Khan Mean Chey, Phnom Penh, 120604, Cambodia	Koh Pich - Koh Norea Bridge, Park Avenue, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia	2026-06-10 16:49:00+07	7.45		2026-06-20 16:50:03.721+07	2026-06-20 18:01:47.578216+07	11.54360733	104.90405081	11.55151211	104.94625462	7.82	10
288c0ea2-f918-4849-8892-96798a2c5275	a1000000-0000-0000-0000-000000000005	a1000000-0000-0000-0000-000000000003	b1000000-0000-0000-0000-000000000002	\N	\N	city_ride	driver_assigned	Russian Market, Phnom Penh	Vattanac Capital, Phnom Penh	2026-06-16 16:04:51.865+07	3.53	\N	2026-06-16 15:04:52.141+07	2026-06-16 15:04:52.339762+07	11.55640000	104.92820000	11.57610000	104.92300000	2.60	4
58a43460-0a63-4de5-9b50-34b909bbd3ee	a1000000-0000-0000-0000-000000000005	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	Russian Market, Phnom Penh	Vattanac Capital, Phnom Penh	2026-06-16 16:05:11.209+07	3.53	\N	2026-06-16 15:05:11.488+07	2026-06-16 15:05:11.843702+07	11.55640000	104.92820000	11.57610000	104.92300000	2.60	4
83d525b0-f11e-4987-ae33-5c8fd87ee4ca	8ccc42fa-4598-4e06-8669-0dc5532d036f	\N	\N	\N	\N	intercity	driver_assigned	Baray Tirk Tla	Kirirom, Kompot	2026-06-09 10:30:00+07	70.00	Bespoke Custom Trip Request #dafa363d-c2ae-40bd-8c91-5bcb6767636a	2026-06-20 18:07:10.624+07	2026-06-20 20:49:35.506795+07	\N	\N	\N	\N	\N	\N
865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	a1000000-0000-0000-0000-000000000005	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	\N	city_ride	completed	Russian Market, Phnom Penh	Vattanac Capital, Phnom Penh	2026-06-16 16:09:37.984+07	3.53	\N	2026-06-16 15:09:38.248+07	2026-06-16 15:09:38.628275+07	11.55640000	104.92820000	11.57610000	104.92300000	2.60	4
6ff5ac6b-2238-4544-b8ac-c181e9aa814b	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	\N	\N	\N	\N	city_ride	driver_assigned	LEEKAJA Beauty Salon Olympia Branch, S1-06-07, Charles De Gaulle Boulevard (Street 217), Sangkat Veal Vong, Khan Prampir Makara, Phnom Penh, 120307, Cambodia	ANANA Computer, 95, Preah Norodom Boulevard (Street 41), Phnom Penh, Khan Daun Penh, Phnom Penh, 120203, Cambodia	2026-06-11 08:17:00+07	2.81		2026-06-16 08:17:16.829+07	2026-06-20 17:33:16.862244+07	\N	\N	\N	\N	\N	\N
243050da-4d69-4947-9dba-cd3fe618d215	d82778b5-8d2d-4f08-97d8-2620fb87c185	\N	\N	\N	\N	city_ride	cancelled	Street 205, Sangkat Tuol Svay Prey Ti Pir, Khan Boeng Keng Kang, Phnom Penh, 120107, Cambodia	Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia	2026-06-12 15:07:00+07	4.22		2026-06-19 15:08:25.011+07	2026-06-20 20:54:02.146276+07	11.55396012	104.90700294	11.55631467	104.93790820	3.59	4
824eea8e-75a5-4c9b-b7d6-f0ecac050d61	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	a1000000-0000-0000-0000-000000000002	b1000000-0000-0000-0000-000000000001	\N	d1000000-0000-0000-0000-000000000003	package	completed	cadrt	aeon 3	2026-06-18 08:00:00+07	60.00	\N	2026-06-16 21:37:42.223+07	2026-06-17 21:41:20.445351+07	\N	\N	\N	\N	\N	\N
45a166ca-ae3b-46a4-807e-c65b4aea6616	d82778b5-8d2d-4f08-97d8-2620fb87c185	\N	\N	\N	\N	city_ride	driver_assigned	Jawaharlal Nehru Boulevard (Street 215), Sangkat Veal Vong, Khan Prampir Makara, Phnom Penh, 120307, Cambodia	75, Oknha Peich (Street 242), Sangkat Boeng Reang, Khan Daun Penh, Phnom Penh, 120204, Cambodia	2026-06-18 21:29:00+07	3.21		2026-06-17 21:30:50.363+07	2026-06-20 17:36:07.832617+07	11.55840758	104.90829604	11.55718827	104.92138785	2.21	3
207d102f-8365-4e4a-8ebb-8af53b1991f0	d82778b5-8d2d-4f08-97d8-2620fb87c185	\N	\N	\N	d1000000-0000-0000-0000-000000000001	package	driver_assigned	cadt	Aeon 3	2026-06-10 21:33:00+07	150.00	\N	2026-06-17 21:33:17.066+07	2026-06-20 17:47:19.769822+07	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5217 (class 0 OID 17643)
-- Dependencies: 226
-- Data for Name: custom_trip_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_trip_requests (id, traveler_id, origin, destination, travel_date, passengers, special_requests, status, admin_note, quoted_price, created_at, updated_at, traveler_response, telegram_contact, is_urgent_requested, travel_time) FROM stdin;
e9661d5c-b07a-4b1c-b8fe-67d3a5696fb9	d82778b5-8d2d-4f08-97d8-2620fb87c185	SR	PP, RK	2026-06-10	7	i want to SUV	rejected	\N	\N	2026-06-19 15:11:32.812+07	2026-06-20 17:42:25.401465+07	\N	@lenn	t	10:01
e4398060-48ce-4376-a558-b330bdf02dfb	a1000000-0000-0000-0000-000000000005	Phnom Penh (CADT Campus)	Siem Reap (Angkor Wat)	2026-07-20	4	Require a VIP minivan with Wi-Fi and cold water.	rejected	\N	\N	2026-06-16 16:32:32.516+07	2026-06-16 16:36:26.47099+07	Confirm pickup at CADT Campus main entrance at 8:00 AM, and dropoff at Angkor Wat main ticket office.	@james_traveler	f	08:00
0ff44abd-f0ed-41fe-8599-de96fc84f710	d82778b5-8d2d-4f08-97d8-2620fb87c185	Kompot	Pub Street	2026-07-15	15	i want a modern car 	approved	thanks you for requesting, and please fill in the info	300.00	2026-06-17 21:35:07.978+07	2026-06-17 21:37:31.376999+07	\N	@bopha	t	08:30
aff60776-dacd-48cc-925c-e0994c3d5ad0	a1000000-0000-0000-0000-000000000005	Phnom Penh (CADT Campus)	Siem Reap (Angkor Wat)	2026-07-20	4	Require a VIP minivan with Wi-Fi and cold water.	rejected	\N	\N	2026-06-16 16:56:59.124+07	2026-06-17 21:42:46.955808+07	\N	\N	f	08:00
99c638d2-fb36-45cb-93aa-aa63af498855	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Cambodian handicraft association for young women with disabilities, 28, Street 330, Sangkat Boeng Keng Kang Ti Bei, Khan Boeng Keng Kang	Koh Pich	2026-06-10	1	i would like a modern vehicle please	approved	thanks	300.00	2026-06-16 16:34:52.69+07	2026-06-17 21:52:33.330005+07	hi\n	@bopha	f	02:34
4675701d-d5c8-4fb9-bc58-222bf7d3fad3	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	BKK, PP	Pub Street	2026-06-09	2	I like a modern car 	pending	\N	\N	2026-06-19 09:39:44.079+07	2026-06-19 09:39:44.079+07	\N	@lennn	t	10:30
dafa363d-c2ae-40bd-8c91-5bcb6767636a	8ccc42fa-4598-4e06-8669-0dc5532d036f	Baray Tirk Tla	Kirirom, Kompot	2026-06-09	15	i expected a 24 bus car	approved	thanks for requesting 	70.00	2026-06-20 17:51:35.037+07	2026-06-20 18:05:26.660513+07		@kaka	t	10:30
5a663876-e88a-43cb-b4c3-e7d9305e78d0	8ccc42fa-4598-4e06-8669-0dc5532d036f	Street 328, Sangkat Tuol Svay Prey Ti Pir, Khan Boeng Keng Kang, Phnom Penh, 120107, Cambodia	Pub Street, Baray  Siem Reap 	2026-06-18	25		approved	thanlk u	40.00	2026-06-20 17:18:29.92+07	2026-06-20 17:50:03.420838+07	cadt 	@lenn	t	20:21
b9098e4c-89c5-4285-a9d7-e438b05f9e26	8ccc42fa-4598-4e06-8669-0dc5532d036f	SR	PP, Keb, 	2026-06-01	12		pending	\N	\N	2026-06-20 20:44:16.949+07	2026-06-20 20:44:16.949+07	\N	@kaka	t	10:30
f106c7f4-5430-4ebc-bd2a-60ab1671b1a3	d82778b5-8d2d-4f08-97d8-2620fb87c185	SR	Kirirom, Keb	2026-06-02	15	please ensure me with a smooth service 	pending	\N	\N	2026-06-20 20:54:39.357+07	2026-06-20 20:54:39.357+07	\N	@nysaaaaaMm	t	10:30
\.


--
-- TOC entry 5219 (class 0 OID 17703)
-- Dependencies: 228
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, message, is_read, created_at, updated_at) FROM stdin;
2d8da8ec-4f9d-4ce6-b55d-bd61c3206a2b	8ccc42fa-4598-4e06-8669-0dc5532d036f	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-20 21:09:17.590773+07	2026-06-20 21:09:17.590773+07
d75b9198-21b7-4034-809a-13f1cf9a32c7	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler Sreylenn Seat paid $12.20 via Stripe for ride #2bad961f-a9e9-48ff-9409-8bdd118900c3.	f	2026-06-20 21:09:17.977+07	2026-06-20 21:09:17.977+07
9dfb7565-a0da-4a28-9a5c-15fc8f3ab3b1	a1000000-0000-0000-0000-000000000004	Booking Confirmed	Your trip to Siem Reap has been completed.	t	2026-06-14 15:30:42.561145+07	2026-06-14 17:53:22.511196+07
090f7987-5aab-42d8-ae9b-9ab2a3a8d2ce	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	t	2026-06-14 16:10:45.851992+07	2026-06-14 17:53:24.245104+07
bcf72633-d2ac-47dd-ba08-a94ccdd9ee4d	a1000000-0000-0000-0000-000000000004	Driver Accepted	Your driver has accepted the booking. Get ready!	t	2026-06-14 16:12:55.242709+07	2026-06-14 17:53:25.728161+07
b7c4e4e4-ed19-432e-91b8-68403827ca82	a1000000-0000-0000-0000-000000000004	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	t	2026-06-14 16:13:03.424529+07	2026-06-14 17:53:26.214533+07
38e3dbfc-e068-40cf-8e42-bed85c8242eb	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-14 19:57:02.522162+07	2026-06-14 19:57:02.522162+07
369587a3-b17a-470b-8ef3-fc99be69053f	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from Cadt to Aeon MeanChey.	t	2026-06-14 19:57:02.681+07	2026-06-14 19:58:45.223083+07
5fc47042-0446-4759-976a-1caa218415ab	a1000000-0000-0000-0000-000000000004	Driver Accepted	Your driver has accepted the booking. Get ready!	f	2026-06-14 19:58:54.35341+07	2026-06-14 19:58:54.35341+07
d56e2343-b197-4f71-8039-c7faceda0632	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from Psa Ler to Cadt.	f	2026-06-14 20:04:02.669+07	2026-06-14 20:04:02.669+07
e5158e5a-027b-469a-99e9-80a53dff2e62	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	t	2026-06-14 20:04:02.520954+07	2026-06-14 20:04:56.545496+07
b420e74a-ec54-4102-9d57-bb9bb835c6b9	a1000000-0000-0000-0000-000000000004	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	t	2026-06-14 19:59:02.40235+07	2026-06-14 20:04:58.456153+07
696ddd9f-d9cd-446f-b372-8607ad8ab666	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-14 20:10:43.228748+07	2026-06-14 20:10:43.228748+07
18669390-62a0-4344-ba85-e81a0198093d	a1000000-0000-0000-0000-000000000003	New Booking Assigned	You have been assigned to a new booking (city_ride) from 39, Oknha Nou Kan (Street 105), Sangkat Boeng Prolit, Khan Prampir Makara, Phnom Penh, 120308, Cambodia to cadt.	f	2026-06-14 20:10:43.403+07	2026-06-14 20:10:43.403+07
0e9059b6-f43d-41b5-837e-89bbfe703945	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-14 20:16:10.663834+07	2026-06-14 20:16:10.663834+07
dac3d752-1685-45f9-a4fd-8a0d1a03110a	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-14 20:18:06.989827+07	2026-06-14 20:18:06.989827+07
bed0fb2b-da38-4db9-bf66-35d770227a61	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	t	2026-06-14 20:20:51.04639+07	2026-06-14 21:33:35.750801+07
f7278a14-e5ef-4888-91ae-683a212816b6	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-14 22:05:00.159638+07	2026-06-14 22:05:00.159638+07
66ebe336-63ee-470e-a6d5-296a87615cb1	a1000000-0000-0000-0000-000000000004	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	t	2026-06-14 22:25:21.507127+07	2026-06-14 22:25:56.341925+07
a524a33f-2a36-47c0-b444-191e2f2621d9	a1000000-0000-0000-0000-000000000004	Driver Accepted	Your driver has accepted the booking. Get ready!	t	2026-06-14 22:25:11.648346+07	2026-06-14 22:26:17.287354+07
c48875ad-1344-4ce4-975b-40c377288056	a1000000-0000-0000-0000-000000000004	Payment Rejected	Your payment was rejected. Please re-upload your proof of payment.	t	2026-06-14 22:24:08.989131+07	2026-06-14 22:26:18.196475+07
b72e1251-1cd7-4f74-80de-2a477f750963	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	t	2026-06-14 22:21:16.895409+07	2026-06-14 22:27:00.707086+07
0692b72c-5ebf-44d4-9c94-c6839ca4c198	a1000000-0000-0000-0000-000000000005	Awaiting Payment	Please upload payment proof for your city ride.	t	2026-06-14 15:30:42.561145+07	2026-06-14 22:40:12.269614+07
f4ff5b6e-c36c-48b6-98ff-0bb6cfa2422c	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from Samdech Preah Sihanouk Boulevard (Street 274), Sangkat Boeng Prolit, Khan Prampir Makara, Phnom Penh, 120308, Cambodia to First Investment Specialized Bank, Preah Norodom Boulevard (Street 41), Sangkat Boeng Keng Kang Ti Muoy, Khan Boeng Keng Kang, Phnom Penh, 120102, Cambodia.	f	2026-06-14 22:40:51.566+07	2026-06-14 22:40:51.566+07
20c592e8-609f-4562-a1bc-3dae363646d0	a1000000-0000-0000-0000-000000000005	Payment Verified	Your payment has been verified. Your booking is now being processed.	t	2026-06-14 22:40:51.433841+07	2026-06-14 22:41:36.776997+07
5fd9e7a6-5a6d-4fd8-887c-6f6c22f73120	a1000000-0000-0000-0000-000000000005	Payment Verified	Your payment has been verified. Your booking is now being processed.	t	2026-06-14 22:48:36.446305+07	2026-06-14 22:49:07.212238+07
e5bc4d87-db29-4909-a8d3-05c71d1fd94d	a1000000-0000-0000-0000-000000000005	Driver Accepted	Your driver has accepted the booking. Get ready!	f	2026-06-14 22:51:43.753502+07	2026-06-14 22:51:43.753502+07
7bcef04e-c82b-430b-a8e5-e807564a9158	a1000000-0000-0000-0000-000000000005	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-14 22:51:47.322652+07	2026-06-14 22:51:47.322652+07
c7df0cbd-acc1-42cf-8e81-74a86425256f	a1000000-0000-0000-0000-000000000005	Driver Rejected	Your assigned driver has rejected the booking. We will reassign shortly.	f	2026-06-14 22:55:36.46802+07	2026-06-14 22:55:36.46802+07
6f2b6794-2251-4f49-9847-6b98fdeee435	a1000000-0000-0000-0000-000000000001	Driver Rejected Booking	Driver Dara Chan rejected the booking (city_ride) from Bake and Bake Bakery, 06b, Street 440, Boeung Trabek, Sangkat Tuol Tumpung Ti Muoy, Khan Chamkar Mon, Phnom Penh, 120112, Cambodia to Bake and Bake Bakery, 06b, Street 440, Boeung Trabek, Sangkat Tuol Tumpung Ti Muoy, Khan Chamkar Mon, Phnom Penh, 120112, Cambodia. Manual re-assignment is needed.	t	2026-06-14 22:55:36.54+07	2026-06-14 22:56:11.708469+07
98eb6e5b-89d8-4530-aca0-1fcc0fba0e2f	a1000000-0000-0000-0000-000000000004	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-14 23:08:39.704625+07	2026-06-14 23:08:39.704625+07
54e2abae-b734-419e-986d-28b2eac637a4	a1000000-0000-0000-0000-000000000004	Driver Accepted	Your driver has accepted the booking. Get ready!	f	2026-06-14 23:10:21.201413+07	2026-06-14 23:10:21.201413+07
245062b7-95eb-4b28-b22e-f41c9fecd073	a1000000-0000-0000-0000-000000000004	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-14 23:10:25.863064+07	2026-06-14 23:10:25.863064+07
2fd4654d-ab5c-4df5-83a4-f8bf429518df	a1000000-0000-0000-0000-000000000004	Driver Rejected	Your assigned driver has rejected the booking. We will reassign shortly.	f	2026-06-14 23:10:29.250036+07	2026-06-14 23:10:29.250036+07
3a363c6b-a05f-4a93-a5b4-2a48f2fdec0b	a1000000-0000-0000-0000-000000000001	Driver Rejected Booking	Driver Dara Chan rejected the booking (intercity) from Siem Reap to Phnom Penh. Manual re-assignment is needed.	t	2026-06-14 23:10:29.274+07	2026-06-15 21:20:58.371197+07
6466f08e-4dd7-44d2-83c4-1f2fad75269b	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from National Highway 6, Phum Khtor, Sangkat Prek Liep, Khan Chroy Changvar, Phnom Penh, 121002, Cambodia to Phum Kandal, Sangkat Cheung Aek, Khan Dangkao, Phnom Penh, 120508, Cambodia.	t	2026-06-15 21:19:00.434+07	2026-06-15 21:22:22.517514+07
2271c2e1-9b54-408e-9bca-99626e9e65d5	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (intercity) from Siem Reap to Phnom Penh.	t	2026-06-14 23:10:26.045+07	2026-06-15 21:22:23.135278+07
140ab330-b2ec-46e2-8417-754671acd71e	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from Oknha Tep Phan (Street 182), Sangkat Phsar Depou Ti Bei, Khan Toul Kork, Phnom Penh, 120403, Cambodia to Wat Botum, Oknha Suor Srun (Street 7), Sangkat Chaktomuk, Khan Daun Penh, Phnom Penh, 120207, Cambodia.	t	2026-06-14 23:08:39.818+07	2026-06-15 21:22:24.356777+07
cb034e63-5739-490d-aedf-2b1e1cb29b9a	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	t	2026-06-15 21:22:01.831075+07	2026-06-15 21:26:56.903618+07
17a363b5-cf7b-4113-a6ab-f746fcddf23b	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Driver Accepted	Your driver has accepted the booking. Get ready!	t	2026-06-15 21:21:53.431973+07	2026-06-15 21:26:58.020262+07
4ec39272-2324-4abc-8126-842a81e74f5e	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	t	2026-06-15 21:19:00.15479+07	2026-06-15 21:26:58.673372+07
667d0445-b5ae-4348-a4f5-a3e51720505f	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	t	2026-06-15 21:27:29.13015+07	2026-06-15 21:28:51.193668+07
d523b23b-993d-47b0-9894-bfb36ce5147e	a1000000-0000-0000-0000-000000000005	Payment Rejected	Your payment was rejected. Please re-upload your proof of payment.	f	2026-06-15 21:41:45.012854+07	2026-06-15 21:41:45.012854+07
7deb9733-fe71-45da-877f-b5a7b8204294	a1000000-0000-0000-0000-000000000005	Payment Rejected	Your payment was rejected. Please re-upload your proof of payment.	f	2026-06-15 21:41:46.110171+07	2026-06-15 21:41:46.110171+07
804423a7-edc0-4e31-a423-85ef8cb51ed8	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Driver Rejected	Your assigned driver has rejected the booking. We will reassign shortly.	f	2026-06-15 21:42:46.102294+07	2026-06-15 21:42:46.102294+07
c0467d0b-0c16-4eb0-b6f0-bca4e11ab327	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (intercity) from Olympic Market, Street 310, Sangkat Olympic, Khan Boeng Keng Kang, Phnom Penh, 120105, Cambodia to Street 173, Sangkat Olympic, Khan Boeng Keng Kang, Phnom Penh, 120105, Cambodia.	t	2026-06-15 21:27:29.227+07	2026-06-15 21:42:50.375797+07
e40625b2-9bda-466e-be10-fce1789da2c1	a1000000-0000-0000-0000-000000000001	Driver Rejected Booking	Driver Dara Chan rejected the booking (intercity) from Olympic Market, Street 310, Sangkat Olympic, Khan Boeng Keng Kang, Phnom Penh, 120105, Cambodia to Street 173, Sangkat Olympic, Khan Boeng Keng Kang, Phnom Penh, 120105, Cambodia. Manual re-assignment is needed.	t	2026-06-15 21:42:46.151+07	2026-06-15 21:43:35.884415+07
413e8d92-bc2f-44f9-87ec-0b6f8c2e7aa3	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-15 22:41:49.887584+07	2026-06-15 22:41:49.887584+07
2b8c4508-0c8b-41ac-8ab2-dc1946e94662	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (intercity) from Phum Prey Sa, Sangkat Prey Sa, Khan Dangkao, Phnom Penh, 120504, Cambodia to Sangkat Kbal Koh, Khan Chbar Ampov, Phnom Penh, 121207, Cambodia.	f	2026-06-15 22:41:50.557+07	2026-06-15 22:41:50.557+07
ce785986-12b1-44be-8c19-75745382b222	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 00:18:55.635008+07	2026-06-16 00:18:55.635008+07
dd8c8317-11bf-46c1-ad83-1502fcffa435	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 00:34:05.310902+07	2026-06-16 00:34:05.310902+07
e7d9140c-7762-46b2-bfcd-13e26323dfd2	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 08:17:57.938971+07	2026-06-16 08:17:57.938971+07
ff9b11fe-0ad9-4f26-a8be-b7c6ae14e613	d82778b5-8d2d-4f08-97d8-2620fb87c185	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 08:23:33.293799+07	2026-06-16 08:23:33.293799+07
39537d55-4bf1-407d-b68e-4dcf76acd773	a1000000-0000-0000-0000-000000000005	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 15:00:23.01638+07	2026-06-16 15:00:23.01638+07
3fa2e043-2cd2-48cd-b31b-104992b2c2ce	a1000000-0000-0000-0000-000000000005	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 15:01:37.949568+07	2026-06-16 15:01:37.949568+07
29649336-6cc8-49b6-b6c6-0ffd09b10507	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
dcf76d3e-ac40-4c0f-8210-eafe2d85130e	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
22a54a98-c128-4afd-8fd7-ed31e343db6f	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
f6c9aabe-1663-4045-91d6-b0c9f586ff5d	a1000000-0000-0000-0000-000000000004	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
db4dec49-227c-4fa3-9f7d-024ef1573efd	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
de8142b3-dd07-4673-b813-bdee82385734	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
0fc38078-49c1-4142-b376-f5f929caef39	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
2e75c662-5205-45de-acc0-d31e215f66d2	d82778b5-8d2d-4f08-97d8-2620fb87c185	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
b6ff6a7a-0719-4a86-a3c3-f67dffff5864	a1000000-0000-0000-0000-000000000005	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
52e76eac-2037-4ea2-b195-eeed281a5e8b	a1000000-0000-0000-0000-000000000004	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
3bfbd705-21ad-4d90-b452-2b66b8de54e5	a1000000-0000-0000-0000-000000000005	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
11783d0e-4206-4b56-a239-7e11441dad71	a1000000-0000-0000-0000-000000000004	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
d583e814-5b8b-4fa7-9dde-052c86e3a0b3	a1000000-0000-0000-0000-000000000005	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:03.096559+07	2026-06-16 15:02:03.096559+07
d3e00f87-aa88-4ba1-980d-c2154d6b517d	a1000000-0000-0000-0000-000000000005	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 15:02:10.087918+07	2026-06-16 15:02:10.087918+07
21565495-bed2-4870-9078-b99f4afa9e11	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from Russian Market, Phnom Penh to Vattanac Capital, Phnom Penh.	f	2026-06-16 15:02:10.164+07	2026-06-16 15:02:10.164+07
96c1a1f2-8c74-4146-a936-7e0c2cc982c1	a1000000-0000-0000-0000-000000000005	Driver Accepted	Your driver has accepted the booking. Get ready!	f	2026-06-16 15:02:10.308951+07	2026-06-16 15:02:10.308951+07
c1e9bd3f-a880-4728-8e6a-fecdbe385da6	a1000000-0000-0000-0000-000000000005	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:02:10.334947+07	2026-06-16 15:02:10.334947+07
a0b7cdf6-6684-4939-a17e-59c97bd68fc8	a1000000-0000-0000-0000-000000000005	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 15:04:52.28362+07	2026-06-16 15:04:52.28362+07
370052c7-9996-4604-8a1e-fad1bd7bf4ab	a1000000-0000-0000-0000-000000000003	New Booking Assigned	You have been assigned to a new booking (city_ride) from Russian Market, Phnom Penh to Vattanac Capital, Phnom Penh.	f	2026-06-16 15:04:52.343+07	2026-06-16 15:04:52.343+07
81b8f939-7aa7-4398-8cfa-1528f3ab813f	a1000000-0000-0000-0000-000000000005	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 15:05:11.57496+07	2026-06-16 15:05:11.57496+07
e971c3d6-f20c-473c-aea2-5d807c529810	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from Russian Market, Phnom Penh to Vattanac Capital, Phnom Penh.	f	2026-06-16 15:05:11.642+07	2026-06-16 15:05:11.642+07
d13fbe70-ff14-4bb4-aa55-8175a47cfaba	a1000000-0000-0000-0000-000000000005	Driver Accepted	Your driver has accepted the booking. Get ready!	f	2026-06-16 15:05:11.804043+07	2026-06-16 15:05:11.804043+07
fe7d5192-09f1-4095-a483-8554e0f4b079	a1000000-0000-0000-0000-000000000005	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:05:11.843702+07	2026-06-16 15:05:11.843702+07
38ca9388-1c74-48e9-959a-4c14f7a8eb6b	a1000000-0000-0000-0000-000000000005	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 15:09:38.353354+07	2026-06-16 15:09:38.353354+07
9faf01c6-7dd8-4159-a80d-6e958659a3ba	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from Russian Market, Phnom Penh to Vattanac Capital, Phnom Penh.	f	2026-06-16 15:09:38.428+07	2026-06-16 15:09:38.428+07
9c09aaa2-ca42-4f96-a368-4b41e9f2f053	a1000000-0000-0000-0000-000000000005	Driver Accepted	Your driver has accepted the booking. Get ready!	f	2026-06-16 15:09:38.600638+07	2026-06-16 15:09:38.600638+07
9a420760-687c-4a96-9927-fdbe97bbbf82	a1000000-0000-0000-0000-000000000005	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-16 15:09:38.628275+07	2026-06-16 15:09:38.628275+07
81f68d58-eff7-403e-a837-df5252052f59	d82778b5-8d2d-4f08-97d8-2620fb87c185	Custom Trip Request Approved	Your custom trip request from Cadt University to Kompot , Koh Rong has been approved.	f	2026-06-16 15:51:34.977+07	2026-06-16 15:51:34.977+07
b37f4f4b-673f-46dd-831c-df451ffa41a0	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Custom Trip Request Rejected	Your custom trip request from Siem Reap to Phnom Penh, Safay has been rejected.	f	2026-06-16 15:53:43.58+07	2026-06-16 15:53:43.58+07
ad85a04d-5b7e-431b-b7b8-0ae31ac0777b	a1000000-0000-0000-0000-000000000005	Custom Trip Request Approved	Your custom trip request from Phnom Penh (CADT Campus) to Siem Reap (Angkor Wat) has been approved. Quoted price: $50. Note: thanks u , we will arrange that for u , please provide the pick up and drop off destination 	f	2026-06-16 15:58:58.133+07	2026-06-16 15:58:58.133+07
d9463607-d95a-4e30-8ab9-1de353097a58	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:05:13.791+07	2026-06-16 16:05:13.791+07
4bb81175-c990-48b8-ade2-8f546a031fd9	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:06:26.814+07	2026-06-16 16:06:26.814+07
c8bd2a9f-5310-442d-9b14-254a03b88353	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:07:52.178+07	2026-06-16 16:07:52.178+07
31e40431-f208-4449-ab36-990c45c76960	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:07:57.024+07	2026-06-16 16:07:57.024+07
c2b9d6bb-3bdd-4140-beb0-95e4fbccb412	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler James Carter requested urgent assistance for Custom Trip #3ade2081. Telegram contact: @james_traveler.	f	2026-06-16 16:08:39.741+07	2026-06-16 16:08:39.741+07
c599ef74-efbb-4de5-9455-59456ba6a7be	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler James Carter requested urgent assistance for Custom Trip #3ade2081. Telegram contact: @james_traveler.	f	2026-06-16 16:08:55.038+07	2026-06-16 16:08:55.038+07
200a0eff-4af2-4ffb-85a1-92cf9c7269d2	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:09:12.409+07	2026-06-16 16:09:12.409+07
d8d77ab3-b70e-44a2-bd41-1749457d0c03	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler James Carter requested urgent assistance for Custom Trip #0d741c9e. Telegram contact: None.	f	2026-06-16 16:10:13.115+07	2026-06-16 16:10:13.115+07
cc936f77-ccce-40ad-ba5c-5ed975818f37	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler James Carter requested urgent assistance for Custom Trip #3ade2081. Telegram contact: @james_traveler.	f	2026-06-16 16:11:16.638+07	2026-06-16 16:11:16.638+07
28f1b98f-3ea7-4cc6-8f65-b1ebae5d3e59	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:11:31.973+07	2026-06-16 16:11:31.973+07
50d898cc-ac94-4278-b6d5-392fd4f3c05a	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:11:38.277+07	2026-06-16 16:11:38.277+07
a30b416f-6cc7-4606-8dc2-6f6294d402e2	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:11:41.915+07	2026-06-16 16:11:41.915+07
a8bd70a6-7ee3-4d04-9194-a6d5878cd43e	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler James Carter requested urgent assistance for Custom Trip #0d741c9e. Telegram contact: None.	f	2026-06-16 16:13:33.854+07	2026-06-16 16:13:33.854+07
25dc7361-5cb1-458a-b300-6acba5102248	a1000000-0000-0000-0000-000000000005	Custom Trip Request Approved	Your custom trip request from Phnom Penh (CADT Campus) to Siem Reap (Angkor Wat) has been approved. Quoted price: $83. Note: thanks you please fill in your pickup and drop off location	f	2026-06-16 16:14:49.985+07	2026-06-16 16:14:49.985+07
6e23e715-b5bb-4407-8984-dc39f34cc925	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: jame@123.	f	2026-06-16 16:15:38.34+07	2026-06-16 16:15:38.34+07
97d75a50-1286-4a56-8fe4-4c9bbf4f7957	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler James Carter requested urgent assistance for Custom Trip #fdb03cf2. Telegram contact: None.	f	2026-06-16 16:22:20.44+07	2026-06-16 16:22:20.44+07
6ffde32f-7f4a-48f1-b9d6-2a5e22c42e31	a1000000-0000-0000-0000-000000000005	Custom Trip Request Approved	Your custom trip request from American Intercon School (AIS) Toul Kork Campus, 26, Street 528, Sangkat Boeung Kak Ti Muoy, Khan Toul Kork, Phnom Penh, 120407, Cambodia to Preah Sisowath Quay (Street 1), Boeung Kak Community, Sangkat Srah Chak, Khan Daun Penh, Phnom Penh, 120210, Cambodia has been approved. Quoted price: $10. Note: thanks	f	2026-06-16 16:23:19.962+07	2026-06-16 16:23:19.962+07
7d744f6b-c870-40e7-8187-b17422e554e1	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @nana.	f	2026-06-16 16:27:39.307+07	2026-06-16 16:27:39.307+07
220368ed-eee8-4457-9f31-ab96ea39e041	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:31:39.734+07	2026-06-16 16:31:39.734+07
8f78e901-5e61-4ebc-b631-32a49cdf04b8	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler James Carter has confirmed details. Telegram: @james_traveler.	f	2026-06-16 16:32:36.518+07	2026-06-16 16:32:36.518+07
98858bf3-a0a8-4401-a376-79b3e58db61e	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Custom Trip Request Approved	Your custom trip request from Knorng Psa to Komport has been approved. Quoted price: $300. Note: thanks	f	2026-06-16 16:36:18.036+07	2026-06-16 16:36:18.036+07
c6d266a0-0575-4abd-b109-fe08ac39e957	a1000000-0000-0000-0000-000000000005	Custom Trip Request Rejected	Your custom trip request from Phnom Penh (CADT Campus) to Siem Reap (Angkor Wat) has been rejected.	f	2026-06-16 16:36:26.475+07	2026-06-16 16:36:26.475+07
35d071e0-b91a-4f6e-9f98-f3f21c5b5707	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-16 21:37:57.54519+07	2026-06-16 21:37:57.54519+07
6aedaaaf-d57f-4dbe-b234-0549ad4d9038	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (package) from cadrt to aeon 3.	f	2026-06-16 21:37:57.822+07	2026-06-16 21:37:57.822+07
d8110dff-83cb-4219-a66b-1fed3f46bc0a	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-17 12:36:02.012632+07	2026-06-17 12:36:02.012632+07
7bea019c-5013-4dc6-97ac-3f2447a9a6ef	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-17 12:36:02.915451+07	2026-06-17 12:36:02.915451+07
b528b16b-aa20-420c-abfc-6643c63957d7	d82778b5-8d2d-4f08-97d8-2620fb87c185	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-17 21:31:52.958576+07	2026-06-17 21:31:52.958576+07
84ebca74-0e69-4e99-89a6-1286d3d55f21	d82778b5-8d2d-4f08-97d8-2620fb87c185	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-17 21:33:27.146051+07	2026-06-17 21:33:27.146051+07
46f12847-0e70-4752-967f-3eca2114ccd8	d82778b5-8d2d-4f08-97d8-2620fb87c185	Custom Trip Request Approved	Your custom trip request from Kompot to Pub Street has been approved. Quoted price: $300. Note: thanks you for requesting, and please fill in the info	f	2026-06-17 21:37:31.398+07	2026-06-17 21:37:31.398+07
0b70d67b-b467-4c4a-9334-862ddbf3beb0	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler nysa requested urgent assistance for Custom Trip #0ff44abd. Telegram contact: @bopha.	f	2026-06-17 21:38:17.503+07	2026-06-17 21:38:17.503+07
cc5ab487-3a55-46cb-83c7-a1a4e422c1e9	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Driver Accepted	Your driver has accepted the booking. Get ready!	f	2026-06-17 21:41:11.913573+07	2026-06-17 21:41:11.913573+07
665128ff-0007-4498-a2b4-ef3c9d86cf55	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Trip Completed	Your trip has been completed. Thank you for choosing TaxiTrio!	f	2026-06-17 21:41:20.445351+07	2026-06-17 21:41:20.445351+07
fe1ad2d9-601d-400a-9f0f-6e8a528631ba	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (intercity) from Exhibition Street, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia to Exhibition Street, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia.	f	2026-06-17 21:41:20.486+07	2026-06-17 21:41:20.486+07
2bb55095-3144-4ffd-ae66-2b0baeb47e54	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Driver Rejected	Your assigned driver has rejected the booking. We will reassign shortly.	f	2026-06-17 21:41:30.439501+07	2026-06-17 21:41:30.439501+07
c38c10c9-0176-4b7b-b642-359c9acc8db1	a1000000-0000-0000-0000-000000000001	Driver Rejected Booking	Driver Dara Chan rejected the booking (intercity) from Exhibition Street, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia to Exhibition Street, Koh Pich, Sangkat Tonle Bassac, Khan Chamkar Mon, Phnom Penh, 120101, Cambodia. Manual re-assignment is needed.	f	2026-06-17 21:41:30.46+07	2026-06-17 21:41:30.46+07
a6b3d4b4-8c94-4281-9608-f269db59808c	a1000000-0000-0000-0000-000000000005	Custom Trip Request Rejected	Your custom trip request from Phnom Penh (CADT Campus) to Siem Reap (Angkor Wat) has been rejected.	f	2026-06-17 21:42:46.978+07	2026-06-17 21:42:46.978+07
b76337f0-fecf-419a-9e78-030356cd5a96	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler bopha has confirmed details. Telegram: @bopha.	f	2026-06-17 21:52:33.386+07	2026-06-17 21:52:33.386+07
ea5101c5-cc66-4f57-9b25-8f40c22ed7d3	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler bopha requested urgent assistance for Custom Trip #99c638d2. Telegram contact: @bopha.	f	2026-06-17 21:53:01.838+07	2026-06-17 21:53:01.838+07
2fe2572e-4640-4c88-a5fa-a599655a0989	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler bopha requested urgent assistance for Custom Trip #99c638d2. Telegram contact: @bopha.	f	2026-06-17 21:53:38.955+07	2026-06-17 21:53:38.955+07
d159112e-88b9-4d96-981d-7dd11bcb4c88	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-19 09:52:34.139404+07	2026-06-19 09:52:34.139404+07
00ea433b-28f2-4dfd-adc8-eb12803f9ddd	a1000000-0000-0000-0000-000000000002	New Booking Assigned	You have been assigned to a new booking (city_ride) from Street 318, Sangkat Tuol Svay Prey Ti Pir, Khan Boeng Keng Kang, Phnom Penh, 120107, Cambodia to Koh Norea, Sangkat Chbar Ampov Ti Pir, Khan Chbar Ampov, Phnom Penh, 121202, Cambodia.	f	2026-06-19 09:52:35.048+07	2026-06-19 09:52:35.048+07
70897fd0-bd2d-4ab1-b67f-88835b262e51	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler nysa requested urgent assistance for Custom Trip #0ff44abd. Telegram contact: @bopha.	f	2026-06-19 13:10:10.681+07	2026-06-19 13:10:10.681+07
456bb107-a464-4e34-8744-4f38dafbf8ab	8ccc42fa-4598-4e06-8669-0dc5532d036f	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-20 15:50:49.285119+07	2026-06-20 15:50:49.285119+07
716b63b0-190c-4bc7-b44a-a6f3284f073b	8ccc42fa-4598-4e06-8669-0dc5532d036f	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-20 16:58:36.391673+07	2026-06-20 16:58:36.391673+07
c9df85e5-a037-4112-8cd1-a4a0c747c612	d82778b5-8d2d-4f08-97d8-2620fb87c185	Payment Rejected	Your payment was rejected. Please re-upload your proof of payment.	f	2026-06-20 17:10:55.455806+07	2026-06-20 17:10:55.455806+07
7e13b30d-d0cc-47fd-831c-9f21fe770e98	8ccc42fa-4598-4e06-8669-0dc5532d036f	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-20 17:11:34.836055+07	2026-06-20 17:11:34.836055+07
b77a7d4d-9a77-474e-8aa0-1bd8b62feb71	8ccc42fa-4598-4e06-8669-0dc5532d036f	Payment Rejected	Your payment was rejected. Please re-upload your proof of payment.	f	2026-06-20 17:11:38.657806+07	2026-06-20 17:11:38.657806+07
940c718f-2b58-41fd-a86a-e64d01ae60b7	8ccc42fa-4598-4e06-8669-0dc5532d036f	Custom Trip Request Rejected	Your custom trip request from Phnom Penh to Siem Reap has been rejected. Note: Rejected via Telegram Admin Button	f	2026-06-20 17:24:03.396+07	2026-06-20 17:24:03.396+07
086d4e8b-bec7-46f1-bd72-69a734243d2f	8ccc42fa-4598-4e06-8669-0dc5532d036f	Custom Trip Request Approved	Your custom trip request from Siem Reap to Battambang has been approved. Quoted price: $75.5. Note: Approved & Quoted via Telegram Reply	f	2026-06-20 17:24:03.418+07	2026-06-20 17:24:03.418+07
cb8c2e4c-f9e2-4619-b7f2-9276a3199a93	8ccc42fa-4598-4e06-8669-0dc5532d036f	Custom Trip Request Rejected	Your custom trip request from Phnom Penh to Siem Reap has been rejected. Note: Rejected via Telegram Admin Button	f	2026-06-20 17:24:56.971+07	2026-06-20 17:24:56.971+07
77ea3d71-c5c1-4cfb-b936-36bacbc4cc18	8ccc42fa-4598-4e06-8669-0dc5532d036f	Custom Trip Request Approved	Your custom trip request from Siem Reap to Battambang has been approved. Quoted price: $75.5. Note: Approved & Quoted via Telegram Reply	f	2026-06-20 17:24:57.058+07	2026-06-20 17:24:57.058+07
7cf26bbf-896a-4a1c-9aef-40fdea5ac063	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $3.01 via Stripe for ride #90ce2c2f-4d9e-4feb-90ff-7ef637953d75.	f	2026-06-20 17:49:34.405+07	2026-06-20 17:49:34.405+07
25ba5d4a-d10a-44d4-80f7-cab3a8f1135a	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $45.00 via Stripe for ride #06e1d3c7-72ac-4f1f-abbb-61d0f6d7bd08.	f	2026-06-21 19:11:32.875+07	2026-06-21 19:11:32.875+07
418b3672-6906-4427-8dd4-bb67d01d1ec7	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $3.01 via Stripe for ride #e94cf549-6f82-4c75-94f9-3dc27ca0a2fe.	f	2026-06-20 17:27:24.334+07	2026-06-20 17:27:24.334+07
d078b866-27d8-4b12-ab76-6ca4f503d1a4	8ccc42fa-4598-4e06-8669-0dc5532d036f	Driver Assigned	A driver has been assigned to your ride #f4996c1a-463d-4ff6-b51e-627d1cbefa1a (CITY RIDE).	f	2026-06-20 17:49:34.572+07	2026-06-20 17:49:34.572+07
81efedb3-e264-41bd-876c-78e4c3ee5292	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler Sreylenn Seat requested urgent assistance for Custom Trip #dafa363d. Telegram contact: @kaka.	f	2026-06-20 17:58:22.329+07	2026-06-20 17:58:22.329+07
dffbf85e-2d36-44fe-b374-4d72a7bf1c9c	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Driver Assigned	A driver has been assigned to your ride #1e90f44e-435f-4df4-a93f-a3305ac42ee2 (INTERCITY).	f	2026-06-20 17:27:24.476+07	2026-06-20 17:27:24.476+07
be63d42a-565a-43b5-98c1-67022fad2af5	8ccc42fa-4598-4e06-8669-0dc5532d036f	Custom Trip Request Approved	Your custom trip request from Baray Tirk Tla to Kirirom, Kompot has been approved. Quoted price: $70. Note: thanks for requesting 	f	2026-06-20 18:03:32.456+07	2026-06-20 18:03:32.456+07
3143146a-9090-4767-8ef6-5bb19afeec20	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler Sreylenn Seat has confirmed details. Booking #83d525b0-f11e-4987-ae33-5c8fd87ee4ca created. Telegram: @kaka.	f	2026-06-20 18:07:11.472+07	2026-06-20 18:07:11.472+07
c2c6a5f0-d0f1-4e3d-b2ed-6447854b3ce3	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler Sreylenn Seat has confirmed details. Booking #04a196f1-d438-452e-ae6a-40268de1d4eb created. Telegram: @kaka.	f	2026-06-20 20:43:20.599+07	2026-06-20 20:43:20.599+07
a1ec0aa8-0ad6-43c2-8db3-486bcadd62be	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler Sreylenn Seat paid $12.20 via Stripe for ride #2bad961f-a9e9-48ff-9409-8bdd118900c3.	f	2026-06-20 21:09:18.01+07	2026-06-20 21:09:18.01+07
f8329d96-6b7e-4af1-a3e7-4cf77d086442	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $3.01 via Stripe for ride #9ff2c2ea-ba64-486a-9551-18b4b028bb7a.	f	2026-06-20 17:33:16.496+07	2026-06-20 17:33:16.496+07
1bcd993a-c22e-487d-a4fc-d516a9906f4a	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler Sreylenn Seat has confirmed details. Telegram: @lenn.	f	2026-06-20 17:50:03.444+07	2026-06-20 17:50:03.444+07
f6b43806-bfee-4a3e-a208-2efd497adcff	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	Driver Assigned	A driver has been assigned to your ride #6ff5ac6b-2238-4544-b8ac-c181e9aa814b (CITY RIDE).	f	2026-06-20 17:33:16.794+07	2026-06-20 17:33:16.794+07
94db231a-96ba-4cf8-aae7-f308e171d860	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $45.00 via Stripe for ride #93c3d4d6-716c-4055-8690-1411c1550e4a.	f	2026-06-20 18:01:47.273+07	2026-06-20 18:01:47.273+07
06e6f180-f079-4f11-81e0-a620cf37910c	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $45.00 via Stripe for ride #7a8ff2db-4857-4223-a2e5-45f7961670a5.	f	2026-06-21 19:16:13.855+07	2026-06-21 19:16:13.855+07
28b0a424-17da-4093-ba0e-e78ab3244b9a	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $3.01 via Stripe for ride #67943dbb-4f20-4ad3-8254-2969fb9db578.	f	2026-06-20 17:36:07.65+07	2026-06-20 17:36:07.65+07
8c6e6577-2074-4a5f-a303-dc50edc9c382	8ccc42fa-4598-4e06-8669-0dc5532d036f	Driver Assigned	A driver has been assigned to your ride #19fef570-5140-4671-af4b-12a51339a50a (CITY RIDE).	f	2026-06-20 18:01:47.506+07	2026-06-20 18:01:47.506+07
4337a7a1-5f0a-4b09-8155-e35addc4e437	d82778b5-8d2d-4f08-97d8-2620fb87c185	Driver Assigned	A driver has been assigned to your ride #45a166ca-ae3b-46a4-807e-c65b4aea6616 (CITY RIDE).	f	2026-06-20 17:36:07.779+07	2026-06-20 17:36:07.779+07
e1974906-c706-473b-9a4a-cec761d2a9d1	8ccc42fa-4598-4e06-8669-0dc5532d036f	Custom Trip Request Approved	Your custom trip request from BKK, Phom Penh to Pub Street, Baray  Siem Reap  has been approved. Quoted price: $40. Note: thanlk u	f	2026-06-20 17:42:17.369+07	2026-06-20 17:42:17.369+07
3b406090-8dfd-43a4-aef8-5eb08a8a2d2c	d82778b5-8d2d-4f08-97d8-2620fb87c185	Custom Trip Request Rejected	Your custom trip request from SR to PP, RK has been rejected.	f	2026-06-20 17:42:25.403+07	2026-06-20 17:42:25.403+07
50b20123-2e36-420e-84a8-ff23d22e4162	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $45.00 via Stripe for ride #1c4038e4-eb72-4982-bc9c-885457dcb01f.	f	2026-06-20 18:05:17.009+07	2026-06-20 18:05:17.009+07
4884f4a4-844d-4cd7-91b1-daabf2964f6f	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $3.01 via Stripe for ride #ea74bb2f-02de-41a1-b2d6-fe2e58414dfb.	f	2026-06-20 17:47:19.47+07	2026-06-20 17:47:19.47+07
1101dbb9-eab5-40bf-bc5d-3c4b91f40744	8ccc42fa-4598-4e06-8669-0dc5532d036f	Payment Verified	Your payment has been verified. Your booking is now being processed.	f	2026-06-20 20:40:40.318056+07	2026-06-20 20:40:40.318056+07
e203d10e-c2c6-4392-94a0-04480feb0860	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler Sreylenn Seat paid $70.00 via Stripe for ride #83d525b0-f11e-4987-ae33-5c8fd87ee4ca.	f	2026-06-20 20:40:40.536+07	2026-06-20 20:40:40.536+07
0b30b4e0-2f0e-4fc6-a9ec-899addab5616	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $45.00 via Stripe for ride #e60a24d8-fa86-4fb9-8665-32f2e28cac74.	f	2026-06-20 20:49:35.195+07	2026-06-20 20:49:35.195+07
a1578fbc-a396-419c-991e-05a05e039733	d82778b5-8d2d-4f08-97d8-2620fb87c185	Driver Assigned	A driver has been assigned to your ride #207d102f-8365-4e4a-8ebb-8af53b1991f0 (PACKAGE).	f	2026-06-20 17:47:19.699+07	2026-06-20 17:47:19.699+07
15300b56-42df-4a89-9599-d65cb7375328	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $3.01 via Stripe for ride #5f30df67-7489-41f5-a963-e7d07941ed2e.	f	2026-06-20 17:57:32.979+07	2026-06-20 17:57:32.979+07
2eae0330-233d-4c40-a912-8c57a555ecb9	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $45.00 via Stripe for ride #174c3c36-b4d2-4d14-b78d-b736ed42c068.	f	2026-06-21 19:18:26.332+07	2026-06-21 19:18:26.332+07
3185e8d6-7019-4912-8610-629df168f70b	8ccc42fa-4598-4e06-8669-0dc5532d036f	Driver Assigned	A driver has been assigned to your ride #77bca187-d2b5-4003-b267-3e72909133da (CITY RIDE).	f	2026-06-20 17:57:33.182+07	2026-06-20 17:57:33.182+07
cafb0c15-2e12-4814-8a2a-d42f637d56f4	a1000000-0000-0000-0000-000000000001	🚨 URGENT support request	Traveler Sreylenn Seat requested urgent assistance for Custom Trip #dafa363d. Telegram contact: @kaka.	f	2026-06-20 18:02:58.624+07	2026-06-20 18:02:58.624+07
52d37479-acaa-4014-bac1-2b27b3461552	a1000000-0000-0000-0000-000000000001	Custom Trip Confirmed by Traveler	Traveler Sreylenn Seat has confirmed details. Booking #9fe54c5f-e154-445e-bb70-b27296a94cd9 created. Telegram: @kaka.	f	2026-06-20 18:05:26.67+07	2026-06-20 18:05:26.67+07
575842e6-09c0-4a4e-aef6-45b07562da9e	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler Sreylenn Seat paid $70.00 via Stripe for ride #83d525b0-f11e-4987-ae33-5c8fd87ee4ca.	f	2026-06-20 20:40:40.565+07	2026-06-20 20:40:40.565+07
93e66c9e-ddd5-4990-ad23-077de2f8df32	8ccc42fa-4598-4e06-8669-0dc5532d036f	Driver Assigned	A driver has been assigned to your ride #83d525b0-f11e-4987-ae33-5c8fd87ee4ca (INTERCITY).	f	2026-06-20 20:49:35.432+07	2026-06-20 20:49:35.432+07
bd42eb30-da7e-4b0f-98e6-1e8a1879ccb8	a1000000-0000-0000-0000-000000000001	New Paid Booking (Stripe)	Traveler John Traveler paid $45.00 via Stripe for ride #648863a0-a52d-4201-a1ca-7c917cad70af.	f	2026-06-21 19:09:32.395+07	2026-06-21 19:09:32.395+07
894947db-71e5-457c-a314-e6b7983cfb19	8ccc42fa-4598-4e06-8669-0dc5532d036f	Driver Assigned	A driver has been assigned to your ride #2bad961f-a9e9-48ff-9409-8bdd118900c3 (CITY RIDE).	f	2026-06-21 19:09:32.565+07	2026-06-21 19:09:32.565+07
\.


--
-- TOC entry 5216 (class 0 OID 17606)
-- Dependencies: 225
-- Data for Name: payment_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_records (id, booking_id, traveler_id, amount, payment_method, proof_url, status, verified_by, verified_at, created_at, updated_at) FROM stdin;
4450d5da-54d0-4188-b40c-0b2cbedaf57e	e1000000-0000-0000-0000-000000000001	a1000000-0000-0000-0000-000000000004	25.00	ABA Bank	\N	verified	a1000000-0000-0000-0000-000000000001	2026-06-11 16:30:42.508587+07	2026-06-14 15:30:42.508587+07	2026-06-14 15:30:42.508587+07
89bdfd8d-733c-4b3f-86ba-ddb3d7e50f13	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	a1000000-0000-0000-0000-000000000004	8.00	ABA Bank	/uploads/1781428123130-Screenshot 2026-06-14 160629.png	verified	a1000000-0000-0000-0000-000000000001	2026-06-14 16:10:45.855+07	2026-06-14 16:08:43.16+07	2026-06-14 16:10:45.851992+07
8ac0b8cd-c37f-42cf-9a7d-c40c1f46a41e	45324760-571a-4b6a-9c1b-c529bfd41471	a1000000-0000-0000-0000-000000000004	8.00	ABA Bank	/uploads/1781441741420-Screenshot 2026-06-14 160629.png	verified	a1000000-0000-0000-0000-000000000001	2026-06-14 19:57:02.532+07	2026-06-14 19:55:41.453+07	2026-06-14 19:57:02.522162+07
86b19cc7-56fc-4085-a272-6900d62a24dc	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	a1000000-0000-0000-0000-000000000004	8.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 20:04:02.533+07	2026-06-14 20:03:04.874+07	2026-06-14 20:04:02.520954+07
20722c66-2d9b-4a1d-8b3b-6f5900900b48	2bad961f-a9e9-48ff-9409-8bdd118900c3	8ccc42fa-4598-4e06-8669-0dc5532d036f	12.20	Stripe	/uploads/stripe-card-payment.png	verified	\N	2026-06-20 21:09:17.784+07	2026-06-20 21:07:16.382+07	2026-06-20 21:09:17.783236+07
0a36a2e1-64d7-4691-8379-49364d7025e0	679b3d50-13e6-41fe-99cd-f77c94e985ec	a1000000-0000-0000-0000-000000000004	8.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 20:10:43.243+07	2026-06-14 20:10:39.801+07	2026-06-14 20:10:43.228748+07
50d4f2e8-c64d-46bf-86da-192e4cbd9957	90007974-66f4-44fc-9ae5-318423187a09	a1000000-0000-0000-0000-000000000004	8.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 20:16:10.674+07	2026-06-14 20:16:08.663+07	2026-06-14 20:16:10.663834+07
a207e2e1-4912-4b37-b361-a12a9fac18d6	f69a578e-3169-4ea0-b79e-917e67fac614	a1000000-0000-0000-0000-000000000004	8.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 20:18:06.996+07	2026-06-14 20:18:04.198+07	2026-06-14 20:18:06.989827+07
542f8049-a215-4805-9510-4ef7c149eca0	2662755e-6641-4296-9ae4-50cf86d7e4f4	a1000000-0000-0000-0000-000000000004	8.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 20:20:51.051+07	2026-06-14 20:20:48.874+07	2026-06-14 20:20:51.04639+07
a3bd3387-7eb1-4f47-b916-28f8a5ccc317	b968d6ef-0a6d-4ac1-9edd-d536d503fbad	a1000000-0000-0000-0000-000000000004	25.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 22:05:00.17+07	2026-06-14 22:04:54.133+07	2026-06-14 22:05:00.159638+07
2fde3f11-6f68-4ac3-ab9c-d1045636272d	194d7b83-35e9-407b-9e0c-80302177c5d9	a1000000-0000-0000-0000-000000000004	3.06	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 22:21:16.909+07	2026-06-14 22:20:34.62+07	2026-06-14 22:21:16.895409+07
329252fd-3261-4b03-bae2-1f2a22130404	c9706437-79f7-47e6-9b0b-63f9728933d1	a1000000-0000-0000-0000-000000000004	5.45	KHQR	\N	rejected	a1000000-0000-0000-0000-000000000001	2026-06-14 22:24:08.986+07	2026-06-14 20:22:41.2+07	2026-06-14 22:24:08.989131+07
5f824796-4abc-4e42-87a5-d6d34b789e2d	7d472b5f-2150-4801-8e64-31e33a493b55	a1000000-0000-0000-0000-000000000005	2.53	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 22:40:51.44+07	2026-06-14 22:40:49.312+07	2026-06-14 22:40:51.433841+07
12e4a58a-8e94-4bd1-b03e-386fe133ea9a	0270641b-228e-4eb7-8ec8-87de27e633b3	a1000000-0000-0000-0000-000000000005	2.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 22:48:36.45+07	2026-06-14 22:47:34.122+07	2026-06-14 22:48:36.446305+07
a8ab8ce9-827a-405d-92a2-0d97eec247f5	59a825de-0804-4d70-a01f-afead04b1b0f	a1000000-0000-0000-0000-000000000004	4.46	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-14 23:08:39.714+07	2026-06-14 23:08:37.665+07	2026-06-14 23:08:39.704625+07
e29c2694-a839-4a6a-9738-46d38215db17	6169f21a-5865-44a8-8773-57377491c668	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	15.96	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-15 21:19:00.165+07	2026-06-15 21:18:53.822+07	2026-06-15 21:19:00.15479+07
317eb946-eff0-43cf-ab37-53f18d1aef75	f9180f67-50b2-4957-9238-fadc9f0b3b03	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	15.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-15 21:27:29.138+07	2026-06-15 21:27:27.457+07	2026-06-15 21:27:29.13015+07
6c5a9d16-654e-4ff1-834b-50cefed718f4	ad7d67ef-1c20-4716-bbc1-3589c91b28e6	a1000000-0000-0000-0000-000000000005	2.14	KHQR	\N	rejected	a1000000-0000-0000-0000-000000000001	2026-06-15 21:41:44.997+07	2026-06-14 22:43:45.679+07	2026-06-15 21:41:45.012854+07
7231287e-0e6d-431a-842f-a427c04fedb4	69e93538-6e2a-4b92-b15e-6f3aa15e4f9d	a1000000-0000-0000-0000-000000000005	4.18	KHQR	\N	rejected	a1000000-0000-0000-0000-000000000001	2026-06-15 21:41:46.106+07	2026-06-14 22:41:56.705+07	2026-06-15 21:41:46.110171+07
1c78e8ba-1b01-4663-a35c-a151d7ebd14c	ea3e3624-6d8d-4813-b610-020f365e3860	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	25.00	KHQR	\N	verified	a1000000-0000-0000-0000-000000000001	2026-06-15 22:41:49.894+07	2026-06-15 22:09:25.347+07	2026-06-15 22:41:49.887584+07
94eef41f-02f7-4da0-858b-1742868f61ce	57f80fbc-0151-4e18-89b1-8b1ea21696d9	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	2.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 00:18:55.642+07	2026-06-16 00:18:54.183+07	2026-06-16 00:18:55.635008+07
e18589b0-334f-4153-a8a7-874c1eb18a28	0331e1fe-597e-417b-8fed-64ef2b7b862b	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	2.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 00:34:05.325+07	2026-06-16 00:33:33.129+07	2026-06-16 00:34:05.310902+07
68c7641b-04b2-4a5a-9a0e-18e8d3aed8cc	2cc4e9f5-5525-466b-9b46-e066a75565e4	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	3.81	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 08:17:57.953+07	2026-06-16 08:17:40.966+07	2026-06-16 08:17:57.938971+07
dac14712-3854-49d9-b729-02785ffff7c9	242639e2-16fc-4ed9-b054-e147c4e957ef	d82778b5-8d2d-4f08-97d8-2620fb87c185	60.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 08:23:33.302+07	2026-06-16 08:23:27.289+07	2026-06-16 08:23:33.293799+07
14d3063f-cbbe-47a7-9474-366f7a19b232	74f8c252-c86b-4a3e-9f2e-369c23cb336d	a1000000-0000-0000-0000-000000000005	3.53	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 15:00:23.022+07	2026-06-16 15:00:22.993+07	2026-06-16 15:00:23.01638+07
cb57981b-2684-43cb-9db2-78e80342a56e	4c37219b-d406-4ef2-8995-04d95506f2bd	a1000000-0000-0000-0000-000000000005	3.53	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 15:01:37.953+07	2026-06-16 15:01:37.936+07	2026-06-16 15:01:37.949568+07
4613a0e2-999a-4c78-b7c3-eac24f34bbaa	0d1677a1-08e8-4b12-841e-d09713cf5791	a1000000-0000-0000-0000-000000000005	3.53	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 15:02:10.093+07	2026-06-16 15:02:10.071+07	2026-06-16 15:02:10.087918+07
e0cd3d14-f76b-42e2-a731-fbf1a0fbe2ac	288c0ea2-f918-4849-8892-96798a2c5275	a1000000-0000-0000-0000-000000000005	3.53	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 15:04:52.285+07	2026-06-16 15:04:52.267+07	2026-06-16 15:04:52.28362+07
85bdc4de-87a0-46c3-adde-de0e67b301d7	58a43460-0a63-4de5-9b50-34b909bbd3ee	a1000000-0000-0000-0000-000000000005	3.53	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 15:05:11.575+07	2026-06-16 15:05:11.56+07	2026-06-16 15:05:11.57496+07
cca04594-98be-4e60-a439-4469ca73dd60	865d57f2-abd2-4fb4-8e0f-b4bc09a56d13	a1000000-0000-0000-0000-000000000005	3.53	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 15:09:38.355+07	2026-06-16 15:09:38.332+07	2026-06-16 15:09:38.353354+07
bd0a4eeb-1cea-40e8-83b6-8954ec7adf77	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	60.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-16 21:37:57.556+07	2026-06-16 21:37:42.588+07	2026-06-16 21:37:57.54519+07
905792af-3006-4915-9f79-852bbbae8c83	6ff5ac6b-2238-4544-b8ac-c181e9aa814b	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	2.81	KHQR	\N	verified	a1000000-0000-0000-0000-000000000001	2026-06-17 12:36:02.018+07	2026-06-16 08:17:16.994+07	2026-06-17 12:36:02.012632+07
a9dd9c45-17e6-4db8-9909-cfbcd7add4e7	1e90f44e-435f-4df4-a93f-a3305ac42ee2	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	15.00	KHQR	\N	verified	a1000000-0000-0000-0000-000000000001	2026-06-17 12:36:02.918+07	2026-06-16 00:20:39.472+07	2026-06-17 12:36:02.915451+07
10b2b241-0a51-4893-9868-d5b85a418083	45a166ca-ae3b-46a4-807e-c65b4aea6616	d82778b5-8d2d-4f08-97d8-2620fb87c185	3.21	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-17 21:31:52.967+07	2026-06-17 21:30:50.567+07	2026-06-17 21:31:52.958576+07
8776c2f4-8b5b-4d76-81f6-e76ca9af3717	207d102f-8365-4e4a-8ebb-8af53b1991f0	d82778b5-8d2d-4f08-97d8-2620fb87c185	150.00	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-17 21:33:27.154+07	2026-06-17 21:33:17.247+07	2026-06-17 21:33:27.146051+07
553afafa-c83c-4349-b110-a7ce2aec8029	1cfe9cec-85bf-450c-9534-29442d6befbe	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	5.76	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-19 09:52:34.152+07	2026-06-19 09:52:09.291+07	2026-06-19 09:52:34.139404+07
0b05e3e5-c1cd-47fd-a7e5-837cb098c759	f4996c1a-463d-4ff6-b51e-627d1cbefa1a	8ccc42fa-4598-4e06-8669-0dc5532d036f	9.04	KHQR	/uploads/mock-khqr-verified.png	verified	\N	2026-06-20 15:50:49.288+07	2026-06-20 15:50:08.147+07	2026-06-20 15:50:49.285119+07
3f24968b-1256-4dd5-a09f-7335985d0b58	19fef570-5140-4671-af4b-12a51339a50a	8ccc42fa-4598-4e06-8669-0dc5532d036f	7.45	Stripe	/uploads/stripe-card-payment.png	verified	\N	2026-06-20 16:58:36.43+07	2026-06-20 16:50:03.9+07	2026-06-20 16:58:36.431122+07
61e72d2b-e856-4ead-a129-59439614348b	243050da-4d69-4947-9dba-cd3fe618d215	d82778b5-8d2d-4f08-97d8-2620fb87c185	4.22	KHQR	\N	rejected	a1000000-0000-0000-0000-000000000001	2026-06-20 17:10:55.449+07	2026-06-19 15:08:25.247+07	2026-06-20 17:10:55.455806+07
b7efb845-05e5-45a3-9064-bb5d1abaec0c	77bca187-d2b5-4003-b267-3e72909133da	8ccc42fa-4598-4e06-8669-0dc5532d036f	3.42	Stripe	\N	verified	a1000000-0000-0000-0000-000000000001	2026-06-20 17:11:34.847+07	2026-06-20 16:01:37.773+07	2026-06-20 17:11:34.836055+07
e4f94526-807a-412e-9caa-ac75720835d8	2cdc684d-0ebf-4e80-964d-ffb74e9bf291	8ccc42fa-4598-4e06-8669-0dc5532d036f	20.00	KHQR	\N	rejected	a1000000-0000-0000-0000-000000000001	2026-06-20 17:11:38.656+07	2026-06-20 15:58:53.576+07	2026-06-20 17:11:38.657806+07
0b6782f1-c4ea-4f93-b637-74ccd341f222	9fe54c5f-e154-445e-bb70-b27296a94cd9	8ccc42fa-4598-4e06-8669-0dc5532d036f	70.00	Stripe	\N	pending	\N	\N	2026-06-20 18:05:25.909+07	2026-06-20 18:05:25.909+07
ca352767-de12-479d-9951-2de391ef2351	83d525b0-f11e-4987-ae33-5c8fd87ee4ca	8ccc42fa-4598-4e06-8669-0dc5532d036f	70.00	Stripe	/uploads/stripe-card-payment.png	verified	\N	2026-06-20 20:40:40.325+07	2026-06-20 18:07:10.659+07	2026-06-20 20:40:40.315804+07
05833a4c-6a88-4a9b-8d94-2e6782201a72	04a196f1-d438-452e-ae6a-40268de1d4eb	8ccc42fa-4598-4e06-8669-0dc5532d036f	70.00	Stripe	\N	pending	\N	\N	2026-06-20 20:43:19.273+07	2026-06-20 20:43:19.273+07
\.


--
-- TOC entry 5221 (class 0 OID 17780)
-- Dependencies: 230
-- Data for Name: pricing_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pricing_rules (id, vehicle_type, booking_type, base_fare, per_km_rate, per_minute_rate, surge_multiplier, is_active, created_at, updated_at) FROM stdin;
7638129c-d64e-48f8-adbf-c3c1659ef9b8	sedan	city_ride	1.50	0.70	0.05	1.00	t	2026-06-16 14:18:13.022406+07	2026-06-16 14:18:13.022406+07
3bd2b7b4-476f-4f91-9256-7ff1381e3dbd	sedan	intercity	5.00	0.60	0.00	1.00	t	2026-06-16 14:18:13.022406+07	2026-06-16 14:18:13.022406+07
387a2df4-012f-4975-9f0c-b2c0969756cb	suv	city_ride	2.50	1.00	0.08	1.00	t	2026-06-16 14:18:13.022406+07	2026-06-16 14:18:13.022406+07
f197cedd-f02d-48af-89b2-83fc77e1ca5e	suv	intercity	10.00	0.90	0.00	1.00	t	2026-06-16 14:18:13.022406+07	2026-06-16 14:18:13.022406+07
1f329610-fb45-4bfb-a8b8-74cd52891364	van	city_ride	3.00	1.20	0.10	1.00	t	2026-06-16 14:18:13.022406+07	2026-06-16 14:18:13.022406+07
719a5825-c093-42ea-89d6-d8f75b820246	van	intercity	12.00	1.10	0.00	1.00	t	2026-06-16 14:18:13.022406+07	2026-06-16 14:18:13.022406+07
\.


--
-- TOC entry 5218 (class 0 OID 17669)
-- Dependencies: 227
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, booking_id, traveler_id, driver_id, rating, comment, created_at, updated_at) FROM stdin;
0b1d4b28-ccac-4846-a606-4f5ca63ec505	e1000000-0000-0000-0000-000000000001	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000002	5	Excellent driver, very punctual and friendly!	2026-06-14 15:30:42.535649+07	2026-06-14 15:30:42.535649+07
34c73af1-81a8-40aa-aa45-bcbbffa3217e	dd33dc35-acbc-4b5e-9e1e-907f0e7ef733	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000002	5	the driver is nice	2026-06-14 16:13:54.589+07	2026-06-14 16:13:54.589+07
cec610aa-dd35-4c91-b900-fbc10b7a4666	6c967d7f-e8d2-4f96-8bcd-a19dafff714c	a1000000-0000-0000-0000-000000000004	a1000000-0000-0000-0000-000000000002	4	good service 	2026-06-14 22:57:31.953+07	2026-06-14 22:57:31.953+07
3c8259d2-5f01-4c54-b009-6419e09a842c	824eea8e-75a5-4c9b-b7d6-f0ecac050d61	5719d5c0-d7d7-4b67-b104-b3a6d0235f65	a1000000-0000-0000-0000-000000000002	3	he a good driver	2026-06-17 21:54:38.223+07	2026-06-17 21:54:38.223+07
\.


--
-- TOC entry 5213 (class 0 OID 17519)
-- Dependencies: 222
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routes (id, origin, destination, distance_km, base_price, duration_hrs, is_active, created_at, updated_at) FROM stdin;
c1000000-0000-0000-0000-000000000001	Phnom Penh	Siem Reap	314.00	25.00	6.00	t	2026-06-14 15:30:42.470024+07	2026-06-14 15:30:42.470024+07
c1000000-0000-0000-0000-000000000002	Phnom Penh	Sihanoukville	230.00	20.00	4.50	t	2026-06-14 15:30:42.470024+07	2026-06-14 15:30:42.470024+07
c1000000-0000-0000-0000-000000000003	Phnom Penh	Kampot	148.00	15.00	3.00	t	2026-06-14 15:30:42.470024+07	2026-06-14 15:30:42.470024+07
c1000000-0000-0000-0000-000000000004	Siem Reap	Battambang	170.00	12.00	3.50	t	2026-06-14 15:30:42.470024+07	2026-06-14 15:30:42.470024+07
\.


--
-- TOC entry 5214 (class 0 OID 17540)
-- Dependencies: 223
-- Data for Name: transportation_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transportation_packages (id, name, description, price, duration_days, max_persons, is_active, created_at, updated_at) FROM stdin;
d1000000-0000-0000-0000-000000000001	Angkor Explorer	2-day Siem Reap temple tour with private driver	150.00	2	4	t	2026-06-14 15:30:42.485127+07	2026-06-14 15:30:42.485127+07
d1000000-0000-0000-0000-000000000002	Coastal Escape	3-day Sihanoukville beach trip	200.00	3	6	t	2026-06-14 15:30:42.485127+07	2026-06-14 15:30:42.485127+07
d1000000-0000-0000-0000-000000000003	Kampot Riverside	1-day Kampot scenic tour	60.00	1	4	t	2026-06-14 15:30:42.485127+07	2026-06-14 15:30:42.485127+07
\.


--
-- TOC entry 5211 (class 0 OID 17473)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, phone, password, role, avatar_url, is_active, created_at, updated_at, reset_password_token, reset_password_expires, must_change_password, status, activation_token, token_expires_at, license_number) FROM stdin;
8ccc42fa-4598-4e06-8669-0dc5532d036f	Sreylenn Seat	lenn8@traveler.com	089 515151	$2b$10$alcWcmggIgwH7Ztd2gkPIuCSyJl51UpC3v0KXD2dkj9ltqttdYgUe	traveler	/uploads/1781945167505-Screenshot 2026-06-20 154553.png	t	2026-06-20 14:42:52.411+07	2026-06-20 15:46:07.726579+07	\N	\N	f	active	\N	\N	\N
a1000000-0000-0000-0000-000000000002	Dara Chan	dara@driver.com	+85512000002	$2b$10$7tJc7PiWGX1SzuBqzl4cw.48rdJVynAB4z33uBU21cOxazCdo/sy6	driver	\N	t	2026-06-14 15:30:42.42554+07	2026-06-16 14:33:00.400959+07	\N	\N	f	active	\N	\N	\N
a1000000-0000-0000-0000-000000000003	Sophea Lim	sophea@driver.com	+85512000003	$2b$10$7tJc7PiWGX1SzuBqzl4cw.48rdJVynAB4z33uBU21cOxazCdo/sy6	driver	\N	t	2026-06-14 15:30:42.42554+07	2026-06-16 14:33:00.400959+07	\N	\N	f	active	\N	\N	\N
a1000000-0000-0000-0000-000000000004	Maly Ros	maly@traveler.com	+85512000004	$2b$10$7tJc7PiWGX1SzuBqzl4cw.48rdJVynAB4z33uBU21cOxazCdo/sy6	traveler	/uploads/1781447604818-Screenshot 2026-04-23 194313.png	t	2026-06-14 15:30:42.42554+07	2026-06-16 14:33:00.400959+07	\N	\N	f	active	\N	\N	\N
aa83be51-f04d-4e2c-bc6f-8b4d81783dc2	Test User	test@test.com	012345678	$2b$10$7tJc7PiWGX1SzuBqzl4cw.48rdJVynAB4z33uBU21cOxazCdo/sy6	traveler	\N	t	2026-06-14 16:21:11.97+07	2026-06-16 14:33:00.400959+07	\N	\N	f	active	\N	\N	\N
5719d5c0-d7d7-4b67-b104-b3a6d0235f65	bopha	Bopha@traveler.com	012 123 123	$2b$10$7tJc7PiWGX1SzuBqzl4cw.48rdJVynAB4z33uBU21cOxazCdo/sy6	traveler	/uploads/1781533029605-Bopha_Seng - Copy.JPG	t	2026-06-15 21:14:11.955+07	2026-06-16 14:33:00.400959+07	\N	\N	f	active	\N	\N	\N
d82778b5-8d2d-4f08-97d8-2620fb87c185	nysa	Nysa@traveler.com	01122334455	$2b$10$7tJc7PiWGX1SzuBqzl4cw.48rdJVynAB4z33uBU21cOxazCdo/sy6	traveler	/uploads/1781572952868-Nysa_San.jpg	t	2026-06-16 08:21:31.253+07	2026-06-16 14:33:50.832318+07	\N	\N	f	active	\N	\N	\N
a1000000-0000-0000-0000-000000000005	James Carter	james@traveler.com	+85512000005	$2b$10$7tJc7PiWGX1SzuBqzl4cw.48rdJVynAB4z33uBU21cOxazCdo/sy6	traveler	\N	t	2026-06-14 15:30:42.42554+07	2026-06-19 13:43:07.020767+07	d88e906cd6d55eaf0098093c49cee348da25a5fa	2026-06-19 14:43:06.994+07	f	active	\N	\N	\N
a1000000-0000-0000-0000-000000000001	Admin TaxiTrio	admin@taxitrio.com	+85512000001	$2b$10$7tJc7PiWGX1SzuBqzl4cw.48rdJVynAB4z33uBU21cOxazCdo/sy6	admin	\N	t	2026-06-14 15:30:42.42554+07	2026-06-21 18:06:40.268111+07	\N	\N	t	active	\N	\N	\N
\.


--
-- TOC entry 5212 (class 0 OID 17495)
-- Dependencies: 221
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (id, driver_id, plate_number, type, brand, model, capacity, is_available, created_at, updated_at) FROM stdin;
b1000000-0000-0000-0000-000000000002	a1000000-0000-0000-0000-000000000003	PP-5678B	suv	Toyota	Fortuner	6	f	2026-06-14 15:30:42.44725+07	2026-06-16 15:04:52.339762+07
b1000000-0000-0000-0000-000000000001	a1000000-0000-0000-0000-000000000002	PP-1234A	sedan	Toyota	Camry	4	f	2026-06-14 15:30:42.44725+07	2026-06-19 09:52:35.039096+07
\.


--
-- TOC entry 5029 (class 2606 OID 17738)
-- Name: booking_status_history booking_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_status_history
    ADD CONSTRAINT booking_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 17580)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 17663)
-- Name: custom_trip_requests custom_trip_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_trip_requests
    ADD CONSTRAINT custom_trip_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5027 (class 2606 OID 17720)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 17627)
-- Name: payment_records payment_records_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_booking_id_key UNIQUE (booking_id);


--
-- TOC entry 5016 (class 2606 OID 17625)
-- Name: payment_records payment_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 17802)
-- Name: pricing_rules pricing_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT pricing_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 5034 (class 2606 OID 17804)
-- Name: pricing_rules pricing_rules_vehicle_type_booking_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT pricing_rules_vehicle_type_booking_type_key UNIQUE (vehicle_type, booking_type);


--
-- TOC entry 5021 (class 2606 OID 17687)
-- Name: reviews reviews_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_key UNIQUE (booking_id);


--
-- TOC entry 5023 (class 2606 OID 17685)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5001 (class 2606 OID 17539)
-- Name: routes routes_origin_destination_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_origin_destination_key UNIQUE (origin, destination);


--
-- TOC entry 5003 (class 2606 OID 17537)
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 17561)
-- Name: transportation_packages transportation_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_packages
    ADD CONSTRAINT transportation_packages_pkey PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 17494)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4994 (class 2606 OID 17492)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 17511)
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 17513)
-- Name: vehicles vehicles_plate_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key UNIQUE (plate_number);


--
-- TOC entry 5008 (class 1259 OID 17750)
-- Name: idx_bookings_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_driver ON public.bookings USING btree (driver_id);


--
-- TOC entry 5009 (class 1259 OID 17751)
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- TOC entry 5010 (class 1259 OID 17749)
-- Name: idx_bookings_traveler; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_traveler ON public.bookings USING btree (traveler_id);


--
-- TOC entry 5030 (class 1259 OID 17756)
-- Name: idx_bsh_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bsh_booking ON public.booking_status_history USING btree (booking_id);


--
-- TOC entry 5024 (class 1259 OID 17755)
-- Name: idx_notifications_unread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_unread ON public.notifications USING btree (user_id) WHERE (is_read = false);


--
-- TOC entry 5025 (class 1259 OID 17754)
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- TOC entry 5011 (class 1259 OID 17752)
-- Name: idx_payment_records_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_records_booking ON public.payment_records USING btree (booking_id);


--
-- TOC entry 5012 (class 1259 OID 17753)
-- Name: idx_payment_records_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_records_status ON public.payment_records USING btree (status);


--
-- TOC entry 5019 (class 1259 OID 17757)
-- Name: idx_reviews_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_driver ON public.reviews USING btree (driver_id);


--
-- TOC entry 4995 (class 1259 OID 17758)
-- Name: idx_vehicles_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_driver ON public.vehicles USING btree (driver_id);


--
-- TOC entry 5055 (class 2620 OID 17777)
-- Name: bookings trg_booking_driver_action_notify; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_booking_driver_action_notify AFTER UPDATE OF status ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.fn_notify_booking_driver_action();


--
-- TOC entry 5056 (class 2620 OID 17773)
-- Name: bookings trg_booking_status_log; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_booking_status_log AFTER UPDATE OF status ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.fn_log_booking_status();


--
-- TOC entry 5057 (class 2620 OID 17767)
-- Name: bookings trg_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5061 (class 2620 OID 17769)
-- Name: custom_trip_requests trg_custom_trip_requests_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_custom_trip_requests_updated_at BEFORE UPDATE ON public.custom_trip_requests FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5063 (class 2620 OID 17771)
-- Name: notifications trg_notifications_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5059 (class 2620 OID 17768)
-- Name: payment_records trg_payment_records_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_payment_records_updated_at BEFORE UPDATE ON public.payment_records FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5060 (class 2620 OID 17775)
-- Name: payment_records trg_payment_status_notify; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_payment_status_notify AFTER UPDATE OF status ON public.payment_records FOR EACH ROW EXECUTE FUNCTION public.fn_notify_payment_status();


--
-- TOC entry 5062 (class 2620 OID 17770)
-- Name: reviews trg_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5053 (class 2620 OID 17765)
-- Name: routes trg_routes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_routes_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5054 (class 2620 OID 17766)
-- Name: transportation_packages trg_transportation_packages_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_transportation_packages_updated_at BEFORE UPDATE ON public.transportation_packages FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5051 (class 2620 OID 17763)
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5058 (class 2620 OID 17779)
-- Name: bookings trg_vehicle_availability; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_vehicle_availability AFTER UPDATE OF status ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.fn_vehicle_availability();


--
-- TOC entry 5052 (class 2620 OID 17764)
-- Name: vehicles trg_vehicles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();


--
-- TOC entry 5049 (class 2606 OID 17739)
-- Name: booking_status_history booking_status_history_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_status_history
    ADD CONSTRAINT booking_status_history_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- TOC entry 5050 (class 2606 OID 17744)
-- Name: booking_status_history booking_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_status_history
    ADD CONSTRAINT booking_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5036 (class 2606 OID 17586)
-- Name: bookings bookings_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5037 (class 2606 OID 17601)
-- Name: bookings bookings_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.transportation_packages(id) ON DELETE SET NULL;


--
-- TOC entry 5038 (class 2606 OID 17596)
-- Name: bookings bookings_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id) ON DELETE SET NULL;


--
-- TOC entry 5039 (class 2606 OID 17581)
-- Name: bookings bookings_traveler_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_traveler_id_fkey FOREIGN KEY (traveler_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5040 (class 2606 OID 17591)
-- Name: bookings bookings_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;


--
-- TOC entry 5044 (class 2606 OID 17664)
-- Name: custom_trip_requests custom_trip_requests_traveler_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_trip_requests
    ADD CONSTRAINT custom_trip_requests_traveler_id_fkey FOREIGN KEY (traveler_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5048 (class 2606 OID 17721)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5041 (class 2606 OID 17628)
-- Name: payment_records payment_records_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- TOC entry 5042 (class 2606 OID 17633)
-- Name: payment_records payment_records_traveler_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_traveler_id_fkey FOREIGN KEY (traveler_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5043 (class 2606 OID 17638)
-- Name: payment_records payment_records_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5045 (class 2606 OID 17688)
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- TOC entry 5046 (class 2606 OID 17698)
-- Name: reviews reviews_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5047 (class 2606 OID 17693)
-- Name: reviews reviews_traveler_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_traveler_id_fkey FOREIGN KEY (traveler_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5035 (class 2606 OID 17514)
-- Name: vehicles vehicles_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO taxitrio_app;
GRANT USAGE ON SCHEMA public TO taxitrio_readonly;
GRANT ALL ON SCHEMA public TO taxitrio_admin;
GRANT USAGE ON SCHEMA public TO taxitrio_backup;


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE booking_status_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.booking_status_history TO taxitrio_app;
GRANT SELECT ON TABLE public.booking_status_history TO taxitrio_readonly;
GRANT SELECT ON TABLE public.booking_status_history TO taxitrio_backup;


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE bookings; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.bookings TO taxitrio_app;
GRANT SELECT ON TABLE public.bookings TO taxitrio_readonly;
GRANT SELECT ON TABLE public.bookings TO taxitrio_backup;


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE custom_trip_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.custom_trip_requests TO taxitrio_app;
GRANT SELECT ON TABLE public.custom_trip_requests TO taxitrio_readonly;
GRANT SELECT ON TABLE public.custom_trip_requests TO taxitrio_backup;


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.notifications TO taxitrio_app;
GRANT SELECT ON TABLE public.notifications TO taxitrio_readonly;
GRANT SELECT ON TABLE public.notifications TO taxitrio_backup;


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE payment_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.payment_records TO taxitrio_app;
GRANT SELECT ON TABLE public.payment_records TO taxitrio_readonly;
GRANT SELECT ON TABLE public.payment_records TO taxitrio_backup;


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE pricing_rules; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pricing_rules TO taxitrio_app;
GRANT SELECT ON TABLE public.pricing_rules TO taxitrio_readonly;
GRANT SELECT ON TABLE public.pricing_rules TO taxitrio_backup;


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.reviews TO taxitrio_app;
GRANT SELECT ON TABLE public.reviews TO taxitrio_readonly;
GRANT SELECT ON TABLE public.reviews TO taxitrio_backup;


--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE routes; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.routes TO taxitrio_app;
GRANT SELECT ON TABLE public.routes TO taxitrio_readonly;
GRANT SELECT ON TABLE public.routes TO taxitrio_backup;


--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE transportation_packages; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.transportation_packages TO taxitrio_app;
GRANT SELECT ON TABLE public.transportation_packages TO taxitrio_readonly;
GRANT SELECT ON TABLE public.transportation_packages TO taxitrio_backup;


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO taxitrio_app;
GRANT SELECT ON TABLE public.users TO taxitrio_readonly;
GRANT SELECT ON TABLE public.users TO taxitrio_backup;


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE vehicles; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.vehicles TO taxitrio_app;
GRANT SELECT ON TABLE public.vehicles TO taxitrio_readonly;
GRANT SELECT ON TABLE public.vehicles TO taxitrio_backup;


--
-- TOC entry 2125 (class 826 OID 17761)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO taxitrio_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT ON TABLES TO taxitrio_readonly;


--
-- TOC entry 2126 (class 826 OID 17809)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: taxitrio_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_admin IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO taxitrio_app;
ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_admin IN SCHEMA public GRANT SELECT ON TABLES TO taxitrio_readonly;
ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_admin IN SCHEMA public GRANT SELECT ON TABLES TO taxitrio_backup;


--
-- TOC entry 2127 (class 826 OID 17810)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: taxitrio_owner
--

ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_owner IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO taxitrio_app;
ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_owner IN SCHEMA public GRANT SELECT ON TABLES TO taxitrio_readonly;
ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_owner IN SCHEMA public GRANT SELECT ON TABLES TO taxitrio_backup;


-- Completed on 2026-07-11 20:09:15

--
-- PostgreSQL database dump complete
--

\unrestrict j4Yp2HSl2Clq7nuhpg4p75RSrtRzDI8zJaMopLldVgqjdhtpdk7cSy7yLsuPZ3W

