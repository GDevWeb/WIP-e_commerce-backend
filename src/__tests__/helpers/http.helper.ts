import { Express } from "express";
import request from "supertest";

export interface TestUser {
  id: number;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Helper to register and login a test user
 */
export const createAuthenticatedUser = async (
  app: Express,
  userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    address?: string;
  }
): Promise<TestUser> => {
  // Register
  const registerResponse = await request(app)
    .post("/api/auth/register")
    .send(userData)
    .expect(201);

  const { user, accessToken, refreshToken } = registerResponse.body.data;

  return {
    id: user.id,
    email: userData.email,
    password: userData.password,
    accessToken,
    refreshToken,
  };
};

/**
 * Helper to login existing user
 */
export const loginUser = async (
  app: Express,
  credentials: { email: string; password: string }
): Promise<TestUser> => {
  const response = await request(app)
    .post("/api/auth/login")
    .send(credentials)
    .expect(200);

  const { user, accessToken, refreshToken } = response.body.data;

  return {
    id: user.id,
    email: credentials.email,
    password: credentials.password,
    accessToken,
    refreshToken,
  };
};

/**
 * Helper to create product (requires ADMIN token)
 */
export const createTestProduct = async (
  app: Express,
  adminToken: string,
  productData: {
    name: string;
    price: number;
    stock_quantity: number;
    category_id: number;
    brand_id: number;
    description?: string;
  }
) => {
  const response = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(productData)
    .expect(201);

  return response.body.data;
};
