import { Customer, Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export const getAllCustomers = async () => {
  return prisma.customer.findMany();
};

export const getCustomerById = async (id: number): Promise<Customer | null> => {
  return prisma.customer.findUnique({
    where: { id },
  });
};

export const createCustomer = async (
  data: Prisma.CustomerCreateInput
): Promise<Customer> => {
  return prisma.customer.create({ data });
};

export const deleteCustomer = async (id: number): Promise<Customer | null> => {
  return prisma.customer.delete({ where: { id } });
};

export const updateCustomer = async (
  id: number,
  data: Prisma.CustomerUpdateInput
) => {
  return await prisma.customer.update({
    where: { id },
    data,
  });
};
