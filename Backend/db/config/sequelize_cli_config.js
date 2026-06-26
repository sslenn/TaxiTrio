const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const isLocal = process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1'));
const useSSL = process.env.DB_SSL === 'true' || (process.env.DB_SSL !== 'false' && !isLocal);

const dbConfig = process.env.DATABASE_URL 
  ? {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: useSSL ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    }
  : {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      dialect: 'postgres',
      dialectOptions: useSSL ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    };

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};
