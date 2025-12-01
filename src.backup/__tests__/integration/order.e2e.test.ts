import express, { Express } from "express";
import request from "supertest";
import {
  cleanDatabase,
  getTestPrisma,
  seedTestDatabase,
  setupTestDatabase,
  teardownTestDatabase,
} from "../helpers/database.helper";
import {
  generateTestProduct,
  generateTestUser,
} from "../helpers/fixtures.helper";
import { createAuthenticatedUser } from "../helpers/http.helper";

import { errorHandler } from "../../middlewares/errorHandler";
import authRouter from "../../modules/auth/routes/auth.routes";
import orderRouter from "../../modules/order/routes/order.routes";
import productRouter from "../../modules/product/routes/product.routes";

describe("Order E2E Tests", () => {
  let app: Express;
  let user1: any;
  let user2: any;
  let product1: any;
  let product2: any;

  beforeAll(async () => {
    await setupTestDatabase();
    await seedTestDatabase();

    app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);
    app.use("/api/products", productRouter);
    app.use("/api/orders", orderRouter);
    app.use(errorHandler);
  });

  beforeEach(async () => {
    await cleanDatabase();
    await seedTestDatabase();

    // Create users
    user1 = await createAuthenticatedUser(app, generateTestUser("1"));
    user2 = await createAuthenticatedUser(app, generateTestUser("2"));

    // Create products as admin
    const prisma = getTestPrisma();
    await prisma.customer.update({
      where: { id: user1.id },
      data: { role: "ADMIN" },
    });

    // Refresh token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: user1.email,
      password: user1.password,
    });
    user1.accessToken = loginRes.body.data.accessToken;

    // Create products
    const prod1Res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${user1.accessToken}`)
      .send({ ...generateTestProduct(1), stock_quantity: 10 });
    product1 = prod1Res.body.data;

    const prod2Res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${user1.accessToken}`)
      .send({ ...generateTestProduct(2), stock_quantity: 5 });
    product2 = prod2Res.body.data;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe("POST /api/orders", () => {
    it("should create order with valid items", async () => {
      const orderData = {
        items: [
          {
            product_id: product1.id,
            quantity: 2,
          },
          {
            product_id: product2.id,
            quantity: 1,
          },
        ],
      };

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.status).toBe("PENDING");
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.total).toBeGreaterThan(0);
    });

    it("should reject order with insufficient stock", async () => {
      const orderData = {
        items: [
          {
            product_id: product2.id,
            quantity: 10, // Only 5 in stock
          },
        ],
      };

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .send(orderData)
        .expect(400);

      expect(response.body.message).toContain("stock");
    });

    it("should reject order without authentication", async () => {
      await request(app).post("/api/orders").send({ items: [] }).expect(401);
    });
  });

  describe("GET /api/orders", () => {
    it("should return own orders only", async () => {
      // User1 creates order
      await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${user1.accessToken}`)
        .send({
          items: [{ product_id: product1.id, quantity: 1 }],
        })
        .expect(201);

      // User2 creates order
      await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .send({
          items: [{ product_id: product2.id, quantity: 1 }],
        })
        .expect(201);

      // User2 should see only their order
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].customer_id).toBe(user2.id);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should get own order details", async () => {
      const createRes = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .send({
          items: [{ product_id: product1.id, quantity: 2 }],
        })
        .expect(201);

      const orderId = createRes.body.data.id;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(orderId);
      expect(response.body.data.items).toHaveLength(1);
    });

    it("should reject access to other user order", async () => {
      // User1 creates order
      const createRes = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${user1.accessToken}`)
        .send({
          items: [{ product_id: product1.id, quantity: 1 }],
        })
        .expect(201);

      const orderId = createRes.body.data.id;

      // User2 tries to access
      await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .expect(403);
    });
  });

  describe("Full Order Flow", () => {
    it("should complete: create order → view order → check stock", async () => {
      // 1. Check initial stock
      const initialProduct = await request(app)
        .get(`/api/products/${product1.id}`)
        .expect(200);

      expect(initialProduct.body.data.stock_quantity).toBe(10);

      // 2. Create order
      const orderRes = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .send({
          items: [{ product_id: product1.id, quantity: 3 }],
        })
        .expect(201);

      const orderId = orderRes.body.data.id;

      // 3. View order
      const orderDetails = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .expect(200);

      expect(orderDetails.body.data.items[0].quantity).toBe(3);

      // 4. Check updated stock
      const updatedProduct = await request(app)
        .get(`/api/products/${product1.id}`)
        .expect(200);

      expect(updatedProduct.body.data.stock_quantity).toBe(7); // 10 - 3
    });
  });
});
