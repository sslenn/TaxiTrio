const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');
const { encrypt, decrypt } = require('../src/utils/crypto');

const encryptFields = (user) => {
  if (user.changed('phone') && user.phone) {
    user.phone = encrypt(user.phone);
  }
  if (user.changed('license_number') && user.license_number) {
    user.license_number = encrypt(user.license_number);
  }
};

const decryptFields = (user) => {
  if (user.phone) {
    user.phone = decrypt(user.phone);
  }
  if (user.license_number) {
    user.license_number = decrypt(user.license_number);
  }
};

const User = sequelize.define('User', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  full_name:  { type: DataTypes.STRING(100), allowNull: false },
  email:      { type: DataTypes.STRING(150), allowNull: false, unique: true },
  phone:      { type: DataTypes.STRING(100) }, // Increased length to hold iv:tag:encrypted string
  password:   { type: DataTypes.STRING(255), allowNull: true },
  role:       { type: DataTypes.ENUM('traveler', 'driver', 'admin'), defaultValue: 'traveler' },
  avatar_url: { type: DataTypes.STRING(500) },
  is_active:  { type: DataTypes.BOOLEAN, defaultValue: true },
  must_change_password: { type: DataTypes.BOOLEAN, defaultValue: false },
  reset_password_token: { type: DataTypes.STRING(255) },
  reset_password_expires: { type: DataTypes.DATE },
  status:     { type: DataTypes.STRING(50), defaultValue: 'active' },
  activation_token: { type: DataTypes.STRING(255) },
  token_expires_at: { type: DataTypes.DATE },
  license_number: { type: DataTypes.STRING(150) } // Increased length to hold iv:tag:encrypted string
}, { 
  underscored: true, 
  tableName: 'users',
  hooks: {
    beforeSave: encryptFields,
    afterFind: (results) => {
      if (!results) return;
      if (Array.isArray(results)) {
        results.forEach(decryptFields);
      } else {
        decryptFields(results);
      }
    }
  }
});

module.exports = User;
