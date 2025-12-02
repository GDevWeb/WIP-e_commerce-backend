import { Category, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany({
    include: {
      products: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const getCategoryById = async (id: number): Promise<Category> => {
  return prisma.category.findUniqueOrThrow({
    where: { id },
    include: {
      products: true,
    },
  });
};

export const createCategory = async (
  data: Prisma.CategoryCreateInput
): Promise<Category> => {
  return prisma.category.create({
    data: {
      name: data.name.toUpperCase().trim(),
    },
  });
};

export const updateCategory = async (
  id: number,
  data: Prisma.CategoryUpdateInput
): Promise<Category> => {
  // Normalise le nom si fourni
  if (data.name && typeof data.name === "string") {
    data.name = data.name.toUpperCase().trim();
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: number): Promise<Category> => {
  return prisma.category.delete({
    where: { id },
  });
};
