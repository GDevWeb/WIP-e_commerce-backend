import { NotFoundError } from "../../../errors";
import { asyncHandler } from "../../../utils/asyncHandler";
import * as customerService from "../service/customer.service";

/**
 * GET /api/customers
 */
export const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await customerService.getAllCustomers();

  res.status(200).json({
    status: "success",
    results: customers.length,
    data: customers,
  });
});

/**
 * GET /api/customers/:id
 */
export const getCustomer = asyncHandler(async (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = await customerService.getCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError(`Customer with ID ${customerId} not found`);
  }

  res.status(200).json({
    status: "success",
    data: customer,
  });
});

/**
 * POST /api/customers
 */
export const createCustomer = asyncHandler(async (req, res) => {
  const newCustomer = await customerService.createCustomer(req.body);

  res.status(201).json({
    status: "success",
    message: "Customer created successfully",
    data: newCustomer,
  });
});

/**
 * PATCH /api/customers/:id
 */
export const updateCustomer = asyncHandler(async (req, res) => {
  const customerId = parseInt(req.params.id);

  const updatedCustomer = await customerService.updateCustomer(
    customerId,
    req.body
  );

  res.status(200).json({
    status: "success",
    message: "Customer updated successfully",
    data: updatedCustomer,
  });
});

/**
 * DELETE /api/customers/:id
 */
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customerId = parseInt(req.params.id);

  const deletedCustomer = await customerService.deleteCustomer(customerId);

  res.status(200).json({
    status: "success",
    message: "Customer deleted successfully",
    data: deletedCustomer,
  });
});
