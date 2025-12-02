import { v2 as cloudinary } from "cloudinary";
import { BadRequestError } from "../errors";
import logger from "../utils/logger";

/**
 * Extract public_id from a Cloudinary URL
 * Example: "https://.../e-commerce/products/image.jpg" -> "e-commerce/products/image"
 */
const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const splitUrl = url.split("/");
    const filenameWithExt = splitUrl[splitUrl.length - 1];
    const folder = splitUrl[splitUrl.length - 2]; // ex: products
    const rootFolder = splitUrl[splitUrl.length - 3]; // ex: e-commerce

    // Note: Cela dépend de ta structure de dossier dans Cloudinary.
    // Une méthode plus robuste consiste souvent à stocker le public_id en base si possible.
    // Mais pour extraire depuis l'URL standard :
    const publicId = `${rootFolder}/${folder}/${filenameWithExt.split(".")[0]}`;
    return publicId;
  } catch (error) {
    return null;
  }
};

/**
 * Processes the uploaded file info from Cloudinary.
 * Since the file is already uploaded by Multer, this function simply
 * generates the URLs for different variants (thumbnail, medium, large).
 *
 * @param file - The uploaded file object from Multer (containing Cloudinary info).
 * @returns An object containing the URLs for thumbnail, medium, large, and original.
 */
export const processProductImage = async (
  file: Express.Multer.File
): Promise<{
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}> => {
  if (!file || !file.path) {
    throw new BadRequestError("No file uploaded");
  }

  // Avec multer-storage-cloudinary, file.filename EST le public_id
  const publicId = file.filename;

  // Génération des URLs dynamiques via l'SDK Cloudinary
  // On applique des transformations à la volée sans dupliquer le fichier
  return {
    thumbnail: cloudinary.url(publicId, {
      width: 150,
      height: 150,
      crop: "fill",
      format: "webp",
      quality: "auto",
    }),
    medium: cloudinary.url(publicId, {
      width: 500,
      height: 500,
      crop: "fill",
      format: "webp",
      quality: "auto",
    }),
    large: cloudinary.url(publicId, {
      width: 1200,
      height: 1200,
      crop: "limit",
      format: "webp",
      quality: "auto",
    }),
    original: file.path,
  };
};

/**
 * Delete product images from Cloudinary
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    const regex = /\/v\d+\/(.+)\.[a-z]+$/;
    const match = imageUrl.match(regex);

    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
      logger.info(`🗑️ Deleted image from Cloudinary: ${publicId}`);
    } else {
      logger.warn(`Could not extract public_id from URL: ${imageUrl}`);
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};
