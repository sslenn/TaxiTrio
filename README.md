# TaxiTrio — Premium Transportation Booking Platform

A full-stack, enterprise-grade transportation booking and management system designed for local and international travelers in Cambodia. This platform offers seamless point-to-point city rides, fixed-route intercity transfers, curated tour packages, and bespoke custom itineraries.

---

## 1. Project Objectives & Problem Statement

### The Problem
Traveling across Cambodia often presents challenges for both international tourists and locals due to:
* **Opaque Pricing**: Lack of standardized, transparent route-based pricing, leading to haggling or unfair tourist rates.
* **Rigid Itineraries**: Conventional platforms fail to accommodate travelers who want custom stopovers, customized travel schedules, or multi-day tours.
* **Security & Verification Gaps**: Cash-only payments lack verification, while backend session handling in conventional systems exposes sensitive user data to theft.
* **Inefficient Fleet Coordination**: Difficulty in pairing available, vetted drivers with travelers automatically based on real-time driver dispatch states.

### Project Objectives
* **Standardize Booking Types**: Provide City Rides (coordinate-based pricing), Intercity Transfers (fixed pricing), and Tour Packages (curated guides) in a single platform.
* **Support Bespoke Custom Trips**: Allow travelers to propose custom routes, layout schedules, and receive verified admin quotes.
* **Harden Application Security**: Implement cryptographic user role checks, separate database operational roles, and set up state-of-the-art token security (short-lived access tokens + HTTP-only refresh tokens) to defend against XSS and CSRF attacks.
* **Automate Driver Dispatching**: Leverage background algorithms to match available drivers with verified bookings automatically.

---

## 2. Solution Design & Architecture

TaxiTrio employs a decoupled, multi-tier architecture to separate presentation, business logic, and data storage:

```
                  ┌──────────────────────────────────────────┐
                  │                 FRONTEND                 │
                  │   Vite + React 18 (Component-driven)     │
                  └────────────────────┬─────────────────────┘
                                       │
                         JSON API (JWT via HTTP-only)
                                       │
                  ┌────────────────────▼─────────────────────┐
                  │              BACKEND API                 │
                  │       Express.js (MVC / Service)         │
                  └────────────────────┬─────────────────────┘
                                       │
                               Sequelize ORM
                                       │
                  ┌────────────────────▼─────────────────────┐
                  │               DATABASE                   │
                  │    PostgreSQL (5-Role Security Scheme)   │
                  └──────────────────────────────────────────┘
```

### Architectural Highlights
* **Service-Oriented Backend**: Express routes delegate incoming requests to thin Controllers, which coordinate operations through dedicated Service layers ([`booking_service.js`](file:///C:/Users/PCN/OneDrive%20-%20Cambodia%20Academy%20of%20Digital%20Technology/CADT_Y2/Y2T3-Subjects/TaxiTrio/TaxiTrio/Backend/src/services/booking_service.js), [`auth_service.js`](file:///C:/Users/PCN/OneDrive%20-%20Cambodia%20Academy%20of%20Digital%20Technology/CADT_Y2/Y2T3-Subjects/TaxiTrio/TaxiTrio/Backend/src/services/auth_service.js)) rather than querying directly.
* **Component-driven React UI**: Responsive components (Navbars, live widgets) styled in custom CSS, utilizing Vite proxy redirection to route frontend requests cleanly during development.
* **Database Trigger Automations**: Uses PostgreSQL triggers ([`trigger.sql`](file:///C:/Users/PCN/OneDrive%20-%20Cambodia%20Academy%20of%20Digital%20Technology/CADT_Y2/Y2T3-Subjects/TaxiTrio/TaxiTrio/database/trigger/trigger.sql)) to automatically write logs to status history tables and notify travelers of status changes.

---

## 3. Technology Stack

* **Frontend**: React 18, Vite (build engine), React Router v6 (routing), Axios (HTTP client), Leaflet (map route pickups).
* **Backend**: Node.js, Express.js (REST server), Sequelize (PostgreSQL ORM), JSON Web Tokens (authentication), Multer (payment proof uploads), Bcrypt (password hashing).
* **Database**: PostgreSQL (relational database).

---

## 4. Hardened Security Features

This project was built following industry-best security recommendations:

### A. Access Token & HTTP-only Refresh Token Rotation
To mitigate Session Hijacking, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF):
* **Access Token**: Short-lived (**20 minutes**) signed token, used in request headers to authorize API requests.
* **Refresh Token**: Long-lived (**7 days**) token stored in an **`HttpOnly`** cookie. This prevents malicious scripts from reading or stealing your refresh keys.
* **Axios Interceptors**: The React client automatically catches expired 401 errors, requests a refreshed access token silently from `/api/auth/refresh` using cookie credentials, and replays the original failed requests.

### B. Vertical & Horizontal Privilege Escalation Protection
* **Vertical Protection**: Middleware functions (`authorize('admin')`, `authorize('driver')`) intercept routes to block standard travelers from viewing administrative views.
* **Horizontal Protection**: Service methods query resources based on user ownership. For instance, when Alice requests a booking detail page, the database validates `where traveler_id = Alice.id`, returning `404 Not Found` if she attempts to view Bob's booking ID.

### C. 5-Role Database Privilege Architecture ([`role.sql`](file:///C:/Users/PCN/OneDrive%20-%20Cambodia%20Academy%20of%20Digital%20Technology/CADT_Y2/Y2T3-Subjects/TaxiTrio/TaxiTrio/database/role/role.sql))
The database enforces separation of operational concerns using 5 distinct roles:
1. `taxitrio_owner`: Owns schema schemas and carries out setup.
2. `taxitrio_admin`: DBA maintenance (table structure operations).
3. `taxitrio_app`: Used by the Node API (restricted to `SELECT`, `INSERT`, `UPDATE`, `DELETE` CRUD operations).
4. `taxitrio_readonly`: Safe SELECT-only queries for reporting/BI.
5. `taxitrio_backup`: Safe SELECT-only queries for scheduled database dumps.

### D. Real-Time Telegram Concierge Alerts (Admin Notification Loop)
To enable instantaneous administrative response to traveler requests:
* **Trigger Alerts**: The backend automatically dispatches HTML-formatted alert messages to the Admin's Telegram channel or chat whenever a traveler registers, creates a booking, submits a custom trip request, or uploads bank transfer receipt images for verification.
* **Webhook Integration**: Includes a webhook listener (`/api/telegram/webhook`) to handle interactive queries and callback tasks directly from the Telegram application.

---

## 5. Directory Structure

```
TaxiTrio/
├── database/                   # Database scripts
│   ├── ddl/                    # Schema tables definition scripts
│   │   ├── createTables.sql
│   │   └── update_pricing_routing.sql
│   ├── dml/                    # Initial seed insertions
│   │   └── sample_dataInsertion.sql
│   ├── role/                   # Idempotent database roles configuration
│   │   └── role.sql
│   └── trigger/                # Trigger audit logs and automations
│       └── trigger.sql
│
├── Backend/                    # Express API Backend
│   ├── src/
│   │   ├── controllers/        # Express Route Handlers
│   │   ├── middlewares/        # Auth validation & error log filters
│   │   ├── models/             # Sequelize configurations
│   │   ├── routes/             # REST Endpoints mapping
│   │   ├── services/           # DB query transactions (CRUD & dispatch)
│   │   └── server.js           # Server startup script
│   ├── .env                    # Secret environment configs
│   └── package.json
│
└── frontend/                   # Vite + React Frontend
    ├── src/
    │   ├── components/         # Reusable layouts & live summaries
    │   ├── context/            # Language & display context
    │   ├── lib/                # Custom Axios instance with interceptors
    │   ├── pages/              # Role-specific dashboard views
    │   └── utils/              # Token read/write handlers
    └── package.json
```

---

## 6. API Reference

### Authentication Routing
| Method | Endpoint | Authorization | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Public | Registers a new traveler account |
| `POST` | `/api/auth/login` | Public | Logs in a user, returning access JSON & HTTP-only cookie |
| `POST` | `/api/auth/refresh` | Cookie Required | Generates new access and rotated refresh tokens |
| `POST` | `/api/auth/logout` | Cookie Required | Clears the HTTP-only cookie |
| `GET` | `/api/auth/me` | Authenticated | Retrieves the current user's profile |

### Traveler Services
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/routes` | Lists active intercity routes |
| `GET` | `/api/packages` | Lists available holiday package options |
| `POST` | `/api/bookings` | Creates a new booking (estimated automatically if coordinates provided) |
| `GET` | `/api/bookings/my-bookings`| Returns the traveler's personal booking history |
| `GET` | `/api/bookings/:id` | Returns details for a specific booking (ownership validated) |
| `PATCH`| `/api/bookings/:id/cancel` | Cancels a booking (only valid if pending payment) |
| `POST` | `/api/payments` | Uploads bank transfer proof (multipart/form-data) |
| `POST` | `/api/custom-trip-requests`| Submits a custom itinerary request |

### Driver Services
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/driver/bookings` | Lists currently active/assigned bookings |
| `PATCH`| `/api/driver/bookings/:id/accept`| Accepts an assigned booking |
| `PATCH`| `/api/driver/bookings/:id/reject`| Rejects assignment (triggers admin alert + auto-dispatch) |
| `PATCH`| `/api/driver/bookings/:id/status`| Updates ride status (`en_route`, `arrived`, `completed`) |
| `GET` | `/api/driver/earnings` | Calculates gross and net driver payouts |

### Admin Services
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/admin/users` | Lists all platform users with account controls |
| `GET` | `/api/admin/drivers` | Lists all drivers and vehicle assignment statuses |
| `POST` | `/api/admin/vehicles` | Adds a new vehicle to the fleet |
| `PATCH`| `/api/admin/bookings/:id/assign-driver`| Manually assigns a driver and vehicle to a verified booking |
| `PATCH`| `/api/admin/payments/:id/verify`| Verifies custom payments, moving bookings to auto-dispatch |

---

## 7. Setup & Installation

### Prerequisite: PostgreSQL Setup
1. Open your terminal or PGAdmin and create the database:
   ```sql
   CREATE DATABASE taxitrio;
   ```
2. Navigate to the root directory and run the initialization scripts:
   ```bash
   # 1. Create table schemas
   psql -U postgres -d taxitrio -f database/ddl/createTables.sql
   
   # 2. Add dynamic routing and pricing rules
   psql -U postgres -d taxitrio -f database/ddl/update_pricing_routing.sql
   
   # 3. Initialize secure database roles
   psql -U postgres -d taxitrio -f database/role/role.sql
   
   # 4. Bind database triggers
   psql -U postgres -d taxitrio -f database/trigger/trigger.sql
   
   # 5. Seed initial mock tables
   psql -U postgres -d taxitrio -f database/dml/sample_dataInsertion.sql
   ```

### Backend Installation
1. Open the `/Backend` directory:
   ```bash
   cd Backend
   ```
2. Create your `.env` configuration file:
   ```bash
   cp .env.example .env # On Windows: copy .env.example .env
   ```
3. Install package configurations and start development server:
   ```bash
   npm install
   npm run dev
   ```

### Frontend Installation
1. Open the `/frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install package parameters:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *Note: Vite handles routing proxy parameters automatically, sending all `/api` traffic directly to the backend.*

---

## 8. Default Mock Accounts for Reviewers

Use these credentials to log in and review the corresponding dashboards on the UI:

| Role | User Type | Email | Password |
|:---|:---|:---|:---|
| **Admin** | Concierge Operator | `admin@taxitrio.com` | `Password123!` |
| **Driver** | Professional Chauffeur | `dara@driver.com` | `Password123!` |
| **Traveler** | Standard Customer | `maly@traveler.com` | `Password123!` |
