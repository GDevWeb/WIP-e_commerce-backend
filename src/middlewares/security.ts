import { Express } from "express";
import helmet from "helmet";

/**
 * Configures security-related middlewares for the Express application using Helmet.
 *
 * @param app - The Express application instance.
 */
export const configureSecurityMiddlewares = (app: Express) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // swagger
          scriptSrc: ["'self'", "'unsafe-inline'"], // swagger
          imgSrc: ["'self'", "data:", "https:"],
        },
      },

      // Cross-Origin policies
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "same-origin" },

      // Another protections
      dnsPrefetchControl: { allow: false },
      frameguard: { action: "deny" }, //clickjacking
      hidePoweredBy: true, // Hide the X-Powered-By header
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true, // Prevent MIME sniffing
      referrerPolicy: { policy: "no-referrer" },
      xssFilter: true,
    })
  );
};
