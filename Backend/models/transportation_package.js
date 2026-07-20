const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');
const TranslationService = require('../src/services/TranslationService');

const TransportationPackage = sequelize.define('TransportationPackage', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:          { 
    type: DataTypes.JSONB, 
    allowNull: false,
    set(val) {
      if (typeof val === 'string') {
        this.setDataValue('name', { en: val });
      } else {
        this.setDataValue('name', val);
      }
    }
  },
  description:   { 
    type: DataTypes.JSONB, 
    allowNull: true,
    set(val) {
      if (typeof val === 'string') {
        this.setDataValue('description', { en: val });
      } else {
        this.setDataValue('description', val);
      }
    }
  },
  price:              { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  duration_days:      { type: DataTypes.INTEGER, allowNull: false },
  max_persons:        { type: DataTypes.INTEGER, allowNull: false },
  image_url:          { type: DataTypes.STRING(255), allowNull: true },
  is_active:          { type: DataTypes.BOOLEAN, defaultValue: true },
  translation_status: { type: DataTypes.STRING(20), defaultValue: 'Pending', allowNull: false }
}, { underscored: true, tableName: 'transportation_packages' });

// Register generic translation hooks
TransportationPackage.addHook('beforeCreate', async (pkg) => {
  await TranslationService.translateFields(pkg, ['name', 'description']);
});

TransportationPackage.addHook('beforeUpdate', async (pkg) => {
  // Translate fields if either name or description changed
  if (pkg.changed('name') || pkg.changed('description')) {
    await TranslationService.translateFields(pkg, ['name', 'description']);
  }
});

module.exports = TransportationPackage;
