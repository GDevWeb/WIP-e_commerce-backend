import express from "express";
import { validate } from "../../../middlewares/validate";
import {
  createOrderItem,
  deleteOrderItem,
  getAllOrderItems,
  getOrderItem,
  updateOrderItem,
} from "../controller/orderItem.controller";
import {
  createOrderItemSchema,
  updateOrderItemSchema,
} from "../schema/orderItem.schema";

const orderItemRouter = express.Router();

orderItemRouter.get("/", getAllOrderItems);

orderItemRouter.get("/:id", getOrderItem);

orderItemRouter.post("/", validate(createOrderItemSchema), createOrderItem);

orderItemRouter.patch("/:id", validate(updateOrderItemSchema), updateOrderItem);

orderItemRouter.delete("/:id", deleteOrderItem);

export default orderItemRouter;
