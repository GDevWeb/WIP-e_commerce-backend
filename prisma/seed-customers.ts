import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding customers...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin
  await prisma.customer.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      phone_number: "+33123456789",
      address: "123 Admin St, Paris, France",
    },
  });

  // User 1
  await prisma.customer.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      first_name: "John",
      last_name: "Doe",
      email: "user@example.com",
      password: hashedPassword,
      role: "USER",
      phone_number: "+33987654321",
      address: "456 User Ave, Lyon, France",
    },
  });

  // User 2 (nouveau)
  await prisma.customer.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@example.com",
      password: hashedPassword,
      role: "USER",
      phone_number: "+33555123456",
      address: "789 Customer Blvd, Marseille, France",
    },
  });

  console.log("✅ Customers seeded (3 users)");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
