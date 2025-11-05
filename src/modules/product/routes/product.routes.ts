import express from "express";
import upload from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate";
import { getProductReviews } from "../../review/controller/review.controller";
import { GetProductReviewsSchema } from "../../review/schema/review.schema";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controller/product.controller";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);

productRouter.get("/:id", getProduct);

productRouter.post("/", upload.single("imageUrl"), createProduct);

productRouter.put("/:id", updateProduct);

productRouter.delete("/:id", deleteProduct);

productRouter.get(
  "/:productId/reviews",
  validate(GetProductReviewsSchema),
  getProductReviews
);

export default productRouter;
