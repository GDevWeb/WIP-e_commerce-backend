import winston from "winston";
import "winston-daily-rotate-file";

/**
 * @file Logger configuration using Winston.
 *
 * This file sets up a centralized logging mechanism for the application using Winston.
 * It configures different log transports based on the environment:
 * - Console transport for all environments, with colored output for better readability.
 * - Daily rotating file transport for non-production environments, to store logs in files.
 *
 * The logger captures timestamps, error stack traces, and formats logs as JSON.
 * The log level can be controlled via the `LOG_LEVEL` environment variable.
 */

// 1. Define the log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 2. Initialize transports with Console by default (always ok)
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
];

// 3. Add file writing ONLY if not in Prod on Vercel
// This "if" block saves your deployment
if (process.env.NODE_ENV !== "production") {
  const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: `logs/%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "debug", // Log all levels to file in development
  });

  dailyRotateFileTransport.on("error", (error: unknown) => {
    console.error("Error in daily rotate file transport", error);
  });

  transports.push(dailyRotateFileTransport);
}

// 4. Create the logger with the dynamic list of transports
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: { service: "e-commerce-api" },
  transports: transports,
});

export default logger;
