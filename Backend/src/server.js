const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // load environment variables from .env file
const express = require('express'); 
const cors = require('cors');  // enable CORS for frontend-backend communication
const morgan = require('morgan');  // for logging HTTP requests
const cookieParser = require('cookie-parser'); // store refresh token in httpOnly cookie

const { sequelize } = require('../models'); //
const errorMiddleware = require('./middlewares/error_middlewares'); // centralized error handling middleware
const localeMiddleware = require('./middlewares/localeMiddleware'); // language negotiation middleware

const authRoutes        = require('./routes/auth_routes');  //
const userRoutes        = require('./routes/user_routes');
const driverRoutes      = require('./routes/driver_routes');
const vehicleRoutes     = require('./routes/vehicle_routes');
const routeRoutes       = require('./routes/route_routes');
const packageRoutes     = require('./routes/package_routes');
const bookingRoutes     = require('./routes/booking_routes');
const paymentRoutes     = require('./routes/payment_routes');
const paymentRoutesNew  = require('./routes/paymentRoutes');
const customTripRoutes  = require('./routes/customTrip_routes');
const reviewRoutes      = require('./routes/review_routes');
const notificationRoutes = require('./routes/notification_routes');
const reportRoutes      = require('./routes/report_routes');

const app = express();

app.set('trust proxy', 1); // trust first proxy (Vite proxy, Render, Heroku, Cloudflare, etc.)

app.use(cors());
app.use(morgan('dev'));   // log HTTP requests to console
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.includes('/webhook') || req.originalUrl.includes('/webhooks')) {
      req.rawBody = buf;
    }
  }
}));   // parse JSON request bodies and capture raw body for webhook verification
app.use(cookieParser()); // parse cookies for refresh token handling
app.use(localeMiddleware); // resolve language and auto-translate responses
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

// Swagger API Documentation routes
app.get('/api/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'swagger.html'));
});
app.use('/api/docs/swagger.json', express.static(path.join(__dirname, '..', 'public', 'swagger.json')));

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', driverRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', routeRoutes);
app.use('/api', packageRoutes);
app.use('/api', bookingRoutes);
app.use('/api', paymentRoutes);
app.use('/api', paymentRoutesNew);
app.use('/', paymentRoutesNew);
app.use('/api', customTripRoutes);
app.use('/api', reviewRoutes);
app.use('/api', notificationRoutes);
app.use('/api', reportRoutes);

app.use(errorMiddleware); // centralized error handling




const PORT = process.env.PORT || 5000;

const migrateTableToJsonb = async () => {
  try {
    // --- 1. Migrations for transportation_packages ---
    const [packagesExist] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'transportation_packages'
      );
    `);
    
    if (packagesExist && packagesExist[0] && packagesExist[0].exists) {
      const [colInfo] = await sequelize.query(`
        SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'transportation_packages' AND column_name = 'name';
      `);
      
      if (colInfo && colInfo[0] && colInfo[0].data_type !== 'jsonb') {
        console.log('Migrating transportation_packages name and description columns to JSONB...');
        await sequelize.query(`
          ALTER TABLE transportation_packages 
          ALTER COLUMN name TYPE jsonb USING (jsonb_build_object('en', name)),
          ALTER COLUMN description TYPE jsonb USING (jsonb_build_object('en', description));
        `);
        console.log('transportation_packages columns migrated to JSONB successfully.');
      }

      // Add translation_status column if it doesn't exist
      const [statusColExists] = await sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'transportation_packages' AND column_name = 'translation_status'
        );
      `);
      if (statusColExists && statusColExists[0] && !statusColExists[0].exists) {
        console.log('Adding translation_status column to transportation_packages...');
        await sequelize.query(`
          ALTER TABLE transportation_packages 
          ADD COLUMN translation_status varchar(20) DEFAULT 'Pending' NOT NULL;
        `);
      }
    }

    // --- 2. Migrations for routes ---
    const [routesExist] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'routes'
      );
    `);
    
    if (routesExist && routesExist[0] && routesExist[0].exists) {
      const [colInfo] = await sequelize.query(`
        SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'routes' AND column_name = 'origin';
      `);
      
      if (colInfo && colInfo[0] && colInfo[0].data_type !== 'jsonb') {
        console.log('Migrating routes origin and destination columns to JSONB...');
        await sequelize.query(`
          ALTER TABLE routes 
          ALTER COLUMN origin TYPE jsonb USING (jsonb_build_object('en', origin)),
          ALTER COLUMN destination TYPE jsonb USING (jsonb_build_object('en', destination));
        `);
        console.log('routes columns migrated to JSONB successfully.');
      }

      // Add translation_status column if it doesn't exist
      const [statusColExists] = await sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'routes' AND column_name = 'translation_status'
        );
      `);
      if (statusColExists && statusColExists[0] && !statusColExists[0].exists) {
        console.log('Adding translation_status column to routes...');
        await sequelize.query(`
          ALTER TABLE routes 
          ADD COLUMN translation_status varchar(20) DEFAULT 'Pending' NOT NULL;
        `);
      }
    }
  } catch (err) {
    console.error('Error during database schema migrations:', err);
  }
};

// Sync database with Sequelize models
sequelize.sync()
  .then(async () => {
    const config = sequelize.config;
    console.log(`Database connected & synced to ${config.host}:${config.port || 5432}/${config.database}`);
    
    // Automatically migrate columns if they aren't JSONB yet
    await migrateTableToJsonb();
    
    const server = app.listen(PORT, async () => {
      console.log(`TaxiTrio API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err.message);
    process.exit(1);
  });
