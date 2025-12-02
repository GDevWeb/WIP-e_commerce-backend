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
  generateTestAdmin,
  generateTestProduct,
  generateTestUser,
} from "../helpers/fixtures.helper";
import { createAuthenticatedUser } from "../helpers/http.helper";

import { errorHandler } from "../../middlewares/errorHandler";
import authRouter from "../../modules/auth/routes/auth.routes";
import customerRouter from "../../modules/customer/routes/customer.routes";
import productRouter from "../../modules/product/routes/product.routes";

describe("Product E2E Tests", () => {
  let app: Express;
  let adminUser: any;
  let regularUser: any;

  beforeAll(async () => {
    await setupTestDatabase();
    await seedTestDatabase();

    // Create Express app
    app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);
    app.use("/api/products", productRouter);
    app.use("/api/customers", customerRouter);
    app.use(errorHandler);
  });

  beforeEach(async () => {
    await cleanDatabase();
    await seedTestDatabase();

    // Create admin user
    const adminData = generateTestAdmin("1");
    adminUser = await createAuthenticatedUser(app, adminData);

    // Set admin role in database
    const prisma = getTestPrisma();
    await prisma.customer.update({
      where: { id: adminUser.id },
      data: { role: "ADMIN" },
    });

    // Create regular user
    const userData = generateTestUser("1");
    regularUser = await createAuthenticatedUser(app, userData);
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe("GET /api/products", () => {
    it("should return empty list initially", async () => {
      const response = await request(app).get("/api/products").expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it("should return products with pagination", async () => {
      // Create 5 products
      for (let i = 1; i <= 5; i++) {
        const productData = generateTestProduct(i);
        await request(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${adminUser.accessToken}`)
          .send(productData)
          .expect(201);
      }

      const response = await request(app)
        .get("/api/products")
        .query({ page: 1, pageSize: 3 })
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination.total).toBe(5);
      expect(response.body.pagination.totalPages).toBe(2);
    });

    it("should filter products by price range", async () => {
      // Create products with different prices
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send({ ...generateTestProduct(1), price: 50 })
        .expect(201);

      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send({ ...generateTestProduct(2), price: 150 })
        .expect(201);

      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send({ ...generateTestProduct(3), price: 250 })
        .expect(201);

      const response = await request(app)
        .get("/api/products")
        .query({ minPrice: 100, maxPrice: 200 })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].price).toBe(150);
    });
  });

  describe("POST /api/products", () => {
    it("should create product as ADMIN", async () => {
      const productData = generateTestProduct(1);

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.data).toMatchObject({
        name: productData.name,
        price: productData.price,
        stock_quantity: productData.stock_quantity,
      });
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("sku");
    });

    it("should reject product creation as regular USER", async () => {
      const productData = generateTestProduct(1);

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${regularUser.accessToken}`)
        .send(productData)
        .expect(403);

      expect(response.body.status).toBe("error");
    });

    it("should reject product creation without auth", async () => {
      const productData = generateTestProduct(1);

      await request(app).post("/api/products").send(productData).expect(401);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should get product by id", async () => {
      const productData = generateTestProduct(1);
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send(productData)
        .expect(201);

      const productId = createRes.body.data.id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.data.id).toBe(productId);
      expect(response.body.data.name).toBe(productData.name);
    });

    it("should return 404 for non-existent product", async () => {
      await request(app).get("/api/products/99999").expect(404);
    });
  });

  describe("PATCH /api/products/:id", () => {
    it("should update product as ADMIN", async () => {
      const productData = generateTestProduct(1);
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send(productData)
        .expect(201);

      const productId = createRes.body.data.id;

      const response = await request(app)
        .patch(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send({ price: 199.99 })
        .expect(200);

      expect(response.body.data.price).toBe(199.99);
    });

    it("should reject update as regular USER", async () => {
      const productData = generateTestProduct(1);
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send(productData)
        .expect(201);

      const productId = createRes.body.data.id;

      await request(app)
        .patch(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${regularUser.accessToken}`)
        .send({ price: 199.99 })
        .expect(403);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete product as ADMIN", async () => {
      const productData = generateTestProduct(1);
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send(productData)
        .expect(201);

      const productId = createRes.body.data.id;

      await request(app)
        .delete(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .expect(200);

      // Verify deleted
      await request(app).get(`/api/products/${productId}`).expect(404);
    });
  });

  describe("GET /api/products/admin/stats", () => {
    it("should return product statistics as ADMIN", async () => {
      // Create some products
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send({ ...generateTestProduct(1), stock_quantity: 0 })
        .expect(201);

      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .send({ ...generateTestProduct(2), stock_quantity: 5 })
        .expect(201);

      const response = await request(app)
        .get("/api/products/admin/stats")
        .set("Authorization", `Bearer ${adminUser.accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty("totalProducts");
      expect(response.body.data).toHaveProperty("outOfStock");
      expect(response.body.data).toHaveProperty("lowStock");
      expect(response.body.data.totalProducts).toBe(2);
      expect(response.body.data.outOfStock).toBe(1);
    });

    it("should reject stats request as regular USER", async () => {
      await request(app)
        .get("/api/products/admin/stats")
        .set("Authorization", `Bearer ${regularUser.accessToken}`)
        .expect(403);
    });
  });
});
