const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');
const TranslationService = require('../src/services/TranslationService');

const Route = sequelize.define('Route', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  origin:       { 
    type: DataTypes.JSONB, 
    allowNull: false,
    set(val) {
      if (typeof val === 'string') {
        this.setDataValue('origin', { en: val });
      } else {
        this.setDataValue('origin', val);
      }
    }
  },
  destination:  { 
    type: DataTypes.JSONB, 
    allowNull: false,
    set(val) {
      if (typeof val === 'string') {
        this.setDataValue('destination', { en: val });
      } else {
        this.setDataValue('destination', val);
      }
    }
  },
  distance_km:        { type: DataTypes.DECIMAL(8, 2), allowNull: false },
  base_price:         { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  duration_hrs:       { type: DataTypes.DECIMAL(5, 2) },
  is_active:          { type: DataTypes.BOOLEAN, defaultValue: true },
  translation_status: { type: DataTypes.STRING(20), defaultValue: 'Pending', allowNull: false }
}, { underscored: true, tableName: 'routes' });

// Register generic translation hooks
Route.addHook('beforeCreate', async (route) => {
  await TranslationService.translateFields(route, ['origin', 'destination']);
});

Route.addHook('beforeUpdate', async (route) => {
  if (route.changed('origin') || route.changed('destination')) {
    await TranslationService.translateFields(route, ['origin', 'destination']);
  }
});

module.exports = Route;
