// server.js (Production-Ready Entry Point)
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redisClient = require("./src/config/redis");
const rateLimit = require("./src/middleware/rateLimitMiddleware");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const logger = require("./src/utils/logger");
const db = require("./src/config/db");

dotenv.config();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(rateLimit);
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true },
  })
);

// Test DB Connection
(async () => {
  try {
    await db.query("SELECT 1");
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection failed", error);
    process.exit(1);
  }
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
