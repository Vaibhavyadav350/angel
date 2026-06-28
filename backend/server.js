// load env-vars
require('dotenv').config();

// requiring dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// initialize express
const app = express();

// requiring routers
const paymentRouter = require('./routes/paymentRouter');
const productRouter = require('./routes/productRouter');
const adminRouter = require('./routes/adminRouter');
const orderRouter = require('./routes/orderRouter');
const uploadRouter = require('./routes/uploadRouter');
const newsletterRouter = require('./routes/newsletterRouter');
const analyticsRouter = require('./routes/analyticsRouter');
const couponRouter = require('./routes/couponRouter');
const userRouter = require('./routes/userRouter');
const restockRouter = require('./routes/restockRouter');
const bannerRouter = require('./routes/bannerRouter');
const featuredCollectionRouter = require('./routes/featuredCollectionRouter');
const testimonialRouter = require('./routes/testimonialRouter');
const settingsRouter = require('./routes/settingsRouter');
const categoryRouter = require('./routes/categoryRouter');

// requiring middlewares
const errorMiddleware = require('./middleware/Error');

// require db configs
const connectToDb = require('./config/db');

// require cloudinary configs
const cloudinary = require('./config/cloudinary');

// require reconciliation service
const { startReconciliationJob } = require('./services/reconciliationService');

// uncaught exception
process.on('uncaughtException', async (err) => {
  console.error(`[SERVER FATAL] Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(1);
});

// connect to db
// connectToDb() moved to start server block

// using middlewares
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://admin.localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      const isAllowed = allowedOrigins.some(allowed => {
        // Handle trailing slashes gracefully
        const originClean = origin.replace(/\/$/, '');
        const allowedClean = allowed.trim().replace(/\/$/, '');

        if (allowedClean.includes('*')) {
          const regex = new RegExp(allowedClean.replace(/\*/g, '.*'));
          return regex.test(originClean);
        }
        return originClean === allowedClean;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS BLOCKED] Origin rejected: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,       // 1 year
    includeSubDomains: true,
    preload: true,          // eligible for browser HSTS preload list
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
// Permissions-Policy: disable browser features the app never uses
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
});
app.use(mongoSanitize());

// Rate Limiting (Prevents Brute-Force & basic DDoS)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const strictLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 150, // Increased: admin dashboard fires 5+ calls/page, 20 was causing false rate-limit errors
  message: 'Too many sensitive requests, please try again after 10 minutes',
});

// eWAY callback routes — registered before app.use(express.json) as these are redirect-based
const ewayCallbackController = require('./controllers/webhookController');
const PendingCheckout = require('./models/pendingCheckoutModel');

app.get('/api/payment/callback', ewayCallbackController);

// eWAY cancel route — user clicked "Cancel" on the hosted page
// Routing through backend keeps the AccessCode out of the user's browser history
app.get('/api/payment/cancel', async (req, res) => {
  // Single explicit customer URL (see note in webhookController) — not the CORS list.
  const FRONTEND_URL = process.env.FRONTEND_PUBLIC_URL || 'https://www.angelfashionstudio.org';
  const { AccessCode } = req.query;
  if (AccessCode) {
    PendingCheckout.findOneAndUpdate(
      { accessCode: AccessCode, status: 'pending' },
      { status: 'failed' }
    ).catch(() => {});
  }
  return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
});

app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

// basic api route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API service running 🚀',
  });
});

// RFC 9116 — security.txt
app.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain').send(
    `Contact: mailto:${process.env.SECURITY_CONTACT_EMAIL || 'admin@angelfashionstudio.org'}\n` +
    `Preferred-Languages: en\n` +
    `Policy: https://www.angelfashionstudio.org/privacy-policy\n`
  );
});

// using routers
app.use('/api/payment', paymentRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', strictLimiter, adminRouter); // Protect admin endpoints
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/users', userRouter);
app.use('/api/restock', restockRouter);
app.use('/api/banners', bannerRouter);
app.use('/api/featured-collections', featuredCollectionRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/categories', categoryRouter);

// using other middlewares
app.use(errorMiddleware);

// starting server
// connect to db and start server
connectToDb().then(() => {
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.info(`[SERVER] Angel Fashion Studio API running on port ${port} | ENV: ${process.env.NODE_ENV || 'development'}`);
    console.info(`[SERVER] CORS origins: ${allowedOrigins.join(', ')}`);
  });

  // Start background reconciliation job for missed eWAY payment callbacks
  startReconciliationJob();

  // unhandled promise rejection
  process.on('unhandledRejection', (err) => {
    console.error(`[SERVER FATAL] Unhandled Promise Rejection: ${err.message}`);
    console.error(err.stack);
    server.close(async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
      }
      process.exit(1);
    });
  });
});
