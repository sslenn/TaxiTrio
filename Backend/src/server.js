const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // load environment variables from .env file
const express = require('express'); 
const cors = require('cors');  // enable CORS for frontend-backend communication
const morgan = require('morgan');  // for logging HTTP requests
const cookieParser = require('cookie-parser'); // store refresh token in httpOnly cookie

const { sequelize } = require('../models'); //
const errorMiddleware = require('./middlewares/error_middlewares'); // centralized error handling middleware

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
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

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

// Sync database with Sequelize models
sequelize.sync()
  .then(() => {
    const config = sequelize.config;
    console.log(`Database connected & synced to ${config.host}:${config.port || 5432}/${config.database}`);
    const server = app.listen(PORT, async () => {
      console.log(`TaxiTrio API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err.message);
    process.exit(1);
  });
