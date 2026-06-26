const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const PricingRule = sequelize.define('PricingRule', {
  id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vehicle_type:     { 
    type: 'vehicle_type', 
    allowNull: false 
  },
  booking_type:     { 
    type: 'booking_type', 
    allowNull: false 
  },
  base_fare:        { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 1.00 },
  per_km_rate:      { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.50 },
  per_minute_rate:  { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.05 },
  surge_multiplier: { type: DataTypes.DECIMAL(3, 2), allowNull: false, defaultValue: 1.00 },
  is_active:        { type: DataTypes.BOOLEAN, defaultValue: true },
}, { 
  underscored: true, 
  tableName: 'pricing_rules',
  indexes: [
    {
      unique: true,
      fields: ['vehicle_type', 'booking_type']
    }
  ]
});

module.exports = PricingRule;
