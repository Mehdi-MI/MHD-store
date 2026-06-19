const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const morgan         = require('morgan');
const cookieParser   = require('cookie-parser');
const mongoSanitize  = require('express-mongo-sanitize');
const xssClean       = require('xss-clean');
const rateLimit      = require('express-rate-limit');

const errorHandler   = require('./middleware/errorHandler');
const notFound       = require('./middleware/notFound');

// ── Route imports ───────────────────────────────────────────
const authRoutes      = require('./routes/auth.routes');
const userRoutes      = require('./routes/user.routes');
const sellerRoutes    = require('./routes/seller.routes');
const productRoutes   = require('./routes/product.routes');
const categoryRoutes  = require('./routes/category.routes');
const cartRoutes      = require('./routes/cart.routes');
const orderRoutes     = require('./routes/order.routes');
const paymentRoutes   = require('./routes/payment.routes');
const reviewRoutes    = require('./routes/review.routes');
const uploadRoutes    = require('./routes/upload.routes');
const adminRoutes     = require('./routes/admin.routes');
const couponRoutes    = require('./routes/coupon.routes');

const app = express();

// ── Security middleware ─────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting — general API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max:      100,
  message:  { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { success: false, message: 'Too many login attempts, please try again later.' },
});

app.use('/api', limiter);
app.use('/api/auth', authLimiter);

// ── Stripe webhook needs raw body — mount BEFORE json parser ─
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// ── Body parsers ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Data sanitization ───────────────────────────────────────
app.use(mongoSanitize());   // prevent NoSQL injection
app.use(xssClean());        // prevent XSS

// ── Logging ─────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health check ────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'MHD Store API v1.0', environment: process.env.NODE_ENV });
});

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/sellers',    sellerRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/uploads',    uploadRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/coupons',    couponRoutes);

// ── Error handling ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
