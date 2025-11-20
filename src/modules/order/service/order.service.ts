import { BadRequestError, NotFoundError } from "../../../errors";
import {
  Order,
  OrderItem,
  OrderStatus,
  PrismaClient,
} from "../../../generated/prisma";
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
    // Create order
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

/**
 * Retrieves a list of orders for a specific customer, with optional filtering and pagination.
 *
 * This function allows customers to view their order history. It supports filtering orders
 * by their current status and paginating the results to manage large datasets.
 *
 * @param customerId The ID of the customer whose orders are to be retrieved.
 * @param filters An object containing optional filters for the orders:
 *   - `status`: An optional `OrderStatus` to filter orders by their current status (e.g., "DELIVERED", "PENDING").
 *   - `page`: The page number for pagination (defaults to 1).
 *   - `limit`: The maximum number of orders to return per page (defaults to 10).
 * @returns A promise that resolves to an object containing the list of orders and pagination metadata.
 */

export const getOrders = async (
  customerId: number,
  filters: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }
) => {
  const { status, page = 1, limit = 10 } = filters;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Building where clause
  const where: { customer_id: number; status?: OrderStatus } = {
    customer_id: customerId,
  };

  if (status) {
    where.status = status;
  }

  //Retrieving orders with pagination
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        order_date: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  // Calculate metaData ofr pagination
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
};

/**
 * Retrieves a specific order by its ID for a given customer.
 *
 * This function fetches a single order, ensuring it belongs to the specified customer.
 * It includes detailed information about the order items and the products associated with them.
 *
 * @param customerId The ID of the customer who owns the order.
 * @param orderId The ID of the order to retrieve.
 * @returns A promise that resolves to the found order with its items and product details.
 * @throws {NotFoundError} If the order is not found or does not belong to the customer.
 */

export const getOrderById = async (customerId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customer_id: customerId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              imageUrl: true,
              price: true,
            },
          },
        },
      },
    },
  });

  //Handle the case where the order is not found or does not belong to the customer
  if (!order) {
    throw new NotFoundError(
      `Order #${orderId} not found or does not belong to you`
    );
  }

  return order;
};

/**
 * Could be restricted to ADMIN only (future)
 * Updates the status of a specific order.
 *
 * This function allows for changing the status of an order (e.g., from PENDING to PROCESSING, or SHIPPED to DELIVERED).
 * It includes validation to ensure that the status transition is valid according to predefined rules.
 *
 * @param orderId The ID of the order to update.
 * @param newStatus The new status to set for the order.
 * @returns A promise that resolves to the updated order with its items and product details.
 * @throws {NotFoundError} If the order with the given ID is not found.
 * @throws {BadRequestError} If the requested status transition is invalid.
 */

// **Status transition** :
// PENDING → PROCESSING → SHIPPED → DELIVERED
//    ↓          ↓
// CANCELLED  CANCELLED
// DELIVERED → REFUNDED (if payback)

export const updateOrderStatus = async (
  orderId: number,
  newStatus: OrderStatus
) => {
  // Checking if the command exists
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundError(`Order #${orderId} not found`);
  }

  // Checking valid transitions
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: [],
    REFUNDED: [],
  };

  const allowedStatuses = validTransitions[order.status];
  if (!allowedStatuses.includes(newStatus)) {
    throw new BadRequestError(
      `Cannot transition from ${order.status} to ${newStatus}`
    );
  }

  // Update the status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return updatedOrder;
};

/**
 * ADMIN SECTION
 *
 */

/**
 * Get all orders (ADMIN/MANAGER)
 * Not filtered by customer
 * Retrieves all orders with optional pagination and filtering by status.
 * This function is intended for administrative use to view all orders placed by customers.
 *
 * @param options An object containing pagination and filtering options:
 *   - `page`: The page number for pagination (defaults to 1).
 *   - `limit`: The maximum number of orders to return per page (defaults to 20).
 *   - `status`: An optional `OrderStatus` to filter orders by their current status.
 * @returns A promise that resolves to an object containing the list of orders, customer details, order items, and pagination metadata.
 */
export const getAllOrders = async (options: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}) => {
  const { page = 1, limit = 20, status } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        order_date: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get order statistics (ADMIN/MANAGER)
 *
 * Retrieves various statistics about orders, including total count, pending orders,
 * total revenue, and the number of orders placed today.
 * This function is intended for administrative or managerial use.
 *
 * @returns A promise that resolves to an object containing order statistics.
 */
export const getOrderStats = async () => {
  const [totalOrders, pendingOrders, totalRevenue, ordersToday] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          order_date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

  return {
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    ordersToday,
  };
};
