import { createClient } from "redis";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

await redisClient.connect();
console.log("✅ Redis connected");

export default redisClient;
