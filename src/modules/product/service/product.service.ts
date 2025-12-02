import { Prisma, PrismaClient, Product } from "@prisma/client";
import { redisClient } from "../../../configuration/redis";
import {
  PaginatedProducts,
  ProductFilters,
} from "../../../types/product.types";
import {
  generateSearchCacheKey,
  getFromCache,
  setInCache,
} from "../../../utils/cacheHelper";
import logger from "../../../utils/logger";
import { SearchProductsQuery } from "../schema/product.schema";
import { SearchResult } from "../types/product.types";

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
  const product = prisma.product.create({
    data,
    include: {
      category: true,
      brand: true,
    },
  });

  await invalidateSearchCache();

  return product;
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

/**
 * Invalidates all search-related cache entries in Redis.
 * This function is typically called when product data changes (e.g., creation, update, deletion)
 * to ensure that subsequent search queries reflect the latest data.
 */
async function invalidateSearchCache() {
  try {
    const keys = await redisClient.keys("search:products:*");
    if (keys.length > 0) {
      await redisClient.del(...keys);
      console.log(`🗑️  Invalidated ${keys.length} search cache entries`);
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
}

/**
 * Searches for products based on various filters, sorting, and pagination.
 *
 * @param filters - An object containing search criteria.
 * @param filters.q - Optional. A search query string to match against product name or description.
 * @param filters.minPrice - Optional. The minimum price of the product.
 * @param filters.maxPrice - Optional. The maximum price of the product.
 * @param filters.category - Optional. The category name of the product.
 * @param filters.brand - Optional. The brand name of the product.
 * @param filters.minRating - Optional. The minimum average rating of the product.
 * @param filters.inStock - Optional. A boolean indicating whether to search for products currently in stock.
 * @param filters.sortBy - Optional. The field to sort the products by (e.g., "price", "createdAt", "name", "rating", "popularity").
 * @param filters.order - Optional. The sort order ("asc" or "desc").
 * @param filters.page - Optional. The current page number for pagination. Defaults to 1.
 * @param filters.limit - Optional. The maximum number of products per page. Defaults to 20.
 * @returns A promise that resolves to an object containing the filtered products, pagination metadata, and applied filters.
 */

export const searchProducts = async (
  filters: SearchProductsQuery
): Promise<SearchResult> => {
  const {
    q,
    minPrice,
    maxPrice,
    category,
    brand,
    minRating,
    inStock,
    sortBy,
    order,
    page = 1,
    limit = 20,
  } = filters;

  // Check if data is in cache
  // const cacheKey = generateSearchCacheKey(filters);

  // if (redisClient.status !== "ready") {
  //   logger.warn("Redis client is not ready. Skipping cache check.");
  // }

  // const cached = await getFromCache<SearchResult>(cacheKey);

  // if (cached) {
  //   logger.info("🎯Cache HIT:", cacheKey);
  //   return cached;
  // }

  // logger.info("💾 Cache MISS:", cacheKey);

  // New version with handling redis status -> Migration to ioredis
  const cacheKey = generateSearchCacheKey(filters);
  let cached: SearchResult | null = null; // On initialise la variable

  // On vérifie d'abord si on peut utiliser Redis
  if (redisClient.status === "ready") {
    cached = await getFromCache<SearchResult>(cacheKey);
  } else {
    logger.warn("Redis client is not ready. Skipping cache check.");
  }

  // Si on a trouvé en cache (et que redis était ready), on renvoie
  if (cached) {
    logger.info("🎯 Cache HIT:", cacheKey);
    return cached;
  }
  logger.info("💾 Cache MISS:", cacheKey);

  // I. Step One - Building Where clause
  const where: Prisma.ProductWhereInput = {};

  // 1.Filter by Text name or description
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  // 2.Filter by Price
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  // 3.Filter by category
  if (category) {
    where.category = {
      name: { equals: category, mode: "insensitive" },
    };
  }

  // 4.Filter by category
  if (brand) {
    where.brand = {
      name: { equals: brand, mode: "insensitive" },
    };
  }

  // Filter by stock
  if (inStock) {
    where.stock_quantity = { gt: 0 };
  }

  // II. Step 2 - Building ORDER clause
  const orderBy: Prisma.ProductOrderByWithRelationInput = {};

  switch (sortBy) {
    case "price":
      orderBy.price = order;
      break;
    case "name":
      orderBy.name = order;
      break;
    case "createdAt":
      orderBy.createdAt = order;
      break;
    case "rating":
      orderBy.createdAt = order;
      // provisory on createdAt by way updating Product Model adding a field "average_rating"
      break;
    case "popularity":
      orderBy.createdAt = order;
      // provisory on createdAt by way updating Product Model adding a field "sales_count"
      //
      break;
    default:
      orderBy.createdAt = order;
  }

  // III. Step 3 -  Calculate pagination
  const skip = (page - 1) * limit;

  // IV. Step 4 -  Execute the request
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  // V. Step 5 - Calculate average rating and filter by minRating
  const productsWithRating = products.map((product) => {
    const reviews = product.reviews;
    /* Future plan:
     May produce a performance bottleneck for a (large) realistic case.
     Consider adding an "average_rating" field to the Product model and updating it automatically (e.g., via a trigger or service after review creation/update). i See Reviews Models
     The current approach is efficient for < 1k products.
    */
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Filter by minRating if is provided
    return {
      ...product,
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length,
      reviews: undefined,
    };
  });

  // Filtrer by minRating
  let filteredProducts = productsWithRating;
  if (minRating !== undefined) {
    filteredProducts = productsWithRating.filter(
      (p) => p.averageRating >= minRating
    );
  }

  // VI. Step 6 - Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const result: SearchResult = {
    products: filteredProducts,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    filters: {
      q,
      minPrice,
      maxPrice,
      category,
      brand,
      minRating,
      inStock,
      sortBy,
      order,
    },
  };

  await setInCache(cacheKey, result, 300);

  return result;
};

/**
 * ADMIN SECTION
 *
 */

/**
 * Retrieves various statistics about products, including total count, out-of-stock items,
 * low-stock items, and the total value of all products.
 *
 * @returns A promise that resolves to an object containing product statistics.
 */
export const getProductStats = async () => {
  const [totalProducts, outOfStock, lowStock, totalValue] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({
      where: { stock_quantity: 0 },
    }),
    prisma.product.count({
      where: { stock_quantity: { lte: 10, gt: 0 } },
    }),
    prisma.product.aggregate({
      _sum: {
        price: true,
      },
    }),
  ]);

  const formattedValue = totalValue._sum.price?.toFixed(2);

  return {
    totalProducts,
    outOfStock,
    lowStock,
    totalValue: Number(formattedValue) || 0,
  };
};
