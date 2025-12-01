import dotenv from "dotenv";
import { createClient } from "redis";
import logger from "../utils/logger";

dotenv.config();

// client
export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || "0"),
});

// handle events
redisClient.on("connect", () => {
  logger.info("✅ Redis client is connected");
});

redisClient.on("error", (err) => {
  logger.error("❌ Redis client error", err);
});

redisClient.on("ready", () => {
  logger.info("✅ Redis client ready");
});

// Connection
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("✅ Redis connected successfully");
  } catch (error) {
    logger.error("❌ Redis disconnect error:", error);
    process.exit(1);
  }
};

// Disconnection
export const disconnectRedis = async () => {
  try {
    await redisClient.quit();
    logger.info("✅ Redis disconnected");
  } catch (error) {
    logger.error("❌ Redis disconnect error:", error);
  }
};
