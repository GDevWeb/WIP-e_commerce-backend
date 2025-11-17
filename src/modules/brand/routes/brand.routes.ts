import express from "express";
import { validate } from "../../../middlewares/validate";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from "../controller/brand.controller";
import { createBrandSchema, updateBrandSchema } from "../schema/brand.schema";

const brandRouter = express.Router();

brandRouter.get("/", getAllBrands);

brandRouter.get("/:id", getBrand);

brandRouter.post("/", validate(createBrandSchema), createBrand);

brandRouter.delete("/:id", deleteBrand);

brandRouter.patch("/:id", validate(updateBrandSchema), updateBrand);

export default brandRouter;
