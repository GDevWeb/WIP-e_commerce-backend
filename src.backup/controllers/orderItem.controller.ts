import * as orderItemService from "../services/orderItem.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllOrderItems = asyncHandler(async (req, res) => {
  const orderItems = await orderItemService.getAllOrderItems();

  res.status(200).json({
    status: "success",
    results: orderItems.length,
    data: orderItems,
  });
});

export const getOrderItem = asyncHandler(async (req, res) => {
  const orderItemId = parseInt(req.params.id);
  const orderItem = await orderItemService.getOrderItemById(orderItemId);

  res.status(200).json({
    status: "success",
    data: orderItem,
  });
});

export const createOrderItem = asyncHandler(async (req, res) => {
  const newOrderItem = await orderItemService.createOrderItem(req.body);

  res.status(201).json({
    status: "success",
    message: "Order item created successfully",
    data: newOrderItem,
  });
});

export const updateOrderItem = asyncHandler(async (req, res) => {
  const orderItemId = parseInt(req.params.id);
  const updatedOrderItem = await orderItemService.updateOrderItem(
    orderItemId,
    req.body
  );

  res.status(200).json({
    status: "success",
    message: "Order item updated successfully",
    data: updatedOrderItem,
  });
});

export const deleteOrderItem = asyncHandler(async (req, res) => {
  const orderItemId = parseInt(req.params.id);
  const deletedOrderItem = await orderItemService.deleteOrderItem(orderItemId);

  res.status(200).json({
    status: "success",
    message: "Order item deleted successfully",
    data: deletedOrderItem,
  });
});
