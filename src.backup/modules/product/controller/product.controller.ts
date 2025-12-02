import { Request, Response } from "express";
import * as uploadService from "../../../services/upload.service";
import { asyncHandler } from "../../../utils/asyncHandler";
import { generateSKU } from "../../../utils/product.utils";
import { SearchProductsQuery } from "../schema/product.schema";
import * as productService from "../service/product.service";

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

  // Generate SKU
  const sku = generateSKU(name);

  // Handle the image if exists
  let imageUrl: string | null = null;
  let images: any = null;

  if (req.file) {
    const tempProduct = await productService.createProduct({
      name,
      sku,
      imageUrl: null,
      description: description || null,
      weight: weight ? parseFloat(weight) : null,
      price: parseFloat(price),
      stock_quantity: parseInt(stock_quantity),
      category: { connect: { id: parseInt(category_id) } },
      brand: { connect: { id: parseInt(brand_id) } },
    });

    // Handle the image with the product's id
    images = await uploadService.processProductImage(req.file, tempProduct.id);
    imageUrl = images.medium;

    // Update the product with the image URL
    const updatedProduct = await productService.updateProduct(tempProduct.id, {
      imageUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully with image",
      data: updatedProduct,
      images,
    });
  } else {
    // Create without image
    const newProduct = await productService.createProduct({
      name,
      sku,
      imageUrl: null,
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
    });
  }
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

  // Vérifier que le produit existe
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

  // Construire l'objet de mise à jour
  const data: any = {};

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

  // Traiter la nouvelle image si présente
  let images: any = null;

  if (req.file) {
    // Supprimer l'ancienne image si elle existe
    if (existingProduct.imageUrl) {
      await uploadService.deleteProductImage(existingProduct.imageUrl);
    }

    // Traiter la nouvelle image
    images = await uploadService.processProductImage(req.file, productId);
    data.imageUrl = images.medium;
  }

  // Mettre à jour le produit
  const updatedProduct = await productService.updateProduct(productId, data);

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: updatedProduct,
    ...(images && { images }), // Inclure les URLs des images si présent
  });
});

/**
 * Deletes a product by its ID.
 * DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res): Promise<void> => {
  const productId = parseInt(req.params.id);

  // Récupérer le produit pour supprimer son image
  const product = await productService.getProductById(productId);

  // Supprimer l'image si elle existe
  if (product.imageUrl) {
    await uploadService.deleteProductImage(product.imageUrl);
  }

  // Supprimer le produit
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
