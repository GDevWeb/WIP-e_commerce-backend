/**
 * Swagger/OpenAPI Schemas
 * Reusable component schemas for API documentation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         first_name:
 *           type: string
 *           example: John
 *         last_name:
 *           type: string
 *           example: Doe
 *         role:
 *           type: string
 *           enum: [USER, MANAGER, ADMIN]
 *           example: USER
 *         phone_number:
 *           type: string
 *           nullable: true
 *           example: "0123456789"
 *         address:
 *           type: string
 *           nullable: true
 *           example: 123 Main Street
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxNjMwMDAzNjAwfQ.abc123
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxNjMwNjA0ODAwfQ.xyz789
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             email:
 *               type: string
 *               example: user@example.com
 *             first_name:
 *               type: string
 *               example: John
 *             last_name:
 *               type: string
 *               example: Doe
 *             role:
 *               type: string
 *               example: USER
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: iPhone 15 Pro
 *         sku:
 *           type: string
 *           example: IPH-15P-256-BLK
 *         description:
 *           type: string
 *           nullable: true
 *           example: Latest iPhone model with advanced features
 *         price:
 *           type: number
 *           format: float
 *           example: 999.99
 *         stock_quantity:
 *           type: integer
 *           example: 50
 *         weight:
 *           type: number
 *           format: float
 *           nullable: true
 *           example: 0.2
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           example: /uploads/products/product-1-thumb.webp
 *         category_id:
 *           type: integer
 *           example: 1
 *         brand_id:
 *           type: integer
 *           example: 1
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: ELECTRONICS
 *         brand:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: Apple
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 2
 *         unit_price:
 *           type: number
 *           format: float
 *           example: 999.99
 *         product:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: iPhone 15 Pro
 *             sku:
 *               type: string
 *               example: IPH-15P-256-BLK
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         customer_id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *           example: PENDING
 *         total:
 *           type: number
 *           format: float
 *           example: 1999.98
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         customer_id:
 *           type: integer
 *           example: 1
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           nullable: true
 *           example: Excellent product! Highly recommend.
 *         customer:
 *           type: object
 *           properties:
 *             first_name:
 *               type: string
 *               example: John
 *             last_name:
 *               type: string
 *               example: Doe
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: An error occurred
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationError:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Validation failed
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: email
 *               message:
 *                 type: string
 *                 example: Invalid email format
 */

// Export empty object to make this a valid module
export {};
