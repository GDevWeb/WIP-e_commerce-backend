import { BadRequestError, NotFoundError } from "../../../errors";
import { Order, OrderItem, PrismaClient } from "../../../generated/prisma";
import { CreateOrderInput } from "../schema/order.schema";

const prisma = new PrismaClient();

interface CreateOrderResponse {
  order: {
    id: number;
    customer_id: number;
    order_date: Date;
    status: string;
    total: number;
  };
  items: {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

/**
 * Creates a new order for a customer.
 *
 * This function handles the entire order creation process, including:
 * - Validating product availability and stock.
 * - Calculating the total order price.
 * - Creating the order and order items in a transaction.
 * - Decrementing product stock quantities.
 * - Updating customer's order statistics.
 *
 * @param customerId The ID of the customer placing the order.
 * @param input The order creation input containing a list of items.
 * @returns A promise that resolves to an object containing the created order and its items.
 * @throws {NotFoundError} If any product in the order items is not found.
 * @throws {BadRequestError} If there is insufficient stock for any product.
 */
export const createOrder = async (
  customerId: number,
  input: CreateOrderInput
): Promise<CreateOrderResponse> => {
  // Extract product IDs from the input items
  const productIds = input.items.map((item) => item.product_id);

  // Fetch product details for all items in the order
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock_quantity: true,
    },
  });

  // Check if all requested products were found
  if (products.length !== productIds.length) {
    const foundIds = products.map((p) => p.id);
    const missingIds = productIds.filter((id) => !foundIds.includes(id));
    throw new NotFoundError(`Products not found: ${missingIds.join(", ")}`);
  }

  // Prepare order item data and perform stock checks
  const orderItemsData = input.items.map((item) => {
    const product = products.find((p) => p.id === item.product_id)!;

    // Checking available stock
    if (product.stock_quantity < item.quantity) {
      throw new BadRequestError(
        `Insufficient stock for product "${product.name}". ` +
          `Available: ${product.stock_quantity}, Requested: ${item.quantity}`
      );
    }

    return {
      product_id: item.product_id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  // Calculate the total price of the order
  const total = orderItemsData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Execute all database operations within a transaction to ensure atomicity
  const result = (await prisma.$transaction(async (tx) => {
    // 5.1 : Create order
    const order = await tx.order.create({
      data: {
        customer_id: customerId,
        status: "PENDING",
        total: total,
      },
    });

    // Create order items for the new order
    const createdItems = await Promise.all(
      orderItemsData.map((itemData) =>
        tx.orderItem.create({
          data: {
            order_id: order.id,
            product_id: itemData.product_id,
            quantity: itemData.quantity,
            price: itemData.price,
          },
        })
      )
    );

    // Decrement stock quantity for each product in the order
    await Promise.all(
      orderItemsData.map((itemData) =>
        tx.product.update({
          where: { id: itemData.product_id },
          data: {
            stock_quantity: {
              decrement: itemData.quantity,
            },
          },
        })
      )
    );

    // Update customer statistics
    await tx.customer.update({
      where: { id: customerId },
      data: {
        total_orders: { increment: 1 },
        total_spent: { increment: total },
        last_purchase_date: new Date(),
      },
    });

    return { order, items: createdItems };
  })) as { order: Order; items: OrderItem[] };

  // Format and return the created order and its items
  return {
    order: {
      id: result.order.id,
      customer_id: result.order.customer_id,
      order_date: result.order.order_date,
      status: result.order.status,
      total: result.order.total,
    },
    items: result.items.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })),
  };
};
