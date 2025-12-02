import { execSync } from "child_process";
import { PrismaClient } from "../../generated/prisma";

let prisma: PrismaClient;

/**
 * Initialize test database
 * Runs migrations and seeds if needed
 */
export const setupTestDatabase = async () => {
  // Set test environment
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/e_commerce_test?schema=public";

  // Run migrations
  console.log("📦 Running migrations on test database...");
  execSync("npx prisma migrate deploy", {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
    stdio: "inherit",
  });

  // Initialize Prisma Client
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  await prisma.$connect();
  console.log("✅ Test database connected");

  return prisma;
};

/**
 * Clean all tables in test database
 * Useful between tests to start fresh
 */
export const cleanDatabase = async () => {
  if (!prisma) {
    throw new Error("Database not initialized. Call setupTestDatabase first.");
  }

  const tables = [
    "RefreshToken",
    "OrderItem",
    "Order",
    "Review",
    "Product",
    "Customer",
    "Brand",
    "Category",
  ];

  console.log("🧹 Cleaning test database...");

  // Disable foreign key checks temporarily
  await prisma.$executeRawUnsafe("SET session_replication_role = 'replica';");

  // Delete all records from each table
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }

  // Re-enable foreign key checks
  await prisma.$executeRawUnsafe("SET session_replication_role = 'origin';");

  console.log("✅ Database cleaned");
};

/**
 * Seed test database with minimal data
 */
export const seedTestDatabase = async () => {
  if (!prisma) {
    throw new Error("Database not initialized");
  }

  console.log("🌱 Seeding test database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "ELECTRONICS" } }),
    prisma.category.create({ data: { name: "CLOTHING" } }),
    prisma.category.create({ data: { name: "FOOD" } }),
  ]);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: "Apple" } }),
    prisma.brand.create({ data: { name: "Samsung" } }),
    prisma.brand.create({ data: { name: "Nike" } }),
  ]);

  console.log("✅ Database seeded with categories and brands");

  return { categories, brands };
};

/**
 * Close database connection
 */
export const teardownTestDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
    console.log("✅ Test database disconnected");
  }
};

/**
 * Get Prisma client instance
 */
export const getTestPrisma = () => {
  if (!prisma) {
    throw new Error("Database not initialized. Call setupTestDatabase first.");
  }
  return prisma;
};

/**
 * Reset database to clean state
 * Useful for isolated tests
 */
export const resetDatabase = async () => {
  await cleanDatabase();
  await seedTestDatabase();
};
