# 🎯 E-commerce Backend API: Roadmap

**Total estimated duration: 10-12 weeks (4h/day, Mon-Fri)**

---

## ✅ Phase 1: Foundations (Weeks 1-2) - **COMPLETED**

### ✅ Session 1: Initial Setup (4h)

- ✅ Git, npm, TypeScript, Express, Prisma
- ✅ MVC folder structure
- ✅ Configuration `.env`, `tsconfig.json`
- ✅ First working `server.ts`

### ✅ Session 2: Database & Schemas (4h)

- ✅ Complete Prisma schema (Brands, Categories, Products, Customers, Orders, Reviews)
- ✅ Initial migrations
- ✅ Test data seeds

### ✅ Session 3: Base Modules (8h - 2 sessions)

- ✅ Brand module (CRUD)
- ✅ Category module (CRUD)
- ✅ Product module (CRUD + basic filters)

### ✅ Session 4: Customers Module (4h)

- ✅ Customer CRUD
- ✅ Validation with middleware

---

## 🔄 Phase 2: Business Logic (Weeks 3-5) - **IN PROGRESS**

### 📍 Session 5: Advanced Validation ⭐ **PRIORITY**

**Goal: Replace manual validations with Zod**

- [x] Install Zod: `npm install zod`
- [x] Create `src/schemas/customer.schema.ts`
  - [x] Refactoring `src/schemas/customer.service.ts`
  - [x] Refactoring `src/schemas/customer.controller.ts`
  - [x] Refactoring `src/schemas/customer.routes.ts`
  - [x] Refactoring `src/schemas/customer.test.ts`
  - [x] Refactoring `src/schemas/brand.service.ts`
  - [x] Refactoring `src/schemas/brand.controller.ts`
  - [x] Refactoring `src/schemas/brand.routes.ts`
  - [x] Refactoring `src/schemas/brand.test.ts`
  - [x] Refactoring `src/schemas/category.service.ts`
  - [x] Refactoring `src/schemas/category.controller.ts`
  - [x] Refactoring `src/schemas/category.routes.ts`
  - [x] Refactoring `src/schemas/category.test.ts`
  - [x] Refactoring `src/schemas/category.test.ts`
- [x] Create centralized validation middleware
- [x] Create `src/schemas/product.schema.ts`
- [x] Refactor 2 controllers to use Zod
- [x] **Deliverable**: Type-safe validations + less boilerplate code

**Estimated time: 4h**

---

### Session 6: Centralized Error Handling

**Goal: Professional error management**

- [x] Create custom error classes (`src/errors/`)
  - `ValidationError`, `NotFoundError`, `UnauthorizedError`, etc.
- [x] Create global error middleware (`src/middleware/errorHandler.ts`)
- [x] Handle Prisma errors (P2002, P2025, etc.)
- [x] Implement Winston Logger
- [x] **Deliverable**: Structured errors + professional logs

**Estimated time: 4h**

---

### Session 7: JWT Authentication (Part 1)

**Goal: Register + Login**

- [x] Install: `npm install jsonwebtoken bcrypt` + types
- [x] Create `AuthService` (register, login)
- [x] Hash passwords with bcrypt
- [x] Generate JWT tokens
- [x] Routes: `POST /api/auth/register`, `POST /api/auth/login`
- [x] **Deliverable**: Users can register and login
- [ ] **Test**: Jest test for register and login

**Estimated time: 4h**

---

### Session 8: JWT Authentication (Part 2)

**Goal: Protected Routes + Refresh Tokens**

- [x] Create `authMiddleware` (verify JWT)
- [ ] Protect sensitive routes (Orders, Profile)
  - [x] Profile
  - [x] Orders
- [x] Implement refresh tokens (optional but recommended)
- [x] **Deliverable**: JWT-secured routes

**Estimated time: 4h**

---

### Session 9: Orders Module (Part 1)

**Goal: Create orders**

- [x] `OrderService.createOrder()`
- [x] Validate available stock
- [x] Prisma transaction (Order + OrderItems + Update stock)
- [x] Route: `POST /api/orders`
- [x] **Deliverable**: Functional order system

**Estimated time: 4h**

---

### Session 10: Orders Module (Part 2)

**Goal: Order management**

- [x] Routes: `GET /api/orders`, `GET /api/orders/:id`
- [x] Filter by status, date, customer
- [x] Update order status (PENDING → SHIPPED → DELIVERED)
- [x] **Deliverable**: Complete order CRUD

**Estimated time: 4h**

---

## 🚀 Phase 3: Advanced Features (Weeks 6-8)

### Session 11: Reviews Module

**Goal: Customer reviews**

- [ ] `ReviewService` + `ReviewController`
- [ ] Verify customer purchased the product
- [ ] 1 review per customer/product
- [ ] Rating 1-5 with validation
- [ ] Routes: POST, GET, DELETE reviews
- [ ] **Deliverable**: Functional review system

**Estimated time: 4h**

---

### Session 12: Cart System (with Redis)

**Goal: User cart**

- [ ] Install Redis: `npm install redis`
- [ ] `CartService` with Redis cache
- [ ] Add/Remove/Update items
- [ ] Handle anonymous sessions + logged users
- [ ] Routes: `POST /api/cart/items`, `GET /api/cart`, etc.
- [ ] **Deliverable**: Persistent cart

**Estimated time: 4h**

---

### Session 13: Advanced Search & Filters

**Goal: Performant product search**

- [ ] Full-text search on name/description
- [ ] Multiple filters (price, category, brand, rating)
- [ ] Sorting (price, popularity, date)
- [ ] Optimized pagination
- [ ] **Bonus**: Cache with Redis
- [ ] **Deliverable**: Modern e-commerce search

**Estimated time: 4h**

---

### Session 14: Role-Based Access Control (RBAC)

**Goal: Role management**

- [ ] Add `Role` enum to schema (USER, ADMIN, MANAGER)
- [ ] Create `checkRole(['ADMIN'])` middleware
- [ ] Protect admin routes (manage products, orders)
- [ ] Routes: `PATCH /api/orders/:id/status` (ADMIN only)
- [ ] **Deliverable**: Permission system

**Estimated time: 4h**

---

### Session 15: File Upload (Images)

**Goal: Product image upload**

- [ ] Install: `npm install multer sharp`
- [ ] Configure Multer (limits, types)
- [ ] Process images with Sharp (resize, optimize)
- [ ] **Option A**: Local storage + serve static
- [ ] **Option B**: Upload to S3/Cloudinary
- [ ] Route: `POST /api/products/:id/image`
- [ ] **Deliverable**: Functional product images

**Estimated time: 4h**

---

## ✅ Phase 4: Testing & Quality (Weeks 9-10)

### Session 16: Unit Tests (Part 1)

**Goal: Test services**

- [ ] Configure Jest: `npm install jest ts-jest @types/jest --save-dev`
- [ ] Mock Prisma with `jest-mock-extended`
- [ ] Tests: `AuthService`, `ProductService`
- [ ] Coverage > 70% on services
- [ ] **Deliverable**: Service test suite

**Estimated time: 4h**

---

### Session 17: Unit Tests (Part 2)

**Goal: Test controllers**

- [ ] Install: `npm install supertest @types/supertest --save-dev`
- [ ] Test controllers with supertest
- [ ] Mock auth middlewares
- [ ] **Deliverable**: Controller tests

**Estimated time: 4h**

---

### Session 18: Integration Tests

**Goal: End-to-end tests**

- [ ] Setup test DB (Docker PostgreSQL)
- [ ] Tests: Register → Login → Create Order → Review
- [ ] Tests: Product search with filters
- [ ] Basic CI/CD with GitHub Actions
- [ ] **Deliverable**: Functional E2E tests

**Estimated time: 4h**

---

### Session 19: Security Hardening

**Goal: Secure the API**

- [ ] Install: `npm install helmet express-rate-limit cors`
- [ ] Configure Helmet (XSS, CSRF protection)
- [ ] Rate limiting per endpoint
- [ ] Input sanitization (against NoSQL injection)
- [ ] HTTPS only in production
- [ ] **Deliverable**: Secured API

**Estimated time: 4h**

---

### Session 20: API Documentation

**Goal: Swagger/OpenAPI**

- [ ] Install: `npm install swagger-ui-express swagger-jsdoc`
- [ ] Document all routes
- [ ] Request/response examples
- [ ] Publish on `/api-docs`
- [ ] **Deliverable**: Interactive documentation

**Estimated time: 4h**

---

## 🎁 Phase 5: Bonus Features (Weeks 11-12)

### Session 21: Email Notifications

- [ ] Email service with templates
- [ ] Order confirmation
- [ ] Password reset
- [ ] Newsletter (optional)

---

### Session 22: Payment Integration (Stripe)

- [ ] Stripe PaymentIntent
- [ ] Stripe webhooks
- [ ] Payment management

---

### Session 23: Background Jobs (Bull)

- [ ] Redis queue with Bull
- [ ] Async jobs (emails, reports)
- [ ] Worker processes

---

### Session 24: Docker & Deployment

- [ ] Dockerfile
- [ ] Docker Compose (API + PostgreSQL + Redis)
- [ ] Deploy to Railway/Render/Heroku
- [ ] Production environment variables

---

## 📊 Summary by Phase

| Phase      | Sessions | Weeks  | Hours   | Goal                                   |
| ---------- | -------- | ------ | ------- | -------------------------------------- |
| ✅ Phase 1 | 1-4      | 2      | 16h     | Foundations + Basic CRUD               |
| 🔄 Phase 2 | 5-10     | 3      | 24h     | Business logic + Auth + Orders         |
| 🚀 Phase 3 | 11-15    | 2.5    | 20h     | Advanced features (Cart, RBAC, Upload) |
| ✅ Phase 4 | 16-20    | 2.5    | 20h     | Tests + Security + Documentation       |
| 🎁 Phase 5 | 21-24    | 2      | 16h     | Bonus (Emails, Payments, Deploy)       |
| **TOTAL**  | **24**   | **12** | **96h** | **Production-Ready API**               |

---

## 🎯 Recommended Next Session

**👉 Session 5: Validation with Zod (4h)**

This is the best time to improve your existing code before adding more features!

---

## TODO

1. upload-file, add specific subfolder by module.
   1. Edit multer.config
