import { config } from "dotenv";
import { OrderStatus, PrismaClient } from "@prisma/client";

config();

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding orders...");

  const customers = await prisma.customer.findMany({ take: 3 });
  const products = await prisma.product.findMany({ take: 4 });

  if (customers.length === 0 || products.length === 0) {
    console.error("❌ No customers or products found. Seed them first!");
    return;
  }

  const order1 = await prisma.order.create({
    data: {
      customer_id: customers[0].id,
      status: OrderStatus.DELIVERED,
      total: 729.98,
      orderItems: {
        create: [
          {
            product_id: products[0].id,
            quantity: 2,
            price: products[0].price,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customer_id: customers[1].id,
      status: OrderStatus.SHIPPED,
      total: 2499.0,
      orderItems: {
        create: [
          {
            product_id: products[1].id,
            quantity: 1,
            price: products[1].price,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customer_id: customers[2].id,
      status: OrderStatus.PENDING,
      total: 2498.99,
      orderItems: {
        create: [
          {
            product_id: products[2].id,
            quantity: 1,
            price: products[2].price,
          },
          {
            product_id: products[3].id,
            quantity: 1,
            price: products[3].price,
          },
        ],
      },
    },
  });

  console.log("✅ Orders seeded:", { order1, order2, order3 });
  console.log("🎉 Order seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Error during order seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
