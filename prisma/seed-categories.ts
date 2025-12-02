import { config } from "dotenv";
import { Prisma, PrismaClient } from "@prisma/client";

config();
const prisma = new PrismaClient();

const categoryData: Prisma.CategoryCreateInput[] = [
  { name: "ELECTRONICS" },
  { name: "CLOTHING" },
  { name: "BOOKS" },
  { name: "HOME_APPLIANCES" },
  { name: "SPORTS" },
  { name: "OUTDOORS" },
  { name: "TOYS" },
  { name: "GAMES" },
  { name: "FOOD" },
  { name: "DRINKS" },
  { name: "HEALTH" },
  { name: "BEAUTY" },
  { name: "AUTOMOTIVE" },
  { name: "INDUSTRIAL" },
];

async function seedCategories() {
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
}
