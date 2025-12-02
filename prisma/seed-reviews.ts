import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config();

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding reviews...");

  const customers = await prisma.customer.findMany({ take: 3 });
  const products = await prisma.product.findMany({ take: 3 });

  if (customers.length === 0 || products.length === 0) {
    console.error("❌ No customers or products found. Seed them first!");
    return;
  }

  await prisma.review.createMany({
    data: [
      {
        product_id: products[0].id,
        customer_id: customers[0].id,
        rating: 5,
        comment: "Excellent keyboard! Best purchase ever.",
      },
      {
        product_id: products[1].id,
        customer_id: customers[1].id,
        rating: 4,
        comment: "Great laptop but a bit expensive.",
      },
      {
        product_id: products[2].id,
        customer_id: customers[2].id,
        rating: 5,
        comment: "Perfect for work and gaming!",
      },
    ],
  });

  console.log("✅ Reviews seeded.");
  console.log("🎉 Review seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Error during review seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
