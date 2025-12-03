import { Response } from "express";

/**
 * Validates if an ID is a positive integer.
 *
 * @param id - The ID to validate.
 * @param res - The Express response object.
 * @param resourceName - The name of the resource (e.g., "Product", "Customer") for error messages.
 * @returns `true` if the ID is valid, `false` otherwise.
 */
export const validateId = (id: number, res: Response, resourceName: string) => {
  if (id <= 0 || isNaN(id)) {
    res
      .status(400)
      .json({ message: `${resourceName} ID must be a positive integer` });
    return false;
  }
  return true;
};
