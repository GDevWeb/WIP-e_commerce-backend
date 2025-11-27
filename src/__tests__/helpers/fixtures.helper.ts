/**
 * Test data generators
 */

export const generateTestUser = (suffix = "") => ({
  email: `test.user${suffix}@example.com`,
  password: "Password123!",
  first_name: "Test",
  last_name: `User${suffix}`,
  phone_number: `012345678${suffix.slice(-1) || "0"}`,
  address: `123 Test Street ${suffix}`,
});

export const generateTestAdmin = (suffix = "") => ({
  email: `admin${suffix}@example.com`,
  password: "Admin123!",
  first_name: "Admin",
  last_name: `User${suffix}`,
  phone_number: `098765432${suffix.slice(-1) || "0"}`,
  address: `456 Admin Ave ${suffix}`,
});

export const generateTestProduct = (index = 1) => ({
  name: `Test Product ${index}`,
  description: `Description for test product ${index}`,
  price: 99.99 + index,
  stock_quantity: 10 + index,
  category_id: 1,
  brand_id: 1,
});

export const generateTestOrder = (
  customerId: number,
  productIds: number[]
) => ({
  customer_id: customerId,
  items: productIds.map((id, index) => ({
    product_id: id,
    quantity: index + 1,
    unit_price: 99.99,
  })),
});
