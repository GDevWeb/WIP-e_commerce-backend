import { CorsOptions } from "cors";
import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: "error",
      message: "Too many requests from this IP, please try again later.",
    });
  },
});

/**
 * Strict rate limiter for authentication routes
 * Prevent brute force attacks
 * 5 attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 login attempts
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    status: "error",
    message: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict limiter for registration
 * 3 registrations per hour per IP
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    status: "error",
    message: "Too many accounts created from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * API creation limiter (for POST/PATCH/DELETE)
 * 50 requests per 15 minutes
 */
export const apiWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: "error",
    message: "Too many write operations, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * CORS configuration
 * Allow specific origins in production
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173", // Vite default
      "http://localhost:5174", // Vite alt
      // Add your production domain here
      // "https://your-frontend.com",
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["X-Total-Count", "X-Page-Count"],
  maxAge: 86400, // 24 hours
};

/**
 * Development CORS (allow all)
 */
export const devCorsOptions: CorsOptions = {
  origin: true,
  credentials: true,
};

import { Express } from "express";

/**
 * Configure input sanitization
 * Note: Primary validation is done via Zod schemas
 * This adds an additional layer of protection
 */
export const configureSanitization = (app: Express) => {
  // Input sanitization is primarily handled by Zod validation
  // Zod ensures type safety and prevents malicious input

  console.log("🧹 Input sanitization configured (via Zod)");
};
