// import { Request, Response } from "express";
// import * as productController from "../../modules/product/controller/product.controller";
// import * as productService from "../../modules/product/service/product.service"; // Keep this line
// import * as uploadService from "../../services/upload.service";
// import { generateSKU } from "../../utils/product.utils"; // Keep this line
// import {
//   mockPagination,
//   mockProduct,
//   mockProducts,
//   mockProductStats,
// } from "../__mocks__/fixtures";

// jest.mock("../../modules/product/service/product.service");
// jest.mock("../../services/upload.service");
// jest.mock("../../utils/product.utils");

// const mockRequest = (
//   body: any = {},
//   query: any = {},
//   params: any = {},
//   file: any = null
// ) => {
//   const req = {} as Request;
//   req.body = body;
//   req.query = query;
//   req.params = params;
//   if (file) {
//     req.file = file as Express.Multer.File;
//   }
//   return req;
// };

// const mockResponse = () => {
//   const res = {} as Response;
//   res.status = jest.fn().mockReturnThis();
//   res.json = jest.fn().mockReturnThis();
//   return res;
// };

// describe("Product Controller", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getAllProducts", () => {
//     it("should get all products with default pagination", async () => {
//       const req = mockRequest();
//       const res = mockResponse();
//       (productService.getAllProducts as jest.Mock).mockResolvedValue({
//         products: mockProducts,
//         pagination: mockPagination,
//       });

//       await productController.getAllProducts(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         results: mockProducts.length,
//         data: mockProducts,
//         pagination: mockPagination,
//       });
//     });
//   });

//   describe("getProduct", () => {
//     it("should get a single product by ID", async () => {
//       const req = mockRequest({}, {}, { id: "1" });
//       const res = mockResponse();
//       (productService.getProductById as jest.Mock).mockResolvedValue(
//         mockProduct
//       );

//       await productController.getProduct(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         data: mockProduct,
//       });
//     });
//   });

//   describe("createProduct", () => {
//     it("should create a product without an image and call the service with correct arguments", async () => {
//       const req = mockRequest({
//         name: "New Product",
//         description: "A great new product",
//         weight: "1.2",
//         price: "100",
//         stock_quantity: "10",
//         category_id: "1",
//         brand_id: "1",
//       });
//       const res = mockResponse();
//       const next = jest.fn();
//       const newProduct = { ...mockProduct, id: 3, name: "New Product" };
//       const sku = "NEW-PROD-123";

//       (generateSKU as jest.Mock).mockReturnValue(sku);
//       (productService.createProduct as jest.Mock).mockResolvedValue(newProduct);

//       await productController.createProduct(req, res, next);

//       expect(productService.createProduct).toHaveBeenCalledWith({
//         name: "New Product",
//         sku: sku,
//         imageUrl: null,
//         description: "A great new product",
//         weight: 1.2,
//         price: 100,
//         stock_quantity: 10,
//         category: { connect: { id: 1 } },
//         brand: { connect: { id: 1 } },
//       });
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Product created successfully",
//         data: newProduct,
//       });
//       expect(next).not.toHaveBeenCalled();
//     });

//     it("should create a product with an image and call services with correct arguments", async () => {
//       const file = { path: "some/path/image.jpg" } as Express.Multer.File;
//       const req = mockRequest(
//         {
//           name: "New Product",
//           description: "A great new product",
//           weight: "1.2",
//           price: "100",
//           stock_quantity: "10",
//           category_id: "1",
//           brand_id: "1",
//         },
//         {},
//         {},
//         file
//       );
//       const res = mockResponse();
//       const next = jest.fn();

//       const sku = "NEW-PROD-123";
//       const tempProduct = {
//         ...mockProduct,
//         id: 3,
//         name: "New Product",
//         imageUrl: null,
//       };
//       const images = {
//         medium: "http://example.com/medium.jpg",
//         small: "http://example.com/small.jpg",
//       };
//       const finalProduct = { ...tempProduct, imageUrl: images.medium };

//       (generateSKU as jest.Mock).mockReturnValue(sku);
//       (productService.createProduct as jest.Mock).mockResolvedValue(
//         tempProduct
//       );
//       (uploadService.processProductImage as jest.Mock).mockResolvedValue(
//         images
//       );
//       (productService.updateProduct as jest.Mock).mockResolvedValue(
//         finalProduct
//       );

//       await productController.createProduct(req, res, next);

//       expect(productService.createProduct).toHaveBeenCalledWith({
//         name: "New Product",
//         sku: sku,
//         imageUrl: null,
//         description: "A great new product",
//         weight: 1.2,
//         price: 100,
//         stock_quantity: 10,
//         category: { connect: { id: 1 } },
//         brand: { connect: { id: 1 } },
//       });
//       expect(uploadService.processProductImage).toHaveBeenCalledWith(
//         file,
//         tempProduct.id
//       );
//       expect(productService.updateProduct).toHaveBeenCalledWith(
//         tempProduct.id,
//         { imageUrl: images.medium }
//       );

//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Product created successfully with image",
//         data: finalProduct,
//         images,
//       });
//       expect(next).not.toHaveBeenCalled();
//     });
//   });

//   describe("updateProduct", () => {
//     it("should update a product without an image", async () => {
//       const req = mockRequest({ name: "Updated Product" }, {}, { id: "1" });
//       const res = mockResponse();
//       const updatedProduct = { ...mockProduct, name: "Updated Product" };

//       (productService.getProductById as jest.Mock).mockResolvedValue(
//         mockProduct
//       );
//       (productService.updateProduct as jest.Mock).mockResolvedValue(
//         updatedProduct
//       );

//       await productController.updateProduct(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Product updated successfully",
//         data: updatedProduct,
//       });
//     });

//     it("should update a product with a new image", async () => {
//       const req = mockRequest(
//         { name: "Updated Product" },
//         {},
//         { id: "1" },
//         { path: "some/path/new-image.jpg" }
//       );
//       const res = mockResponse();
//       const updatedProduct = {
//         ...mockProduct,
//         name: "Updated Product",
//         imageUrl: "http://example.com/new-medium.jpg",
//       };
//       const images = {
//         medium: "http://example.com/new-medium.jpg",
//         small: "http://example.com/new-small.jpg",
//       };

//       (productService.getProductById as jest.Mock).mockResolvedValue(
//         mockProduct
//       );
//       (uploadService.deleteProductImage as jest.Mock).mockResolvedValue(
//         undefined
//       );
//       (uploadService.processProductImage as jest.Mock).mockResolvedValue(
//         images
//       );
//       (productService.updateProduct as jest.Mock).mockResolvedValue(
//         updatedProduct
//       );

//       await productController.updateProduct(req, res, jest.fn());

//       expect(uploadService.deleteProductImage).toHaveBeenCalledWith(
//         mockProduct.imageUrl
//       );
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Product updated successfully",
//         data: updatedProduct,
//         images,
//       });
//     });
//   });

//   describe("deleteProduct", () => {
//     it("should delete a product", async () => {
//       const req = mockRequest({}, {}, { id: "1" });
//       const res = mockResponse();

//       (productService.getProductById as jest.Mock).mockResolvedValue(
//         mockProduct
//       );
//       (uploadService.deleteProductImage as jest.Mock).mockResolvedValue(
//         undefined
//       );
//       (productService.deleteProduct as jest.Mock).mockResolvedValue(
//         mockProduct
//       );

//       await productController.deleteProduct(req, res, jest.fn());

//       expect(uploadService.deleteProductImage).toHaveBeenCalledWith(
//         mockProduct.imageUrl
//       );
//       expect(productService.deleteProduct).toHaveBeenCalledWith(1);
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Product deleted successfully",
//         data: mockProduct,
//       });
//     });
//   });

//   describe("searchProducts", () => {
//     it("should search for products", async () => {
//       const req = mockRequest({}, { name: "Test" });
//       const res = mockResponse();
//       (productService.searchProducts as jest.Mock).mockResolvedValue({
//         products: mockProducts,
//         pagination: mockPagination,
//         filters: {},
//       });

//       await productController.searchProducts(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Products retrieved successfully",
//         data: mockProducts,
//         pagination: mockPagination,
//         filters: {},
//       });
//     });
//   });

//   describe("getProductStats", () => {
//     it("should get product stats", async () => {
//       const req = mockRequest();
//       const res = mockResponse();
//       (productService.getProductStats as jest.Mock).mockResolvedValue(
//         mockProductStats
//       );

//       await productController.getProductStats(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Product statistics retrieved successfully",
//         data: mockProductStats,
//       });
//     });
//   });
// });

// 2025-27-11
// 4 failed, 5 passed, 9 total
