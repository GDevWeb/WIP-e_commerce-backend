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
  generateTestUser,
} from "../helpers/fixtures.helper";
import { createAuthenticatedUser } from "../helpers/http.helper";

import { errorHandler } from "../../middlewares/errorHandler";
import authRouter from "../../modules/auth/routes/auth.routes";
import customerRouter from "../../modules/customer/routes/customer.routes";
import productRouter from "../../modules/product/routes/product.routes";

describe("RBAC E2E Tests", () => {
  let app: Express;
  let userToken: string;
  let managerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    await seedTestDatabase();

    app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);
    app.use("/api/customers", customerRouter);
    app.use("/api/products", productRouter);
    app.use(errorHandler);
  });

  beforeEach(async () => {
    await cleanDatabase();
    await seedTestDatabase();

    const prisma = getTestPrisma();

    // Create USER
    const user = await createAuthenticatedUser(app, generateTestUser("1"));
    userToken = user.accessToken!;

    // Create MANAGER
    const manager = await createAuthenticatedUser(app, generateTestUser("2"));
    await prisma.customer.update({
      where: { id: manager.id },
      data: { role: "MANAGER" },
    });
    const managerLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: manager.email, password: manager.password });
    managerToken = managerLogin.body.data.accessToken;

    // Create ADMIN
    const admin = await createAuthenticatedUser(app, generateTestAdmin("1"));
    await prisma.customer.update({
      where: { id: admin.id },
      data: { role: "ADMIN" },
    });
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: admin.email, password: admin.password });
    adminToken = adminLogin.body.data.accessToken;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe("Product Management Permissions", () => {
    it("USER cannot create product", async () => {
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Test Product",
          price: 99.99,
          stock_quantity: 10,
          category_id: 1,
          brand_id: 1,
        })
        .expect(403);
    });

    it("MANAGER cannot create product", async () => {
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          name: "Test Product",
          price: 99.99,
          stock_quantity: 10,
          category_id: 1,
          brand_id: 1,
        })
        .expect(403);
    });

    it("ADMIN can create product", async () => {
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Product",
          price: 99.99,
          stock_quantity: 10,
          category_id: 1,
          brand_id: 1,
        })
        .expect(201);
    });
  });

  describe("Customer Management Permissions", () => {
    it("USER cannot access all customers", async () => {
      await request(app)
        .get("/api/customers/admin/all")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });

    it("MANAGER cannot access all customers", async () => {
      await request(app)
        .get("/api/customers/admin/all")
        .set("Authorization", `Bearer ${managerToken}`)
        .expect(403);
    });

    it("ADMIN can access all customers", async () => {
      await request(app)
        .get("/api/customers/admin/all")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  describe("Role Change Permissions", () => {
    it("USER cannot change roles", async () => {
      const prisma = getTestPrisma();
      const customer = await prisma.customer.findFirst({
        where: { email: generateTestUser("1").email },
      });

      await request(app)
        .patch(`/api/customers/${customer!.id}/role`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ role: "ADMIN" })
        .expect(403);
    });

    it("ADMIN can change roles", async () => {
      const prisma = getTestPrisma();
      const customer = await prisma.customer.findFirst({
        where: { email: generateTestUser("1").email },
      });

      const response = await request(app)
        .patch(`/api/customers/${customer!.id}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "MANAGER" })
        .expect(200);

      expect(response.body.data.role).toBe("MANAGER");
    });
  });
});
