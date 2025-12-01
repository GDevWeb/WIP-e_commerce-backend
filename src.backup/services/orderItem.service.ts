import { OrderItem, Prisma, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getAllOrderItems = async () => {
  return prisma.orderItem.findMany({
    include: {
      product: true,
      order: true,
    },
  });
};

export const getOrderItemById = async (id: number): Promise<OrderItem> => {
  return prisma.orderItem.findUniqueOrThrow({
    where: { id },
    include: {
      product: true,
      order: true,
    },
  });
};

export const createOrderItem = async (
  data: Prisma.OrderItemCreateInput
): Promise<OrderItem> => {
  return prisma.orderItem.create({ data });
};

export const updateOrderItem = async (
  id: number,
  data: Prisma.OrderItemUpdateInput
): Promise<OrderItem> => {
  return prisma.orderItem.update({
    where: { id },
    data,
  });
};

export const deleteOrderItem = async (id: number): Promise<OrderItem> => {
  return prisma.orderItem.delete({ where: { id } });
};

// 🪛check old file - may be unused file an replaced by service in module folder
