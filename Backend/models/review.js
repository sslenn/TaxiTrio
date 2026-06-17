const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const Review = sequelize.define('Review', {
  id:      { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  rating:  { type: DataTypes.SMALLINT, allowNull: false },
  comment: { type: DataTypes.TEXT },
}, { underscored: true, tableName: 'reviews' });

module.exports = Review;
