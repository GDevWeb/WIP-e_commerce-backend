import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce Backend API",
      version: "1.0.0",
      description: `
        A comprehensive RESTful API for an e-commerce platform built with Node.js, Express, TypeScript, and Prisma.
        
        ## Features
        - 🔐 JWT Authentication with refresh tokens
        - 👥 Role-Based Access Control (USER, MANAGER, ADMIN)
        - 🛍️ Complete product management
        - 📦 Order processing system
        - ⭐ Product reviews
        - 🔍 Advanced search with filters
        - 💾 Redis caching
        - 🖼️ Image upload
        - 🔒 Production-ready security
        
        ## Authentication
        Most endpoints require authentication. Use the /auth/login endpoint to get an access token, 
        then click the "Authorize" button and paste your token.
      `,
      contact: {
        name: "GDevWeb",
        email: "your.email@example.com",
        url: "https://github.com/GDevWeb/WIP-e_commerce-backend",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://your-api.com",
        description: "Production server (to be deployed)",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and profile management",
      },
      {
        name: "Products",
        description: "Product catalog management",
      },
      {
        name: "Customers",
        description: "Customer management (Admin)",
      },
      {
        name: "Orders",
        description: "Order processing",
      },
      {
        name: "Reviews",
        description: "Product reviews and ratings",
      },
      {
        name: "Cart",
        description: "Shopping cart operations",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token from /auth/login",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  message: { type: "string", example: "Unauthorized" },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: "Insufficient permissions",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  message: {
                    type: "string",
                    example: "Access denied. Required role: ADMIN",
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  message: { type: "string", example: "Resource not found" },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  message: { type: "string", example: "Validation failed" },
                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        field: { type: "string" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/modules/*/routes/*.ts", // Scan all route files
    "./src/docs/swagger.schemas.ts", // Scan schemas
  ],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Setup Swagger documentation
 */
export const setupSwagger = (app: Express) => {
  // Swagger UI options
  const swaggerUiOptions = {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "E-Commerce API Docs",
  };

  // Serve Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
  );

  // Serve OpenAPI spec as JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📚 Swagger documentation available at /api-docs");
};
