import express from "express";
import {
  createOrderItem,
  deleteOrderItem,
  getAllOrderItems,
  getOrderItem,
  updateOrderItem,
} from "../controllers/orderItem.controller";
import { validate } from "../middlewares/validate";
import {
  createOrderItemSchema,
  updateOrderItemSchema,
} from "../schemas/orderItem.schema";

const orderItemRouter = express.Router();

orderItemRouter.get("/", getAllOrderItems);

orderItemRouter.get("/:id", getOrderItem);

orderItemRouter.post("/", validate(createOrderItemSchema), createOrderItem);

orderItemRouter.patch("/:id", validate(updateOrderItemSchema), updateOrderItem);

orderItemRouter.delete("/:id", deleteOrderItem);

export default orderItemRouter;
