import { Request, Response } from "express";
import { ForbiddenError } from "../../../errors";
import { AuthRequest } from "../../../types/auth.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import * as customerService from "../service/customer.service";

/**
 * Get customer by ID
 * User can only see their own data (unless ADMIN)
 */
export const getCustomer = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const customerId = parseInt(req.params.id);
    const requestingUserId = req.user?.userId;
    const requestingUserRole = req.user?.role;

    // If the user is not an ADMIN, they can only access their own data
    if (requestingUserRole !== "ADMIN" && requestingUserId !== customerId) {
      throw new ForbiddenError("You can only view your own profile");
    }

    const customer = await customerService.getCustomerById(customerId);

    res.status(200).json({
      message: "Customer retrieved successfully",
      data: customer,
    });
  }
);

/**
 * Get customers
 * Regular users see only themselves
 * Admins see all customers
 */
export const getAllCustomers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const requestingUserId = req.user?.userId;
    const requestingUserRole = req.user?.role;

    // If user is not ADMIN, they can only see their own information
    if (requestingUserRole !== "ADMIN") {
      const customer = await customerService.getCustomerById(requestingUserId!);

      res.status(200).json({
        message: "Customer retrieved successfully",
        data: [customer],
      });
      return;
    }

    // if ADMIN, retrieving all customers
    const { page, limit } = req.query as any;
    const customers = await customerService.getAllCustomers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });

    res.status(200).json({
      message: "Customers retrieved successfully",
      data: customers,
    });
  }
);
/**
 * Update customer role (ADMIN)
 * PATCH /api/customers/:id/role
 */
export const updateCustomerRole = asyncHandler(
  async (req: Request, res: Response) => {
    const customerId = parseInt(req.params.id);
    const { role } = req.body;

    const customer = await customerService.updateCustomerRole(customerId, role);

    res.status(200).json({
      message: "Customer role updated successfully",
      data: customer,
    });
  }
);

/**
 * Delete customer (ADMIN)
 * DELETE /api/customers/:id
 */
export const deleteCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const customerId = parseInt(req.params.id);

    await customerService.deleteCustomer(customerId);

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  }
);
