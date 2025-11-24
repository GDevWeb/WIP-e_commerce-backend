import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { BadRequestError } from "../errors";
import logger from "../utils/logger";

// Configuration
const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
const PRODUCTS_DIR = path.join(UPLOADS_ROOT, "products");
const TEMP_DIR = path.join(UPLOADS_ROOT, "temp");

// Dimensions for product images
const IMAGE_CONFIG = {
  thumbnail: { width: 150, height: 150 },
  medium: { width: 500, height: 500 },
  large: { width: 1200, height: 1200 },
};

/**
 * Processes an uploaded product image, resizing it into multiple dimensions
 * (thumbnail, medium, large) and optimizing the original, then saves them
 * to the products directory. Converts all images to WebP format.
 *
 * @param file - The uploaded file object from Multer.
 * @param productId - The ID of the product to associate the images with.
 * @returns An object containing the paths to the generated thumbnail, medium, large, and original images.
 * @throws {BadRequestError} If the image processing fails.
 */
export const processProductImage = async (
  file: Express.Multer.File,
  productId: number
): Promise<{
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}> => {
  try {
    // // Ensure the products directory exists
    // await fs.mkdir(PRODUCTS_DIR, { recursive: true });
    // // Ensure the temporary directory exists
    // await fs.mkdir(TEMP_DIR, { recursive: true });
    // Generate file names
    const timestamp = Date.now();
    const baseName = `product-${productId}-${timestamp}`;
    const ext = ".webp";

    const filenames = {
      thumbnail: `${baseName}-thumb${ext}`,
      medium: `${baseName}-medium${ext}`,
      large: `${baseName}-large${ext}`,
      original: `${baseName}${ext}`,
    };

    // Full paths
    const paths = {
      thumbnail: path.join(PRODUCTS_DIR, filenames.thumbnail),
      medium: path.join(PRODUCTS_DIR, filenames.medium),
      large: path.join(PRODUCTS_DIR, filenames.large),
      original: path.join(PRODUCTS_DIR, filenames.original),
    };

    // Read the temporary file
    const imageBuffer = await fs.readFile(file.path);

    // Create different sizes with Sharp
    await Promise.all([
      // Thumbnail (150x150)
      sharp(imageBuffer)
        .resize(IMAGE_CONFIG.thumbnail.width, IMAGE_CONFIG.thumbnail.height, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 80 })
        .toFile(paths.thumbnail),

      // Medium (500x500)
      sharp(imageBuffer)
        .resize(IMAGE_CONFIG.medium.width, IMAGE_CONFIG.medium.height, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 85 })
        .toFile(paths.medium),

      // Large (1200x1200)
      sharp(imageBuffer)
        .resize(IMAGE_CONFIG.large.width, IMAGE_CONFIG.large.height, {
          fit: "inside",
        })
        .webp({ quality: 90 })
        .toFile(paths.large),

      // Original
      sharp(imageBuffer).webp({ quality: 90 }).toFile(paths.original),
    ]);

    // Delete the temporary file
    await fs.unlink(file.path);

    // Return URLs
    return {
      thumbnail: `/uploads/products/${filenames.thumbnail}`,
      medium: `/uploads/products/${filenames.medium}`,
      large: `/uploads/products/${filenames.large}`,
      original: `/uploads/products/${filenames.original}`,
    };
  } catch (error) {
    // Cleanup if error
    try {
      await fs.unlink(file.path);
    } catch {}

    throw new BadRequestError(
      `Failed to process image: ${(error as Error).message}`
    );
  }
};

/**
 * Delete product images
 * Removes all sizes (thumbnail, medium, large, original)
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the originalName from file
    const filename = path.basename(imageUrl);
    const baseName = filename
      .replace(/-thumb|-medium|-large/, "")
      .replace(/\.[^.]+$/, "");

    // Building file name
    const ext = ".webp";
    const filesToDelete = [
      `${baseName}-thumb${ext}`,
      `${baseName}-medium${ext}`,
      `${baseName}-large${ext}`,
      `${baseName}${ext}`,
    ];

    // Delete all files
    await Promise.all(
      filesToDelete.map(async (file) => {
        const filePath = path.join(PRODUCTS_DIR, file);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.warn(`File not found: ${filePath}`);
        }
      })
    );
  } catch (error) {
    console.error("Error deleting images:", error);
  }
};

/**
 * Check if uploads directory exists, create if not
 */
export const ensureUploadDirs = async (): Promise<void> => {
  try {
    await fs.mkdir(PRODUCTS_DIR, { recursive: true });
    await fs.mkdir(TEMP_DIR, { recursive: true });
    logger.info("✅ Upload directories ready");
    logger.info(` Products: ${PRODUCTS_DIR}`);
    logger.info(` Temp: ${TEMP_DIR}`);
  } catch (error) {
    console.error("Failed to create upload directories:", error);
    throw error;
  }
};
