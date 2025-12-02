import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../configuration/cloudinary.config"; // Import direct de notre config propre
import { BadRequestError } from "../errors";

/**
 * Service for handling file uploads and deletions, primarily interacting with Cloudinary.
 * This service abstracts away the details of image processing and storage.
 */

/**
 * Upload a file buffer to Cloudinary
 * Uploads a file buffer to Cloudinary.
 * This function handles the actual interaction with the Cloudinary API to upload an image.
 * It returns a Promise that resolves with the Cloudinary upload response or rejects with an error.
 *
 * @param buffer The image file as a Buffer.
 * @param folder The target folder in Cloudinary where the image will be stored.
 * @returns A Promise that resolves with the Cloudinary `UploadApiResponse`.
 */

const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed"));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Processes the uploaded file: Uploads to Cloudinary then generates URLs
 * * This function takes an uploaded file, sends it to Cloudinary, and then generates
 * various sized URLs for the image (thumbnail, medium, large, and original).
 *
 * @param file The image file object from `Express.Multer.File`.
 * @param productId An optional product ID, though not currently used for Cloudinary naming.
 * @returns A Promise that resolves with an object containing the URLs for different image sizes.
 * @throws {BadRequestError} If no file or file buffer is provided.
 * @throws {BadRequestError} If the Cloudinary upload or URL generation fails.
 */
export const processProductImage = async (
  file: Express.Multer.File,
  productId?: number // Optionnel, on ne s'en sert plus pour le nommage via Cloudinary
): Promise<{
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}> => {
  if (!file || !file.buffer) {
    throw new BadRequestError("No file uploaded");
  }

  try {
    // 1. Upload vers Cloudinary
    // Note: Cloudinary génère un public_id unique automatiquement si on ne le précise pas
    const result = await uploadToCloudinary(file.buffer, "e-commerce/products");

    const publicId = result.public_id;

    // 2. Génération des URLs transformées (synchrones)
    // Cloudinary ne recrée pas l'image, il génère juste l'URL à la volée
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
      original: result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new BadRequestError("Image upload failed");
  }
};

/**
 * Delete product images from Cloudinary
 * * Deletes an image from Cloudinary based on its URL.
 * It extracts the public ID from the image URL and then uses the Cloudinary API to destroy the image.
 *
 * @param imageUrl The full URL of the image to be deleted from Cloudinary.
 * @returns A Promise that resolves once the image is deleted (or if it didn't exist).
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    const regex = /\/v\d+\/(.+)\.[a-z]+$/;
    const match = imageUrl.match(regex);

    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};
