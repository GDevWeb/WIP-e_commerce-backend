import express from "express";
import { validate } from "../../../middlewares/validate";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controller/category.controller";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schema/category.schema";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);

categoryRouter.get("/:id", getCategory);

categoryRouter.post("/", validate(createCategorySchema), createCategory);

categoryRouter.patch("/:id", validate(updateCategorySchema), updateCategory);

categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
