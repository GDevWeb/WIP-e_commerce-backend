import express from "express";
import upload from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate";
import { getProductReviews } from "../../review/controller/review.controller";
import { GetProductReviewsSchema } from "../../review/schema/review.schema";
import * as productController from "../controller/product.controller";
import { SearchProductsSchema } from "../schema/product.schema";

const productRouter = express.Router();

productRouter.get(
  "/search",
  validate(SearchProductsSchema),
  productController.searchProducts
);

productRouter.get("/", productController.getAllProducts);

productRouter.get("/:id", productController.getProduct);

productRouter.post(
  "/",
  upload.single("imageUrl"),
  productController.createProduct
);

productRouter.put("/:id", productController.updateProduct);

productRouter.delete("/:id", productController.deleteProduct);

productRouter.get(
  "/:productId/reviews",
  validate(GetProductReviewsSchema),
  getProductReviews
);

export default productRouter;
