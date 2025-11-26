import {
  Brand,
  Category,
  Customer,
  Order,
  Product,
} from "../../generated/prisma";

// Mock Brand
export const mockBrand: Brand = {
  id: 1,
  name: "Apple",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

// Mock Category
export const mockCategory: Category = {
  id: 1,
  name: "ELECTRONICS",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

// Mock Product
export const mockProduct: Product = {
  id: 1,
  name: "iPhone 15 Pro",
  sku: "IPH-ABC123", //optional may be cause an issue for test
  imageUrl: "/uploads/products/product-1.webp",
  description: "Latest iPhone model",
  weight: 0.2,
  price: 999.99,
  stock_quantity: 50,
  category_id: 1,
  brand_id: 1,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

// Mock Customer
export const mockCustomer: Customer = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  date_of_birth: new Date("1990-01-01"),
  email: "john@test.com",
  password: "$2b$10$hashedpassword", //
  phone_number: "0123456789",
  address: "123 Main St",
  role: "USER",
  is_active: true,
  last_purchase_date: null,
  total_orders: 0,
  total_spent: 0,
  customer_type: "STANDARD",
  preferred_contact_method: "EMAIL",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

// Mock Admin
export const mockAdmin: Customer = {
  ...mockCustomer,
  id: 2,
  email: "admin@test.com",
  role: "ADMIN",
};

// Mock Order
export const mockOrder: Order = {
  id: 1,
  customer_id: 1,
  order_date: new Date("2024-01-15"),
  status: "PENDING",
  total: 999.99,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
};

// Helper: Create mock product with custom data
export const createMockProduct = (
  overrides: Partial<Product> = {}
): Product => ({
  ...mockProduct,
  ...overrides,
});

// Helper: Create mock customer with custom data
export const createMockCustomer = (
  overrides: Partial<Customer> = {}
): Customer => ({
  ...mockCustomer,
  ...overrides,
});
