-- TaxiTrio Enterprise-Hardened Database Roles
-- Security Model: Separation of Duties (5-Role Archetype)

-- 1. Setup / Database Owner
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'taxitrio_owner') THEN
      CREATE ROLE taxitrio_owner WITH LOGIN PASSWORD 'taxitrio_owner_pass' CREATEDB CREATEROLE;
   END IF;
END
$$;

-- 2. Database Administrator (DBA)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'taxitrio_admin') THEN
      CREATE ROLE taxitrio_admin WITH LOGIN PASSWORD 'taxitrio_admin_pass' NOSUPERUSER NOCREATEDB NOCREATEROLE;
   END IF;
END
$$;

-- 3. Backend Application Connection
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'taxitrio_app') THEN
      CREATE ROLE taxitrio_app WITH LOGIN PASSWORD 'taxitrio_app_pass' NOSUPERUSER NOCREATEDB NOCREATEROLE;
   END IF;
END
$$;

-- 4. Reporting & Analytics (BI)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'taxitrio_readonly') THEN
      CREATE ROLE taxitrio_readonly WITH LOGIN PASSWORD 'taxitrio_readonly_pass' NOSUPERUSER NOCREATEDB NOCREATEROLE;
   END IF;
END
$$;

-- 5. Backup Operator
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'taxitrio_backup') THEN
      CREATE ROLE taxitrio_backup WITH LOGIN PASSWORD 'taxitrio_backup_pass' NOSUPERUSER NOCREATEDB NOCREATEROLE;
   END IF;
END
$$;

-- SCHEMA PRIVILEGES
-- Grant usage access on public schema
GRANT USAGE ON SCHEMA public TO taxitrio_admin, taxitrio_app, taxitrio_readonly, taxitrio_backup;
GRANT CREATE ON SCHEMA public TO taxitrio_admin; -- Admin can create and modify tables/indexes

-- TABLE PRIVILEGES FOR APP CRUD
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO taxitrio_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO taxitrio_app;

-- TABLE PRIVILEGES FOR BI READONLY
GRANT SELECT ON ALL TABLES IN SCHEMA public TO taxitrio_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO taxitrio_readonly;

-- TABLE PRIVILEGES FOR BACKUP OPERATOR
GRANT SELECT ON ALL TABLES IN SCHEMA public TO taxitrio_backup;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO taxitrio_backup;

-- DEFAULT PRIVILEGES (Ensuring new tables created by admin or owner inherit privileges)
ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_admin, taxitrio_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO taxitrio_app;

ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_admin, taxitrio_owner IN SCHEMA public
  GRANT SELECT ON TABLES TO taxitrio_readonly;

ALTER DEFAULT PRIVILEGES FOR ROLE taxitrio_admin, taxitrio_owner IN SCHEMA public
  GRANT SELECT ON TABLES TO taxitrio_backup;

-- HARDENING DATABASE ACCESS
REVOKE CREATE ON SCHEMA public FROM PUBLIC; -- Block public schema mutations
REVOKE ALL ON DATABASE taxitrio FROM PUBLIC;  -- Restrict raw database connections to authenticated roles
GRANT CONNECT ON DATABASE taxitrio TO taxitrio_owner, taxitrio_admin, taxitrio_app, taxitrio_readonly, taxitrio_backup;
