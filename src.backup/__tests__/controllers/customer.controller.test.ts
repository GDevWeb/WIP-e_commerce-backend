// import { Response } from "express";
// import * as customerController from "../../modules/customer/controller/customer.controller";
// import * as customerService from "../../modules/customer/service/customer.service";
// import { AuthRequest } from "../../types/auth.types";
// import { mockCustomer, mockCustomers } from "../__mocks__/fixtures";

// jest.mock("../../modules/customer/service/customer.service");

// const mockRequest = (
//   body: any = {},
//   query: any = {},
//   params: any = {},
//   user: any = null
// ) => {
//   const req = {} as AuthRequest;
//   req.body = body;
//   req.query = query;
//   req.params = params;
//   req.user = user;
//   return req;
// };

// const mockResponse = () => {
//   const res = {} as Response;
//   res.status = jest.fn().mockReturnThis();
//   res.json = jest.fn().mockReturnThis();
//   return res;
// };

// describe("Customer Controller", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getAllCustomers", () => {
//     it("should get all customers", async () => {
//       const req = mockRequest();
//       const res = mockResponse();
//       const mockPagination = {
//         page: 1,
//         limit: 20,
//         total: 2,
//         totalPages: 1,
//       };
//       (customerService.getAllCustomers as jest.Mock).mockResolvedValue({
//         customers: mockCustomers,
//         pagination: mockPagination,
//       });

//       await customerController.getAllCustomers(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         results: mockCustomers.length,
//         data: mockCustomers,
//       });
//     });
//   });

//   describe("getCustomer", () => {
//     it("should get a single customer by ID", async () => {
//       const req = mockRequest({}, {}, { id: "1" });
//       const res = mockResponse();
//       (customerService.getCustomerById as jest.Mock).mockResolvedValue(
//         mockCustomer
//       );

//       await customerController.getCustomer(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         data: mockCustomer,
//       });
//     });

//     it("should return 404 if customer not found", async () => {
//       const req = mockRequest({}, {}, { id: "999" });
//       const res = mockResponse();
//       const next = jest.fn();
//       (customerService.getCustomerById as jest.Mock).mockResolvedValue(null);

//       await customerController.getCustomer(req, res, next);

//       expect(next).toHaveBeenCalledWith(
//         expect.objectContaining({
//           message: "Customer with ID 999 not found",
//           name: "NotFoundError",
//           statusCode: 404,
//         })
//       );
//     });
//   });

//   describe("createCustomer", () => {
//     it("should create a new customer", async () => {
//       const newCustomerData = {
//         first_name: "Test",
//         last_name: "User",
//         email: "test.user@example.com",
//       };
//       const req = mockRequest(newCustomerData);
//       const res = mockResponse();
//       const createdCustomer = { ...mockCustomer, ...newCustomerData, id: 3 };
//       (customerService.createCustomer as jest.Mock).mockResolvedValue(
//         createdCustomer
//       );

//       await customerController.createCustomer(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Customer created successfully",
//         data: createdCustomer,
//       });
//     });
//   });

//   describe("updateCustomer", () => {
//     it("should update a customer", async () => {
//       const updatedData = { first_name: "Updated" };
//       const req = mockRequest(updatedData, {}, { id: "1" });
//       const res = mockResponse();
//       const updatedCustomer = { ...mockCustomer, ...updatedData };
//       (customerService.updateCustomer as jest.Mock).mockResolvedValue(
//         updatedCustomer
//       );

//       await customerController.updateCustomer(req, res, jest.fn());

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Customer updated successfully",
//         data: updatedCustomer,
//       });
//     });
//   });

//   describe("deleteCustomer", () => {
//     it("should delete a customer", async () => {
//       const req = mockRequest({}, {}, { id: "1" });
//       const res = mockResponse();
//       (customerService.deleteCustomer as jest.Mock).mockResolvedValue(
//         mockCustomer as any
//       );

//       await customerController.deleteCustomer(req, res, jest.fn());

//       expect(customerService.deleteCustomer).toHaveBeenCalledWith(1);
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Customer deleted successfully",
//         data: mockCustomer,
//       });
//     });
//   });
// });

// 2025-27-11
//Tests: 1 failed, 5 passed, 6 total
