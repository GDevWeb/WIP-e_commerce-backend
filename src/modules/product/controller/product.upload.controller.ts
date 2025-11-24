import { Response } from "express";
import { validateUploadedFile } from "../../../configuration/multer.config";
import { NotFoundError } from "../../../errors";
import * as uploadService from "../../../services/upload.service";
import { AuthRequest } from "../../../types/auth.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import * as productService from "../service/product.service";

/**
 * Upload product image
 * POST /api/products/:id/image
 * Admin only
 */
export const uploadProductImage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const productId = parseInt(req.params.id);
    const file = req.file;

    // Validate file
    validateUploadedFile(file);

    // Ensure the product exists
    const product = await productService.getProductById(productId);
    if (!product) {
      throw new NotFoundError(`Product #${productId} not found`);
    }

    // Delete old image if it exists
    if (product.imageUrl) {
      await uploadService.deleteProductImage(product.imageUrl);
    }

    // Process and save the new image
    const images = await uploadService.processProductImage(file!, productId);

    // Update the product with the new image URL
    const updatedProduct = await productService.updateProduct(productId, {
      imageUrl: images.medium,
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      data: {
        product: updatedProduct,
        images,
      },
    });
  }
);

/**
 * Delete product image
 * DELETE /api/products/:id/image
 * Admin only
 */
export const deleteProductImageController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const productId = parseInt(req.params.id);

    // Ensure the product exists
    const product = await productService.getProductById(productId);
    if (!product) {
      throw new NotFoundError(`Product #${productId} not found`);
    }

    if (!product.imageUrl) {
      throw new NotFoundError("Product has no image");
    }

    // Delete the image
    await uploadService.deleteProductImage(product.imageUrl);

    // Update the product
    const updatedProduct = await productService.updateProduct(productId, {
      imageUrl: null,
    });

    res.status(200).json({
      message: "Image deleted successfully",
      data: updatedProduct,
    });
  }
);
