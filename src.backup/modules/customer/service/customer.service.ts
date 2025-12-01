import { NotFoundError } from "../../../errors";
import {
  Customer,
  Prisma,
  PrismaClient,
  Role,
} from "../../../generated/prisma";

const prisma = new PrismaClient();

/**
 * Get all customers with pagination (ADMIN)
 * Retrieves all customers from the database with pagination.
 * This function is intended for administrative use to view all registered customers.
 *
 * @param options An object containing pagination options:
 *   - `page`: The page number for pagination (defaults to 1).
 *   - `limit`: The maximum number of customers to return per page (defaults to 20).
 * @returns A promise that resolves to an object containing the list of customers and pagination metadata.
 */

export const getAllCustomers = async (options: {
  page: number;
  limit: number;
}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        total_orders: true,
        total_spent: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.customer.count(),
  ]);

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update customer role (ADMIN)
 * Updates the role of a specific customer.
 * This function is intended for administrative use to manage user permissions.
 *
 * @param customerId The ID of the customer to update.
 * @param newRole The new role to assign to the customer.
 * @returns A promise that resolves to the updated customer object with selected fields.
 * @throws {NotFoundError} If the customer with the given ID is not found.
 */
export const updateCustomerRole = async (customerId: number, newRole: Role) => {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new NotFoundError(`Customer #${customerId} not found`);
  }

  const updated = await prisma.customer.update({
    where: { id: customerId },
    data: { role: newRole },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
    },
  });

  return updated;
};

/**
 * Delete customer (ADMIN)
 * Deletes a customer from the database.
 * This function is intended for administrative use to remove customer records.
 *
 * @param customerId The ID of the customer to delete.
 * @returns A promise that resolves when the customer is successfully deleted.
 * @throws {NotFoundError} If the customer with the given ID is not found.
 */

export const deleteCustomer = async (customerId: number) => {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new NotFoundError(`Customer #${customerId} not found`);
  }

  await prisma.customer.delete({
    where: { id: customerId },
  });
};

/**
 * Get customer by ID
 * Retrieves a single customer by their unique ID.
 *
 * @param id The ID of the customer to retrieve.
 * @returns A promise that resolves to the customer object if found, or null otherwise.
 */ export const getCustomerById = async (
  id: number
): Promise<Customer | null> => {
  return prisma.customer.findUnique({
    where: { id },
  });
};
/**
 * Create a new customer.
 *
 * @param data The data for the new customer.
 * @returns A promise that resolves to the newly created customer object.
 */

export const createCustomer = async (
  data: Prisma.CustomerCreateInput
): Promise<Customer> => {
  return prisma.customer.create({ data });
};

/**
 * Update an existing customer.
 *
 * @param id The ID of the customer to update.
 * @param data The data to update the customer with.
 * @returns A promise that resolves to the updated customer object.
 */
export const updateCustomer = async (
  id: number,
  data: Prisma.CustomerUpdateInput
) => {
  return await prisma.customer.update({
    where: { id },
    data,
  });
};
