import { Response } from "express";

export const validateId = (id: number, res: Response, resourceName: string) => {
  if (id <= 0 || isNaN(id)) {
    res
      .status(400)
      .json({ message: `${resourceName} ID must be a positive integer` });
    return false;
  }
  return true;
};
