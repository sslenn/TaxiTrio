const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const PaymentRecord = sequelize.define('PaymentRecord', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount:         { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payment_method: { type: DataTypes.STRING(50), allowNull: false },
  proof_url:      { type: DataTypes.STRING(500) },
  status:         { 
    type: 'payment_status', 
    defaultValue: 'pending' 
  },
  verified_at:    { type: DataTypes.DATE },
}, { underscored: true, tableName: 'payment_records' });

module.exports = PaymentRecord;
