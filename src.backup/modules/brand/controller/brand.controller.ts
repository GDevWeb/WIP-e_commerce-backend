import { asyncHandler } from "../../../utils/asyncHandler";
import * as brandService from "../service/brand.service";

export const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await brandService.getAllBrands();

  res.status(200).json({
    status: "success",
    results: brands.length,
    data: brands,
  });
});

export const getBrand = asyncHandler(async (req, res) => {
  const brandId = parseInt(req.params.id);
  const brand = await brandService.getBrandById(brandId);

  res.status(200).json({
    status: "success",
    data: brand,
  });
});

export const createBrand = asyncHandler(async (req, res) => {
  const newBrand = await brandService.createBrand(req.body);

  res.status(201).json({
    status: "success",
    message: "Brand created successfully",
    data: newBrand,
  });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brandId = parseInt(req.params.id);
  const updatedBrand = await brandService.updateBrand(brandId, req.body);

  res.status(200).json({
    status: "success",
    message: "Brand updated successfully",
    data: updatedBrand,
  });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const brandId = parseInt(req.params.id);
  const deletedBrand = await brandService.deleteBrand(brandId);

  res.status(200).json({
    status: "success",
    message: "Brand deleted successfully",
    data: deletedBrand,
  });
});
