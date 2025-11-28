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
    // ... existing description
    
    ## 🚀 Quick Start Guide
    
    ### 1. Test as Regular User
    \`\`\`
    1. POST /auth/register - Create a new user
    2. Copy the accessToken from response
    3. Click "Authorize" 🔓 and paste token
    4. Test: GET /auth/profile
    5. Test: POST /cart/items (add product to cart)
    6. Test: POST /orders (create an order)
    \`\`\`
    
    ### 2. Test as Admin
    \`\`\`
    1. POST /auth/login with:
       {
         "email": "admin_test@fakemail.com",
         "password": "P@ssword123."
       }
    2. Copy the accessToken
    3. Click "Authorize" 🔓 and paste token
    4. Test: POST /products (create a product)
    5. Test: GET /customers/admin/all (view all customers)
    6. Test: PATCH /orders/{id}/status (update order status)
    \`\`\`
    
    ### 3. Test Public Endpoints (No Auth)
    \`\`\`
    - GET /products (browse products)
    - GET /products/{id} (view product details)
    - GET /products/search?q=iphone (search products)
    - GET /products/{id}/reviews (see reviews)
    \`\`\`
  `,
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
        name: "Cart",
        description: "Shopping cart operations",
      },
      {
        name: "Orders",
        description: "Order processing",
      },
      {
        name: "Customers",
        description: "Customer management (Admin)",
      },
      {
        name: "Reviews",
        description: "Product reviews and ratings",
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
