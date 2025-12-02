import winston from "winston";
import "winston-daily-rotate-file";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: `logs/%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

dailyRotateFileTransport.on("error", (error: unknown) => {
  console.error("Error in daily rotate file transport", error);
});

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  defaultMeta: { service: "e-commerce-api" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    dailyRotateFileTransport,
  ],
});

export default logger;
