'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define paths to trigger and role SQL scripts
    const triggerSqlPath = path.join(__dirname, '..', '..', 'database', 'trigger', 'trigger.sql');
    const roleSqlPath = path.join(__dirname, '..', '..', 'database', 'role', 'role.sql');

    // Read the scripts
    const triggerSql = fs.readFileSync(triggerSqlPath, 'utf8');
    const roleSql = fs.readFileSync(roleSqlPath, 'utf8');

    // Make the migration UP idempotent by cleaning up existing objects first
    console.log('Migration UP: Cleaning up pre-existing triggers, functions, and roles...');
    
    // Drop triggers
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_users_updated_at ON users CASCADE;
      DROP TRIGGER IF EXISTS trg_vehicles_updated_at ON vehicles CASCADE;
      DROP TRIGGER IF EXISTS trg_routes_updated_at ON routes CASCADE;
      DROP TRIGGER IF EXISTS trg_transportation_packages_updated_at ON transportation_packages CASCADE;
      DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings CASCADE;
      DROP TRIGGER IF EXISTS trg_payment_records_updated_at ON payment_records CASCADE;
      DROP TRIGGER IF EXISTS trg_custom_trip_requests_updated_at ON custom_trip_requests CASCADE;
      DROP TRIGGER IF EXISTS trg_reviews_updated_at ON reviews CASCADE;
      DROP TRIGGER IF EXISTS trg_notifications_updated_at ON notifications CASCADE;
      DROP TRIGGER IF EXISTS trg_pricing_rules_updated_at ON pricing_rules CASCADE;

      DROP TRIGGER IF EXISTS trg_booking_status_log ON bookings CASCADE;
      DROP TRIGGER IF EXISTS trg_payment_status_notify ON payment_records CASCADE;
      DROP TRIGGER IF EXISTS trg_booking_driver_action_notify ON bookings CASCADE;
      DROP TRIGGER IF EXISTS trg_vehicle_availability ON bookings CASCADE;
    `).catch(() => {});

    // Drop functions
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_set_updated_at() CASCADE;
      DROP FUNCTION IF EXISTS fn_log_booking_status() CASCADE;
      DROP FUNCTION IF EXISTS fn_notify_payment_status() CASCADE;
      DROP FUNCTION IF EXISTS fn_notify_booking_driver_action() CASCADE;
      DROP FUNCTION IF EXISTS fn_vehicle_availability() CASCADE;
    `).catch(() => {});

    // Drop roles
    await queryInterface.sequelize.query(`
      DROP ROLE IF EXISTS taxitrio_owner, taxitrio_admin, taxitrio_app, taxitrio_readonly, taxitrio_backup;
    `).catch(() => {});

    // Execute scripts sequentially in the database
    console.log('Migration UP: Applying database triggers...');
    await queryInterface.sequelize.query(triggerSql);

    console.log('Migration UP: Applying database roles and permissions...');
    await queryInterface.sequelize.query(roleSql);
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback triggers
    console.log('Migration DOWN: Dropping triggers...');
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_users_updated_at ON users CASCADE;
      DROP TRIGGER IF EXISTS trg_vehicles_updated_at ON vehicles CASCADE;
      DROP TRIGGER IF EXISTS trg_routes_updated_at ON routes CASCADE;
      DROP TRIGGER IF EXISTS trg_transportation_packages_updated_at ON transportation_packages CASCADE;
      DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings CASCADE;
      DROP TRIGGER IF EXISTS trg_payment_records_updated_at ON payment_records CASCADE;
      DROP TRIGGER IF EXISTS trg_custom_trip_requests_updated_at ON custom_trip_requests CASCADE;
      DROP TRIGGER IF EXISTS trg_reviews_updated_at ON reviews CASCADE;
      DROP TRIGGER IF EXISTS trg_notifications_updated_at ON notifications CASCADE;
      DROP TRIGGER IF EXISTS trg_pricing_rules_updated_at ON pricing_rules CASCADE;

      DROP TRIGGER IF EXISTS trg_booking_status_log ON bookings CASCADE;
      DROP TRIGGER IF EXISTS trg_payment_status_notify ON payment_records CASCADE;
      DROP TRIGGER IF EXISTS trg_booking_driver_action_notify ON bookings CASCADE;
      DROP TRIGGER IF EXISTS trg_vehicle_availability ON bookings CASCADE;
    `);

    // Rollback functions
    console.log('Migration DOWN: Dropping trigger functions...');
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_set_updated_at() CASCADE;
      DROP FUNCTION IF EXISTS fn_log_booking_status() CASCADE;
      DROP FUNCTION IF EXISTS fn_notify_payment_status() CASCADE;
      DROP FUNCTION IF EXISTS fn_notify_booking_driver_action() CASCADE;
      DROP FUNCTION IF EXISTS fn_vehicle_availability() CASCADE;
    `);

    // Rollback roles
    console.log('Migration DOWN: Dropping database roles...');
    await queryInterface.sequelize.query(`
      DROP ROLE IF EXISTS taxitrio_owner, taxitrio_admin, taxitrio_app, taxitrio_readonly, taxitrio_backup;
    `);
  }
};
