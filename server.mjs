import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import { RedisStore } from "connect-redis";
import redisClient from "./config/redis.mjs";
import rateLimit from "./middleware/rateLimitMiddleware.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import logger from "./utils/logger.mjs";
import db from "./config/db.mjs";
import { errorHandler } from "./middleware/errorMiddleware.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(rateLimit);

// Session Store in Redis
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
app.use(errorHandler);

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
