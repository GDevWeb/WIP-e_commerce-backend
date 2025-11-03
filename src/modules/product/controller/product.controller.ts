import { asyncHandler } from "../../../utils/asyncHandler";
import { generateSKU } from "../../../utils/product.utils";
import * as productService from "../service/product.service";

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

export const getProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);

  const product = await productService.getProductById(productId);

  res.status(200).json({
    status: "success",
    data: product,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const imageUrl =
    req.file?.path?.replace(/\\/g, "/") || "https://placehold.co/300x200";

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

  const newProduct = await productService.createProduct({
    name,
    sku,
    imageUrl,
    description,
    weight: weight ? parseFloat(weight) : undefined,
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
});

export const updateProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);

  const {
    name,
    description,
    weight,
    price,
    stock_quantity,
    category_id,
    brand_id,
    imageUrl,
  } = req.body;

  const data: any = {};

  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (weight !== undefined) data.weight = parseFloat(weight);
  if (price !== undefined) data.price = parseFloat(price);
  if (stock_quantity !== undefined)
    data.stock_quantity = parseInt(stock_quantity);
  if (imageUrl !== undefined) data.imageUrl = imageUrl;

  if (category_id !== undefined) {
    data.category = { connect: { id: parseInt(category_id) } };
  }

  if (brand_id !== undefined) {
    data.brand = { connect: { id: parseInt(brand_id) } };
  }

  const updatedProduct = await productService.updateProduct(productId, data);

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res): Promise<void> => {
  const productId = parseInt(req.params.id);

  const deletedProduct = await productService.deleteProduct(productId);

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});
