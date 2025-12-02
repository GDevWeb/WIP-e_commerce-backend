import { Prisma, PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

const prisma = new PrismaClient();

const brandData: Prisma.BrandCreateInput[] = [
  { name: "Logitech" },
  { name: "Apple" },
  { name: "Dell" },
  { name: "Samsung" },
  { name: "Microsoft" },
];

const categoryData: Prisma.CategoryCreateInput[] = [{ name: "ELECTRONICS" }];

async function main() {
  console.log("Start seeding...");

  // Seed Brands
  await Promise.all(
    brandData.map(async (brand) => {
      return prisma.brand.upsert({
        where: { name: brand.name },
        update: {},
        create: brand,
      });
    })
  );
  console.log("✅ Brands seeded.");

  // Seed Categories
  await Promise.all(
    categoryData.map(async (category) => {
      return prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    })
  );
  console.log("✅ Categories seeded.");

  const logitech = await prisma.brand.findUnique({
    where: { name: "Logitech" },
  });
  const apple = await prisma.brand.findUnique({ where: { name: "Apple" } });
  const dell = await prisma.brand.findUnique({ where: { name: "Dell" } });
  const samsung = await prisma.brand.findUnique({ where: { name: "Samsung" } });

  // Récupérer les categories
  const electronics = await prisma.category.findUnique({
    where: { name: "ELECTRONICS" },
  });

  if (!logitech || !apple || !dell || !samsung || !electronics) {
    console.error("❌ Missing brands or categories. Aborting product seed.");
    return;
  }

  const productData: Prisma.ProductCreateInput[] = [
    {
      name: "Logitech G Pro Keyboard",
      sku: "LOGIGPROKEY001",
      description: "Professional mechanical gaming keyboard with RGB lighting",
      imageUrl: "https://example.com/logitech-gpro.jpg",
      weight: 0.98,
      price: 129.99,
      stock_quantity: 50,
      brand: { connect: { id: logitech.id } },
      category: { connect: { id: electronics.id } },
    },
    {
      name: "Apple MacBook Pro M3",
      sku: "APPLEMBOOKM3001",
      description: "16-inch MacBook Pro with M3 chip, 16GB RAM, 512GB SSD",
      imageUrl: "https://example.com/macbook-pro-m3.jpg",
      weight: 2.15,
      price: 2499.0,
      stock_quantity: 20,
      brand: { connect: { id: apple.id } },
      category: { connect: { id: electronics.id } },
    },
    {
      name: "Dell XPS 15",
      sku: "DELXPS15001",
      description: "Premium 15.6-inch laptop with Intel Core i7, 16GB RAM",
      imageUrl: "https://example.com/dell-xps15.jpg",
      weight: 1.86,
      price: 1899.0,
      stock_quantity: 15,
      brand: { connect: { id: dell.id } },
      category: { connect: { id: electronics.id } },
    },
    {
      name: "Samsung 4K Monitor 32 inch",
      sku: "SAM4KMON001",
      description:
        "Ultra HD 4K monitor with HDR support and 144Hz refresh rate",
      imageUrl: "https://example.com/samsung-4k.jpg",
      weight: 7.5,
      price: 599.99,
      stock_quantity: 30,
      brand: { connect: { id: samsung.id } },
      category: { connect: { id: electronics.id } },
    },
  ];

  await Promise.all(
    productData.map(async (product) => {
      return prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      });
    })
  );
  console.log("✅ Products seeded.");
  console.log("🎉 Seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
