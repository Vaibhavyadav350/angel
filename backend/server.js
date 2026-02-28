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

// requiring middlewares
const errorMiddleware = require('./middleware/Error');

// require db configs
const connectToDb = require('./config/db');

// require cloudinary configs
const cloudinary = require('./config/cloudinary');

// uncaught exception
process.on('uncaughtException', async (err) => {
  console.error(`Error: ${err.message}`);
  console.error(`Server shutting down due to uncaught exception`);
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
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed.includes('*')) {
          const regex = new RegExp(allowed.replace(/\*/g, '.*'));
          return regex.test(origin);
        }
        return origin === allowed || origin.includes(allowed);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());

// Stripe Webhooks need the raw body, so express.raw must come BEFORE express.json
const webhookController = require('./controllers/webhookController');
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), webhookController);

app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

// basic api route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API service running 🚀',
  });
});

// using routers
app.use('/api/payment', paymentRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/users', userRouter);
app.use('/api/restock', restockRouter);

// using other middlewares
app.use(errorMiddleware);

// starting server
// connect to db and start server
connectToDb().then(() => {
  const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Server running');
  });

  // unhandled promise rejection
  process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    console.error(`Server shutting down due to unhandled promise rejection`);
    server.close(async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
      }
      process.exit(1);
    });
  });
});
