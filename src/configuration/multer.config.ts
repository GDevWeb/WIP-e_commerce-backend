import { randomUUID } from "crypto";
import { Request } from "express";
import multer from "multer";
import path from "path";
import { BadRequestError } from "../errors";

// Authorized files types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Max Size: 5mb
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback) => {
    callback(null, path.join(process.cwd(), "uploads/temp"));
  },
  filename: (req: Request, file: Express.Multer.File, callback) => {
    const uniqueSuffix = randomUUID();
    const ext = path.extname(file.originalname);
    callback(null, `temp-${uniqueSuffix}${ext}`);
  },
});

// File filter (validation)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Vérifier le MIME type
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`
      )
    );
  }
};

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Helper: Validate uploaded file (now optional)
export const validateUploadedFile = (file?: Express.Multer.File) => {
  // Si pas de fichier, c'est OK (optionnel)
  if (!file) {
    return false; // Pas de fichier
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestError("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestError(
      `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  return true; // Fichier valide
};
