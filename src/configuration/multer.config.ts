import { Request } from "express";
import multer from "multer";
import { BadRequestError } from "../errors";

/**
 * Configuration for allowed MIME types for image uploads.
 * These are the only file types that will be accepted by the multer middleware.
 */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestError(
        `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});
