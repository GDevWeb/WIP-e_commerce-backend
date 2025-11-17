import express from "express";
import { validate } from "../../../middlewares/validate";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
} from "../controller/customer.controller";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schema/customer.schema";

const customerRouter = express.Router();

customerRouter.get("/", getAllCustomers);

customerRouter.get("/:id", getCustomer);

customerRouter.post("/", validate(createCustomerSchema), createCustomer);

customerRouter.delete("/:id", deleteCustomer);

customerRouter.patch("/:id", validate(updateCustomerSchema), updateCustomer);

export default customerRouter;
