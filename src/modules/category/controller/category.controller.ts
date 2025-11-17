import { asyncHandler } from "../../../utils/asyncHandler";
import * as categoryService from "../service/category.service";

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

export const getCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = await categoryService.getCategoryById(categoryId);

  res.status(200).json({
    status: "success",
    data: category,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const newCategory = await categoryService.createCategory(req.body);
  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: newCategory,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const updatedCategory = await categoryService.updateCategory(
    categoryId,
    req.body
  );
  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: updatedCategory,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const deletedCategory = await categoryService.deleteCategory(categoryId);
  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
    data: deletedCategory,
  });
});
