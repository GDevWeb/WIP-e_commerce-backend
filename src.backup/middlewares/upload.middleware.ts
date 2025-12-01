import fs from "fs";
import multer from "multer";
import path from "path";

// ❌ To delete - replaced by multer.config with sharp
/**
 * @file Middleware for handling file uploads.
 * @description Configures multer for image uploads, including storage, file size limits, and file type validation.
 */

// Define the directory for uploads, using an environment variable or defaulting to 'uploads'
const uploadDirectory = path.join(
  process.cwd(),
  process.env.UPLOAD_DIR || "uploads"
);

/**
 * Ensures the upload directory exists. If not, it creates the directory.
 */
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

/**
 * Configures storage for uploaded files using multer.
 * Files are stored on disk in the `uploadDirectory`.
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

/**
 * Initializes multer with the configured storage, file size limits, and file type validation.
 * @param {object} options - Configuration options for multer.
 * @param {multer.StorageEngine} options.storage - The storage engine to use for uploaded files.
 * @param {object} options.limits - Limits for the uploaded data.
 * @param {number} options.limits.fileSize - Maximum file size in bytes (5MB in this case).
 * @param {multer.FileFilterCallback} options.fileFilter - Function to control which files are accepted.
 */
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Invalid file type. Only JPEG, JPG, PNG, GIF and WEBP are allowed."
        )
      );
    }
  },
});

export default upload;
