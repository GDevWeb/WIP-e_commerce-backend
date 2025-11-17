import { Brand, Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export const getAllBrands = async (): Promise<Brand[]> => {
  return prisma.brand.findMany({
    include: {
      products: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const getBrandById = async (id: number): Promise<Brand> => {
  return prisma.brand.findUniqueOrThrow({
    where: { id },
    include: {
      products: true,
    },
  });
};

export const createBrand = async (
  data: Prisma.BrandCreateInput
): Promise<Brand> => {
  return prisma.brand.create({
    data: {
      name: data.name.trim(),
    },
  });
};

export const updateBrand = async (
  id: number,
  data: Prisma.BrandUpdateInput
): Promise<Brand> => {
  if (data.name && typeof data.name === "string") {
    data.name = data.name.trim();
  }

  return prisma.brand.update({
    where: { id },
    data,
  });
};

export const deleteBrand = async (id: number): Promise<Brand> => {
  return prisma.brand.delete({
    where: { id },
  });
};
