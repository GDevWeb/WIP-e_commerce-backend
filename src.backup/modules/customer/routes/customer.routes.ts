import express from "express";
import { Role } from "../../../generated/prisma";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { checkRole } from "../../../middlewares/checkRole.middleware";
import { validate } from "../../../middlewares/validate";
import * as adminController from "../controller/customer.admin.controller";
import * as customerController from "../controller/customer.controller";
import {
  createCustomerSchema,
  UpdateCustomerRoleSchema,
  updateCustomerSchema,
} from "../schema/customer.schema";

const customerRouter = express.Router();

/*
 * ADMIN
 **/

/**
 * GET /api/customers/admin/all
 * Get all customers - ADMIN ONLY
 */
customerRouter.get(
  "/admin/all",
  authMiddleware,
  checkRole([Role.ADMIN]),
  adminController.getAllCustomers
);

/**
 * PATCH /api/customers/:id/role
 * Update customer role - ADMIN ONLY
 */
customerRouter.patch(
  "/:id/role",
  authMiddleware,
  checkRole([Role.ADMIN]),
  validate(UpdateCustomerRoleSchema),
  adminController.updateCustomerRole
);

/**
 * Spec. routes
 *
 **/
/**
 * GET /api/customers
 * Get all customers (own data or admin)
 * Protected - requires authentication
 */
customerRouter.get("/", authMiddleware, customerController.getAllCustomers);

/**
 * GET /api/customers/:id
 * Get customer by ID
 * Protected - user can only see their own data (unless admin)
 */
customerRouter.get("/:id", authMiddleware, customerController.getCustomer);

/**
 * POST /api/customers
 * Create customer (public for registration)
 */
customerRouter.post(
  "/",
  validate(createCustomerSchema),
  customerController.createCustomer
);

/**
 * PATCH /api/customers/:id
 * Update customer
 * Protected - user can only update their own data
 */
customerRouter.patch(
  "/:id",
  authMiddleware,
  validate(updateCustomerSchema),
  customerController.updateCustomer
);

/**
 * DELETE /api/customers/:id
 * Delete customer - ADMIN ONLY
 */
customerRouter.delete(
  "/:id",
  authMiddleware,
  checkRole([Role.ADMIN]),
  adminController.deleteCustomer
);

// Swagger Zone

/**
 * @swagger
 * /api/customers:
 *   get:
 *     tags: [Customers]
 *     summary: Get customers (own data for USER, all for ADMIN)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved
 */

export default customerRouter;
