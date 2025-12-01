import express, { Express } from "express";
import request from "supertest";
import {
  cleanDatabase,
  seedTestDatabase,
  setupTestDatabase,
  teardownTestDatabase,
} from "../helpers/database.helper";
import { generateTestUser } from "../helpers/fixtures.helper";
import { createAuthenticatedUser } from "../helpers/http.helper";

// Import routes
import { errorHandler } from "../../middlewares/errorHandler";
import authRouter from "../../modules/auth/routes/auth.routes";

describe("Auth E2E Tests", () => {
  let app: Express;

  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();
    await seedTestDatabase();

    // Create Express app
    app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);
    app.use(errorHandler);
  });

  beforeEach(async () => {
    // Clean database before each test
    await cleanDatabase();
    await seedTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = generateTestUser("1");

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data.user).toMatchObject({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
    });

    it("should reject duplicate email", async () => {
      const userData = generateTestUser("2");

      // First registration
      await request(app).post("/api/auth/register").send(userData).expect(201);

      // Second registration with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("already exists");
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid",
          password: "123", // Too short
        })
        .expect(400);

      expect(response.body.status).toBe("error");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const userData = generateTestUser("3");

      // Register first
      await createAuthenticatedUser(app, userData);

      // Login
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it("should reject invalid credentials", async () => {
      const userData = generateTestUser("4");

      // Register first
      await createAuthenticatedUser(app, userData);

      // Login with wrong password
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Invalid");
    });

    it("should reject non-existent user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "Password123!",
        })
        .expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should refresh access token with valid refresh token", async () => {
      const userData = generateTestUser("5");
      const user = await createAuthenticatedUser(app, userData);

      const response = await request(app)
        .post("/api/auth/refresh")
        .send({
          refreshToken: user.refreshToken,
        })
        .expect(200);

      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data.accessToken).not.toBe(user.accessToken);
    });

    it("should reject invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({
          refreshToken: "invalid.refresh.token",
        })
        .expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  describe("GET /api/auth/profile", () => {
    it("should get user profile with valid token", async () => {
      const userData = generateTestUser("6");
      const user = await createAuthenticatedUser(app, userData);

      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .expect(200);

      expect(response.body.data).toMatchObject({
        email: userData.email,
        first_name: userData.first_name,
      });
    });

    it("should reject request without token", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  describe("PATCH /api/auth/profile", () => {
    it("should update user profile", async () => {
      const userData = generateTestUser("7");
      const user = await createAuthenticatedUser(app, userData);

      const response = await request(app)
        .patch("/api/auth/profile")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({
          first_name: "Updated",
          last_name: "Name",
        })
        .expect(200);

      expect(response.body.data.first_name).toBe("Updated");
      expect(response.body.data.last_name).toBe("Name");
    });
  });

  describe("Full Auth Flow", () => {
    it("should complete register → login → get profile → update profile", async () => {
      const userData = generateTestUser("8");

      // 1. Register
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      const { accessToken } = registerRes.body.data;

      // 2. Get profile
      const profileRes = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(profileRes.body.data.email).toBe(userData.email);

      // 3. Update profile
      const updateRes = await request(app)
        .patch("/api/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ first_name: "NewName" })
        .expect(200);

      expect(updateRes.body.data.first_name).toBe("NewName");

      // 4. Login again
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(loginRes.body.data.user.first_name).toBe("NewName");
    });
  });
});
