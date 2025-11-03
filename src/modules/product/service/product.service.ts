import { Prisma, PrismaClient, Product } from "../../../generated/prisma";
import {
  PaginatedProducts,
  ProductFilters,
} from "../../../types/product.types";

const prisma = new PrismaClient();

export const getAllProducts = async (
  filters: ProductFilters
): Promise<PaginatedProducts> => {
  const {
    name,
    category,
    brand,
    minPrice,
    maxPrice,
    page = 1,
    pageSize = 10,
  } = filters;

  const skip = (page - 1) * pageSize;
  const where: Prisma.ProductWhereInput = {};

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (brand) {
    where.brand = {
      name: {
        contains: brand,
        mode: "insensitive",
      },
    };
  }

  if (category) {
    where.category = {
      name: {
        equals: category,
        mode: "insensitive",
      },
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
      },
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  return prisma.product.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      brand: true,
    },
  });
};

export const createProduct = async (
  data: Prisma.ProductCreateInput
): Promise<Product> => {
  return prisma.product.create({
    data,
    include: {
      category: true,
      brand: true,
    },
  });
};

export const updateProduct = async (
  id: number,
  data: Prisma.ProductUpdateInput
): Promise<Product> => {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      brand: true,
    },
  });
};

export const deleteProduct = async (id: number): Promise<Product> => {
  return prisma.product.delete({
    where: { id },
  });
};
