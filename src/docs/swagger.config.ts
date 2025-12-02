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
        
        ## ✨ Features
        - 🔐 JWT Authentication with refresh tokens
        - 👥 Role-Based Access Control (USER, MANAGER, ADMIN)
        - 🛍️ Complete product management
        - 📦 Order processing system
        - ⭐ Product reviews and ratings
        - 🛒 Shopping cart with Redis
        - 🔍 Advanced search with filters
        - 💾 Redis caching
        - 🖼️ Image upload support
        - 🔒 Production-ready security (Helmet, Rate Limiting, CORS)
        
        ## 🧪 Test Credentials
        
        Use these credentials to test different access levels:
        
        **ADMIN Account** (Full access to all endpoints):
        \`\`\`json
        {
          "email": "admin_test@fakemail.com",
          "password": "P@ssword123."
        }
        \`\`\`
        
        **Regular USER** (Limited access):
        - Use POST /auth/register to create your own test account
        - Or register via the interface below
        
        ## 🚀 Quick Start Guide
        
        ### 1️⃣ Test as Regular User
        \`\`\`
        1. POST /auth/register - Create a new user account
        2. Copy the accessToken from the response
        3. Click "Authorize" 🔓 button (top right)
        4. Paste your token in the dialog
        5. Click "Authorize" then "Close"
        6. Now test these endpoints:
           - GET /auth/profile (view your profile)
           - GET /products (browse products)
           - POST /cart/items (add items to cart)
           - POST /orders (create an order)
           - POST /products/{id}/reviews (leave a review)
        \`\`\`
        
        ### 2️⃣ Test as Admin
        \`\`\`
        1. POST /auth/login with the ADMIN credentials above
        2. Copy the accessToken from the response
        3. Click "Authorize" 🔓 and paste the token
        4. Click "Authorize" then "Close"
        5. Now test admin-only endpoints:
           - POST /products (create a product)
           - PATCH /products/{id} (update a product)
           - DELETE /products/{id} (delete a product)
           - GET /customers/admin/all (view all customers)
           - GET /products/admin/stats (view product statistics)
        \`\`\`
        
        ### 3️⃣ Test Public Endpoints (No Authentication Required)
        \`\`\`
        - GET /products (browse product catalog)
        - GET /products/{id} (view product details)
        - GET /products/search?name=iphone (search products)
        - GET /products/{id}/reviews (see product reviews)
        - GET /health (API health check)
        \`\`\`
        
        ## 📖 Authentication Flow
        
        1. **Register**: POST /auth/register to create an account
        2. **Login**: POST /auth/login to get tokens
        3. **Authorize**: Click the 🔓 button and paste your accessToken
        4. **Use API**: All protected endpoints now accessible
        5. **Refresh**: POST /auth/refresh when token expires
        
        ## 💡 Tips
        - Access tokens expire after 7 days
        - Use refresh token to get new access token without logging in again
        - Rate limiting: 5 login attempts per 15 minutes
        - Admin credentials are for testing only
        
        ## 🔗 Links
        - GitHub: https://github.com/GDevWeb/WIP-e_commerce-backend
        - Documentation: Full API docs available at /api-docs.json
      `,
      contact: {
        name: "GDevWeb",
        email: "gaetan.dammaretz.dev@gmail.com",
        url: "https://github.com/GDevWeb/WIP-e_commerce-backend",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API Server (Relative path)",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description:
          "👉 Start here! User authentication and profile management",
      },
      {
        name: "Products",
        description: "Product catalog management (CRUD operations)",
      },
      {
        name: "Cart",
        description: "Shopping cart operations (Redis-based)",
      },
      {
        name: "Orders",
        description: "Order processing and management",
      },
      {
        name: "Reviews",
        description: "Product reviews and ratings",
      },
      {
        name: "Customers",
        description: "Customer management (Admin only)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token from /auth/login or /auth/register",
        },
      },
      schemas: {
        // Auth Schemas
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              description: "JWT access token (expires in 7 days)",
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjMwMDAwMDAwLCJleHAiOjE2MzA2MDQ4MDB9.abc123xyz",
            },
            refreshToken: {
              type: "string",
              description: "JWT refresh token (expires in 30 days)",
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxNjMyNTkyMDAwfQ.xyz789abc",
            },
            user: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: 1,
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                first_name: {
                  type: "string",
                  example: "John",
                },
                last_name: {
                  type: "string",
                  example: "Doe",
                },
                role: {
                  type: "string",
                  enum: ["USER", "MANAGER", "ADMIN"],
                  example: "USER",
                },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            first_name: {
              type: "string",
              example: "John",
            },
            last_name: {
              type: "string",
              example: "Doe",
            },
            role: {
              type: "string",
              enum: ["USER", "MANAGER", "ADMIN"],
              example: "USER",
            },
            phone_number: {
              type: "string",
              nullable: true,
              example: "0123456789",
            },
            address: {
              type: "string",
              nullable: true,
              example: "123 Main Street, City, Country",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Product Schemas
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "iPhone 15 Pro",
            },
            sku: {
              type: "string",
              example: "IPH-15P-256-BLK",
            },
            description: {
              type: "string",
              nullable: true,
              example:
                "Latest iPhone model with A17 Pro chip, titanium design, and advanced camera system",
            },
            price: {
              type: "number",
              format: "float",
              example: 999.99,
            },
            stock_quantity: {
              type: "integer",
              example: 50,
            },
            weight: {
              type: "number",
              format: "float",
              nullable: true,
              example: 0.221,
            },
            imageUrl: {
              type: "string",
              nullable: true,
              example: "/uploads/products/product-1-thumb.webp",
            },
            category_id: {
              type: "integer",
              example: 1,
            },
            brand_id: {
              type: "integer",
              example: 1,
            },
            category: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: 1,
                },
                name: {
                  type: "string",
                  example: "ELECTRONICS",
                },
              },
            },
            brand: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: 1,
                },
                name: {
                  type: "string",
                  example: "Apple",
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Order Schemas
        OrderItem: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            product_id: {
              type: "integer",
              example: 1,
            },
            quantity: {
              type: "integer",
              example: 2,
            },
            unit_price: {
              type: "number",
              format: "float",
              example: 999.99,
            },
            product: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "iPhone 15 Pro",
                },
                sku: {
                  type: "string",
                  example: "IPH-15P-256-BLK",
                },
              },
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            customer_id: {
              type: "integer",
              example: 1,
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
              ],
              example: "PENDING",
            },
            total: {
              type: "number",
              format: "float",
              example: 1999.98,
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Review Schema
        Review: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            product_id: {
              type: "integer",
              example: 1,
            },
            customer_id: {
              type: "integer",
              example: 1,
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            comment: {
              type: "string",
              nullable: true,
              example: "Excellent product! Highly recommend.",
            },
            customer: {
              type: "object",
              properties: {
                first_name: {
                  type: "string",
                  example: "John",
                },
                last_name: {
                  type: "string",
                  example: "Doe",
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Error Schemas
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "email",
                  },
                  message: {
                    type: "string",
                    example: "Invalid email format",
                  },
                },
              },
            },
          },
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
                  message: {
                    type: "string",
                    example: "Unauthorized - Invalid or missing token",
                  },
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
                $ref: "#/components/schemas/ValidationError",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/*/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Setup Swagger documentation
 */
export const setupSwagger = (app: Express) => {
  const swaggerUiOptions = {
    explorer: true,
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js",
    ],
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: "E-Commerce API Docs",
    customfavIcon: "/favicon.ico",
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
  console.log("📄 OpenAPI spec available at /api-docs.json");
};
