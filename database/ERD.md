# Database Schema Documentation: ER Diagram & Relational Model

This document serves as the database model specification for the **TaxiTrio** application.

---

## 1. Entity Relationship (ER) Diagram

Below is the database ER diagram specified using Mermaid syntax.

```mermaid
erDiagram
    USERS {
        uuid id PK
        string full_name
        string email UK
        string phone
        string password
        string role
        string avatar_url
        boolean is_active
        boolean must_change_password
        timestamp created_at
        timestamp updated_at
        string reset_password_token
        timestamp reset_password_expires
        string status
        string activation_token
        timestamp token_expires_at
        string license_number
    }
    VEHICLES {
        uuid id PK
        uuid driver_id FK
        string brand
        string model
        string type
        string plate_number UK
        integer capacity
        boolean is_available
        timestamp created_at
        timestamp updated_at
    }
    ROUTES {
        uuid id PK
        string origin UK
        string destination UK
        decimal distance_km
        decimal base_price
        decimal duration_hrs
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    TRANSPORTATION_PACKAGES {
        uuid id PK
        jsonb name
        jsonb description
        decimal price
        integer duration_days
        integer max_persons
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    BOOKINGS {
        uuid id PK
        uuid traveler_id FK
        uuid driver_id FK
        uuid vehicle_id FK
        uuid route_id FK
        uuid package_id FK
        string booking_type
        string status
        string pickup_location
        string dropoff_location
        timestamp pickup_time
        decimal total_fare
        text notes
        timestamp created_at
        timestamp updated_at
        decimal pickup_lat
        decimal pickup_lng
        decimal dropoff_lat
        decimal dropoff_lng
        decimal distance_km
        integer duration_mins
    }
    BOOKING_STATUS_HISTORY {
        uuid id PK
        uuid booking_id FK
        string status
        uuid changed_by FK
        text note
        timestamp created_at
    }
    PAYMENT_RECORDS {
        uuid id PK
        uuid booking_id FK_UK
        uuid traveler_id FK
        decimal amount
        string payment_method
        string proof_url
        string status
        uuid verified_by FK
        timestamp verified_at
        timestamp created_at
        timestamp updated_at
    }
    REVIEWS {
        uuid id PK
        uuid booking_id FK_UK
        uuid traveler_id FK
        uuid driver_id FK
        integer rating
        text comment
        timestamp created_at
        timestamp updated_at
    }
    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string title
        text message
        boolean is_read
        timestamp created_at
        timestamp updated_at
    }
    CUSTOM_TRIP_REQUESTS {
        uuid id PK
        uuid traveler_id FK
        string origin
        string destination
        date travel_date
        integer passengers
        text special_requests
        string status
        text admin_note
        decimal quoted_price
        timestamp created_at
        timestamp updated_at
        string travel_time
        text traveler_response
        string telegram_contact
        boolean is_urgent_requested
    }
    PRICING_RULES {
        uuid id PK
        string vehicle_type UK
        string booking_type UK
        decimal base_fare
        decimal per_km_rate
        decimal per_minute_rate
        decimal surge_multiplier
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    USERS ||--o{ BOOKINGS : "places (as traveler)"
    USERS ||--o{ BOOKINGS : "drives (as driver)"
    USERS ||--o{ BOOKING_STATUS_HISTORY : "logs (as actor)"
    USERS ||--o{ CUSTOM_TRIP_REQUESTS : "requests (as traveler)"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ PAYMENT_RECORDS : "makes (as traveler)"
    USERS ||--o{ PAYMENT_RECORDS : "approves (as admin)"
    USERS ||--o{ REVIEWS : "writes (as traveler)"
    USERS ||--o{ REVIEWS : "receives (as driver)"
    USERS ||--o{ VEHICLES : "assigned_to (as driver)"
    
    VEHICLES ||--o{ BOOKINGS : "used_in"
    ROUTES ||--o{ BOOKINGS : "utilizes"
    TRANSPORTATION_PACKAGES ||--o{ BOOKINGS : "utilizes"
    
    BOOKINGS ||--o{ BOOKING_STATUS_HISTORY : "tracks"
    BOOKINGS ||--|| PAYMENT_RECORDS : "settled_in"
    BOOKINGS ||--|| REVIEWS : "reviewed_in"
```

---

## 2. Relational Model Specification

The relations and constraints of the active database are mapped as follows:

1. **`users`**
   * *Primary Key*: `id` (UUID)
   * *Unique Key*: `email` (VARCHAR)
   * *Constraints*: Encrypted `phone` and `license_number` (crypto AES-256-GCM), password hashed via bcrypt.

2. **`vehicles`**
   * *Primary Key*: `id` (UUID)
   * *Foreign Key*: `driver_id` -> `users.id` (ON DELETE SET NULL)
   * *Unique Key*: `plate_number` (VARCHAR)

3. **`routes`**
   * *Primary Key*: `id` (UUID)
   * *Unique Key*: (`origin`, `destination`) (VARCHAR pair)

4. **`transportation_packages`**
   * *Primary Key*: `id` (UUID)
   * *Constraints*: `name` (JSONB) and `description` (JSONB) support localization.

5. **`bookings`**
   * *Primary Key*: `id` (UUID)
   * *Foreign Keys*: 
     * `traveler_id` -> `users.id` (ON DELETE SET NULL)
     * `driver_id` -> `users.id` (ON DELETE SET NULL)
     * `route_id` -> `routes.id` (ON DELETE SET NULL)
     * `vehicle_id` -> `vehicles.id` (ON DELETE SET NULL)
     * `package_id` -> `transportation_packages.id` (ON DELETE SET NULL)

6. **`booking_status_history`**
   * *Primary Key*: `id` (UUID)
   * *Foreign Keys*:
     * `booking_id` -> `bookings.id` (ON DELETE SET NULL)
     * `changed_by` -> `users.id` (ON DELETE SET NULL)

7. **`payment_records`**
   * *Primary Key*: `id` (UUID)
   * *Unique Key*: `booking_id` (UUID - enforces 1-to-1 booking-to-payment mapping)
   * *Foreign Keys*:
     * `booking_id` -> `bookings.id` (ON DELETE SET NULL)
     * `traveler_id` -> `users.id` (ON DELETE SET NULL)
     * `verified_by` -> `users.id` (ON DELETE SET NULL)

8. **`reviews`**
   * *Primary Key*: `id` (UUID)
   * *Unique Key*: `booking_id` (UUID - enforces 1-to-1 booking-to-review mapping)
   * *Foreign Keys*:
     * `booking_id` -> `bookings.id` (ON DELETE SET NULL)
     * `traveler_id` -> `users.id` (ON DELETE SET NULL)
     * `driver_id` -> `users.id` (ON DELETE SET NULL)

9. **`notifications`**
   * *Primary Key*: `id` (UUID)
   * *Foreign Key*:
     * `user_id` -> `users.id` (ON DELETE SET NULL)

10. **`custom_trip_requests`**
    * *Primary Key*: `id` (UUID)
    * *Foreign Key*:
      * `traveler_id` -> `users.id` (ON DELETE SET NULL)

11. **`pricing_rules`**
    * *Primary Key*: `id` (UUID)
    * *Unique Key*: (`vehicle_type`, `booking_type`) (ENUM pair)
    * *Note*: Standalone configuration entity used by backend estimators; has no external foreign keys.
