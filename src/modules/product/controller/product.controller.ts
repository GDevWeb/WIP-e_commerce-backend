import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import * as uploadService from "../../../services/upload.service";
import { asyncHandler } from "../../../utils/asyncHandler";
import { generateSKU } from "../../../utils/product.utils";
import { SearchProductsQuery } from "../schema/product.schema";
import * as productService from "../service/product.service";

interface IImagesVariations {
  medium: string;
  large?: string;
  small?: string;
}

/**
 * Retrieves all products with optional filtering and pagination.
 * GET /api/products
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const filters = {
    name: req.query.name as string,
    category: req.query.category as string,
    brand: req.query.brand as string,
    minPrice: req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined,
    maxPrice: req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
  };

  const result = await productService.getAllProducts(filters);

  res.status(200).json({
    status: "success",
    results: result.products.length,
    data: result.products,
    pagination: result.pagination,
  });
});

/**
 * Retrieves a single product by its ID.
 * GET /api/products/:id
 */
export const getProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);

  const product = await productService.getProductById(productId);

  res.status(200).json({
    status: "success",
    data: product,
  });
});

/**
 * Creates a new product with optional image upload.
 * POST /api/products
 * Content-Type: multipart/form-data
 *
 * Fields:
 * - name (required)
 * - description (optional)
 * - weight (optional)
 * - price (required)
 * - stock_quantity (required)
 * - category_id (required)
 * - brand_id (required)
 * - image (optional file)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    weight,
    price,
    stock_quantity,
    category_id,
    brand_id,
  } = req.body;

  const sku = generateSKU(name);

  // 1. Prepare the image URL
  let imageUrl: string | null = null;
  let imagesVariations: IImagesVariations | null = null;

  if (req.file) {
    imagesVariations = await uploadService.processProductImage(req.file);

    imageUrl = imagesVariations.medium;
  }

  // 2. Create the product IN A SINGLE OPERATION
  const newProduct = await productService.createProduct({
    name,
    sku,
    imageUrl: imageUrl,
    description: description || null,
    weight: weight ? parseFloat(weight) : null,
    price: parseFloat(price),
    stock_quantity: parseInt(stock_quantity),
    category: { connect: { id: parseInt(category_id) } },
    brand: { connect: { id: parseInt(brand_id) } },
  });

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: newProduct,
    images: imagesVariations,
  });
});

/**
 * Updates an existing product with optional image upload.
 * PATCH /api/products/:id
 * Content-Type: multipart/form-data
 *
 * All fields are optional.
 * If image is provided, replaces the existing image.
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);

  // Verify that the product exists
  const existingProduct = await productService.getProductById(productId);

  const {
    name,
    description,
    weight,
    price,
    stock_quantity,
    category_id,
    brand_id,
  } = req.body;

  // Build the update object
  const data: Prisma.ProductUpdateInput = {};

  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (weight !== undefined) data.weight = parseFloat(weight);
  if (price !== undefined) data.price = parseFloat(price);
  if (stock_quantity !== undefined)
    data.stock_quantity = parseInt(stock_quantity);

  if (category_id !== undefined) {
    data.category = { connect: { id: parseInt(category_id) } };
  }

  if (brand_id !== undefined) {
    data.brand = { connect: { id: parseInt(brand_id) } };
  }

  // Process the new image if present
  let imagesVariations: IImagesVariations | null = null;

  if (req.file) {
    // Delete existing image if any
    if (existingProduct.imageUrl) {
      await uploadService.deleteProductImage(existingProduct.imageUrl);
    }

    // Process the new image
    imagesVariations = await uploadService.processProductImage(req.file);
    data.imageUrl = imagesVariations.medium;
  }

  // Update the product
  const updatedProduct = await productService.updateProduct(productId, data);

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: updatedProduct,
    ...(imagesVariations && { images: imagesVariations }),
  });
});

/**
 * Deletes a product by its ID.
 * DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res): Promise<void> => {
  const productId = parseInt(req.params.id);

  // Retrieve the product to delete its image
  const product = await productService.getProductById(productId);

  // Delete the image if it exists
  if (product.imageUrl) {
    await uploadService.deleteProductImage(product.imageUrl);
  }

  // Delete the product
  const deletedProduct = await productService.deleteProduct(productId);

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});

/**
 * Searches for products based on various criteria.
 * GET /api/products/search
 */
export const searchProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = req.query as unknown as SearchProductsQuery;

    if (filters.minPrice) filters.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) filters.maxPrice = Number(filters.maxPrice);
    if (filters.minRating) filters.minRating = Number(filters.minRating);
    if (filters.page) filters.page = Number(filters.page);
    if (filters.limit) filters.limit = Number(filters.limit);

    const result = await productService.searchProducts(filters);

    res.status(200).json({
      message: "Products retrieved successfully",
      data: result.products,
      pagination: result.pagination,
      filters: result.filters,
    });
  }
);

/**
 * ADMIN SECTION
 */

/**
 * Retrieves product statistics.
 * GET /api/products/admin/stats
 */
export const getProductStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await productService.getProductStats();

    res.status(200).json({
      message: "Product statistics retrieved successfully",
      data: stats,
    });
  }
);
