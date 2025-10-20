import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controllers/order.controller";
import { validate } from "../middlewares/validate";
import {
  createOrderSchema,
  updateOrderSchema,
} from "../modules/order/schema/order.schema";

const orderRouter = express.Router();

orderRouter.get("/", getAllOrders);

orderRouter.get("/:id", getOrder);

orderRouter.post("/", validate(createOrderSchema), createOrder);

orderRouter.patch("/:id", validate(updateOrderSchema), updateOrder);

orderRouter.delete("/:id", deleteOrder);

export default orderRouter;
