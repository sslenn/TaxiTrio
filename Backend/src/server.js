require('dotenv').config(); // load environment variables from .env file
const express = require('express'); 
const cors = require('cors');  // enable CORS for frontend-backend communication
const morgan = require('morgan');  // for logging HTTP requests
const path = require('path');    // for serving uploaded files
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
const customTripRoutes  = require('./routes/customTrip_routes');
const reviewRoutes      = require('./routes/review_routes');
const notificationRoutes = require('./routes/notification_routes');
const reportRoutes      = require('./routes/report_routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));   // log HTTP requests to console
app.use(express.json());   // parse JSON request bodies
app.use(cookieParser()); // parse cookies for refresh token handling
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

// 1. CSRF Token Generation endpoint (exempt from CSRF checks)
app.get('/api/csrf-token', (req, res) => {
  const { generateToken } = require('./middlewares/csrf_middleware');
  res.json({ csrfToken: generateToken(req, res) });
});

// 2. Global CSRF Protection Middleware (with webhook bypass)
const { doubleCsrfProtection } = require('./middlewares/csrf_middleware');
app.use((req, res, next) => {
  if (req.path === '/api/payments/webhook' || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  doubleCsrfProtection(req, res, next);
});

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', driverRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', routeRoutes);
app.use('/api', packageRoutes);
app.use('/api', bookingRoutes);
app.use('/api', paymentRoutes);
app.use('/api', customTripRoutes);
app.use('/api', reviewRoutes);
app.use('/api', notificationRoutes);
app.use('/api', reportRoutes);

app.use(errorMiddleware); // centralized error handling




const PORT = process.env.PORT || 5000;

// sync: false — tables already created by your SQL scripts
sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
    const server = app.listen(PORT, async () => {
      console.log(`TaxiTrio API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err.message);
    process.exit(1);
  });
