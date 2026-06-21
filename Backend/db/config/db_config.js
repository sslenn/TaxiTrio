require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // If connection string is provided (e.g. for Supabase, Neon, Render, Heroku)
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
  const useSSL = process.env.DB_SSL === 'true' || (process.env.DB_SSL !== 'false' && !isLocal);

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: useSSL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
  });
} else {
  // Fallback to individual connection parameters
  const useSSL = process.env.DB_SSL === 'true';
  
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: useSSL ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {},
    }
  );
}

module.exports = sequelize;
