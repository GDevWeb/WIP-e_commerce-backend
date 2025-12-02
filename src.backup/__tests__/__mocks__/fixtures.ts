
export const mockProduct = {
  id: 1,
  name: 'Test Product',
  sku: 'TEST-PROD-123',
  description: 'This is a test product.',
  weight: 1.5,
  price: 99.99,
  stock_quantity: 100,
  imageUrl: 'http://example.com/image.jpg',
  category_id: 1,
  brand_id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProducts = [
  mockProduct,
  {
    id: 2,
    name: 'Another Product',
    sku: 'ANOTHER-PROD-456',
    description: 'This is another test product.',
    weight: 2.0,
    price: 149.99,
    stock_quantity: 50,
    imageUrl: 'http://example.com/another-image.jpg',
    category_id: 2,
    brand_id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockProductStats = {
  totalProducts: 100,
  outOfStock: 10,
  mostSold: mockProduct,
};

export const mockPagination = {
  total: 2,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

export const mockCustomer = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  role: 'USER' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockAdmin = {
    id: 2,
    first_name: 'Jane',
    last_name: 'Admin',
    email: 'jane.admin@example.com',
    role: 'ADMIN' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockCustomers = [
    mockCustomer,
    mockAdmin,
];