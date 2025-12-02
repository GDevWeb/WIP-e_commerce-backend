# 🛒 E-Commerce Backend API

> **[English Version](#english)** | **[Version Française](#français)**

---

<a name="english"></a>

# English Version

A robust and scalable RESTful API for an e-commerce platform built with Node.js, Express, TypeScript, and Prisma.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791.svg)](https://www.postgresql.org/)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Features

### Core System

- **Product Management**: Full CRUD with advanced filtering and pagination
- **Brand & Category Management**: Organize products by manufacturer and type
- **Customer Management**: User profiles with purchase history
- **Order Processing**: Complete order lifecycle with stock validation
- **Review System**: Customer reviews with 1-5 star ratings
- **Shopping Cart**: Redis-based session cart
- **Advanced Search**: Full-text search with multiple filters
- **Image Upload**: Product image management with optimization

### Authentication & Authorization

- **JWT Authentication**: Secure token-based auth with access/refresh tokens
- **Token Rotation**: Automatic refresh token rotation for enhanced security
- **Password Security**: bcrypt hashing with configurable rounds
- **Role-Based Access Control**: USER, MANAGER, ADMIN roles
- **Profile Management**: User profile viewing and updates

### Security Features

- **HTTP Security Headers**: Helmet configuration (CSP, HSTS, X-Frame-Options, etc.)
- **Rate Limiting**: Protection against brute force and DDoS
  - General API: 100 requests/15min per IP
  - Authentication: 5 attempts/15min per IP
  - Registration: 3 accounts/hour per IP
  - Write operations: 50 requests/15min per IP
- **CORS**: Configured allowed origins with credentials support
- **Input Validation**: Zod schemas for type-safe validation
- **SQL Injection Protection**: Prisma parameterized queries
- **XSS Protection**: Input sanitization and security headers

### Quality & Development

- **Input Validation**: Zod schemas throughout the application
- **Error Handling**: Centralized error management with custom error classes
- **Logging**: Winston for structured application logging
- **Type Safety**: Full TypeScript implementation
- **Interactive Documentation**: Swagger/OpenAPI 3.0 with "Try it out" functionality
- **Testing**: Unit tests for services and controllers (80%+ coverage)

---

## Tech Stack

### Core Technologies

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Framework**: Express 4.18
- **ORM**: Prisma 6.16
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+

### Security & Validation

- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Security**: Helmet, express-rate-limit, CORS
- **Image Processing**: Multer, Sharp

### Development Tools

- **Linter**: ESLint
- **Formatter**: Prettier
- **Testing**: Jest + Supertest
- **API Testing**: Insomnia / Postman
- **Logging**: Winston
- **Documentation**: Swagger UI

---

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│        Express API               │
│  ┌──────────────────────────┐   │
│  │   Middleware Layer       │   │
│  │  - Security (Helmet)     │   │
│  │  - Rate Limiting         │   │
│  │  - CORS                  │   │
│  │  - Auth Middleware       │   │
│  │  - Validation (Zod)      │   │
│  │  - Error Handler         │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   Controllers Layer      │   │
│  │  (Request Handling)      │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   Services Layer         │   │
│  │  (Business Logic)        │   │
│  └──────────┬───────────────┘   │
└─────────────┼───────────────────┘
              │
              ▼
       ┌──────────────┐
       │  Prisma ORM  │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ PostgreSQL   │
       │   + Redis    │
       └──────────────┘
```

**Architecture Pattern**: MVC (Model-View-Controller)

**Separation of Concerns**:

- **Routes**: Define endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic
- **Prisma**: Database access layer

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 7+ (for cart functionality)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/e-commerce-backend.git
   cd e-commerce-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment configuration**

   Create a `.env` file at the root:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/e_commerce_db?schema=public"

   # Server
   NODE_ENV=development
   PORT=3000

   # JWT Configuration (CHANGE IN PRODUCTION!)
   JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET="your-different-refresh-secret-min-32-characters"
   JWT_REFRESH_EXPIRES_IN=7d

   # Bcrypt
   BCRYPT_ROUNDS=10

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # Security
   ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
   ```

   **IMPORTANT**: Generate secure secrets using:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. **Database setup**

   ```bash
   # Create database
   createdb e_commerce_db

   # Run migrations
   npx prisma migrate dev --name init

   # Generate Prisma Client
   npx prisma generate

   # Seed database with sample data
   npm run prisma:seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3000`

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with nodemon
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production build

# Database
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate Prisma Client
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed database

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests
```

---

## API Documentation

### Interactive Documentation

**Swagger UI available at**: `http://localhost:3000/api-docs`

The API includes interactive Swagger documentation with "Try it out" functionality for all endpoints.

### Test Credentials

Use these credentials to test different access levels in Swagger:

**ADMIN Account** (full access to all routes):

```json
{
  "email": "admin_test@fakemail.com",
  "password": "P@ssword123."
}
```

**Regular USER**: Register a new account via `POST /auth/register`

### Quick Start with Swagger

1. Start the server: `npm run dev`
2. Open: `http://localhost:3000/api-docs`
3. **Test as User**:
   - POST /auth/register (create account)
   - Copy the `accessToken`
   - Click "Authorize" button
   - Paste token and authorize
   - Try: GET /auth/profile
4. **Test as Admin**:
   - POST /auth/login (use admin credentials above)
   - Copy the `accessToken`
   - Click "Authorize" button
   - Try: POST /products (create product)
   - Try: GET /customers/admin/all (view all customers)

### Base URL

```
http://localhost:3000/api
```

### Main Endpoints

#### Authentication

```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login
GET    /api/auth/profile      # Get profile (requires auth)
PATCH  /api/auth/profile      # Update profile (requires auth)
POST   /api/auth/refresh      # Refresh access token
```

#### Products

```
GET    /api/products           # Get all products (public)
GET    /api/products/:id       # Get product by ID (public)
POST   /api/products           # Create product (ADMIN only)
PATCH  /api/products/:id       # Update product (ADMIN only)
DELETE /api/products/:id       # Delete product (ADMIN only)
GET    /api/products/search    # Search products
```

#### Orders

```
POST   /api/orders             # Create order (requires auth)
GET    /api/orders             # Get user orders (requires auth)
GET    /api/orders/:id         # Get order details (requires auth)
PATCH  /api/orders/:id/status  # Update order status (ADMIN)
```

#### Reviews

```
POST   /api/reviews                       # Create review (requires auth)
GET    /api/products/:productId/reviews   # Get product reviews (public)
DELETE /api/reviews/:id                   # Delete own review (requires auth)
```

#### Cart

```
GET    /api/cart               # Get cart (requires auth)
POST   /api/cart/items         # Add item to cart (requires auth)
PATCH  /api/cart/items/:id     # Update item quantity (requires auth)
DELETE /api/cart/items/:id     # Remove item (requires auth)
DELETE /api/cart/clear         # Clear cart (requires auth)
```

#### Customers

```
GET    /api/customers          # Get customers (ADMIN only)
GET    /api/customers/:id      # Get customer by ID (ADMIN only)
PATCH  /api/customers/:id/role # Update customer role (ADMIN only)
```

For complete request/response examples and schemas, see the Swagger documentation.

---

## Security

This API implements production-ready security measures:

### HTTP Security Headers (Helmet)

- Content Security Policy (CSP)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Strict-Transport-Security (HSTS)
- X-XSS-Protection
- Referrer-Policy
- X-DNS-Prefetch-Control

### Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes (brute force protection)
- **Registration**: 3 accounts per hour per IP
- **Write Operations**: 50 requests per 15 minutes per IP

### CORS Configuration

- Configured allowed origins whitelist
- Credentials support enabled
- Pre-flight requests handled
- Development vs production modes

### Authentication & Authorization

- JWT tokens with configurable expiration
- Refresh token rotation for enhanced security
- Bcrypt password hashing (10 rounds, configurable)
- Role-Based Access Control (USER, MANAGER, ADMIN)
- Protected routes with authentication middleware
- Token stored in database (revocable)

### Input Validation & Sanitization

- Zod schema validation for all inputs
- Type-safe request validation
- SQL injection protection via Prisma parameterized queries
- Sensitive data exclusion in responses (via Prisma select)

### Best Practices

- Environment variables for all secrets
- No sensitive data in error messages
- Resource ownership validation
- Business rules enforcement (e.g., purchase verification for reviews)
- Secure password requirements
- Token expiration management

### Testing Security

Test the security configuration:

```bash
npm run dev
./scripts/test-security.sh  # Run security tests
```

---

## Project Structure

```
e-commerce-backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Database schema
│   └── seed*.ts             # Seed scripts
├── src/
│   ├── modules/
│   │   ├── auth/            # Authentication module
│   │   ├── product/         # Product module
│   │   ├── order/           # Order module
│   │   ├── review/          # Review module
│   │   ├── cart/            # Shopping cart module
│   │   ├── customer/        # Customer module
│   │   └── [brand, category]/
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validate.ts
│   │   └── errorHandler.ts
│   ├── config/
│   │   ├── env.config.ts
│   │   └── security.config.ts
│   ├── utils/
│   ├── errors/
│   ├── types/
│   ├── docs/                # Swagger documentation
│   └── server.ts
├── scripts/
│   └── test-security.sh     # Security testing script
├── .env.example
├── tsconfig.json
└── package.json
```

---

## Development Roadmap

### Phase 1: Foundations (Weeks 1-2) - COMPLETED

- [x] Project setup and configuration
- [x] Database schema design
- [x] Base CRUD modules
- [x] Database seeding

### Phase 2: Business Logic (Weeks 3-5) - COMPLETED

- [x] Advanced validation with Zod
- [x] Centralized error handling
- [x] JWT Authentication system
- [x] Refresh token rotation
- [x] Order management
- [x] Review system

### Phase 3: Advanced Features (Weeks 6-8) - COMPLETED

- [x] Shopping cart with Redis
- [x] Advanced search with filters
- [x] Role-Based Access Control (RBAC)
- [x] Image upload with optimization

### Phase 4: Testing & Quality (Weeks 9-10) - COMPLETED

- [x] Unit tests (Services & Controllers) - 80%+ coverage
- [x] Integration tests (partial, manual validation)
- [x] Security hardening (Helmet, Rate limiting, CORS)
- [x] API documentation (Swagger/OpenAPI)

### Phase 5: Production & Deployment (Weeks 11-12)

- [ ] Email notifications (Nodemailer)
- [ ] Payment integration (Stripe)
- [ ] Background jobs (Bull/BullMQ)
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Cloud deployment (Railway/Render/AWS)

**Current Progress**: 84% (21/25 sessions)  
**Total Duration**: 12 weeks @ 4h/day = ~100 hours

---

## Testing

### Unit Tests

```bash
npm run test:unit          # Run unit tests only
npm run test:coverage      # Generate coverage report
```

**Coverage**: 80%+ on services and controllers

### Integration Tests

Integration tests validate complete user flows with real database operations:

```bash
npm run test:integration   # Run E2E tests
```

### Manual Testing

Use the interactive Swagger documentation at `/api-docs` or import the Postman/Insomnia collection from `docs/api-collections/`.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

---

## Contact

- **Developer**: GDevWeb
- **Project**: [GitHub Repository](https://github.com/your-username/e-commerce-backend)
- **Issues**: [Report a bug](https://github.com/your-username/e-commerce-backend/issues)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with TypeScript**

---

---

<a name="français"></a>

# Version Française

Une API RESTful robuste et évolutive pour une plateforme e-commerce.

---

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Stack Technique](#stack-technique-1)
- [Démarrage](#démarrage)
- [Documentation API](#documentation-api-1)
- [Sécurité](#sécurité-1)
- [Feuille de Route](#feuille-de-route)

---

## Fonctionnalités

### Système de Base

- **Gestion Produits**: CRUD complet avec filtres et pagination
- **Gestion Marques & Catégories**: Organisation des produits
- **Gestion Clients**: Profils avec historique d'achats
- **Traitement Commandes**: Cycle complet avec validation stock
- **Système d'Avis**: Notes de 1 à 5 étoiles
- **Panier d'Achat**: Panier avec Redis
- **Recherche Avancée**: Recherche full-text avec filtres
- **Upload Images**: Gestion et optimisation d'images

### Authentification & Autorisation

- **Authentification JWT**: Tokens access/refresh sécurisés
- **Rotation Tokens**: Rotation automatique
- **Sécurité Mots de Passe**: Hachage bcrypt
- **Contrôle d'Accès**: Rôles USER, MANAGER, ADMIN
- **Gestion Profil**: Consultation et modification

### Sécurité

- **En-têtes HTTP**: Configuration Helmet
- **Rate Limiting**: Protection brute force et DDoS
- **CORS**: Configuration origins autorisées
- **Validation**: Schémas Zod
- **Protection Injection**: Requêtes Prisma paramétrées

### Qualité & Développement

- **Validation**: Schémas Zod
- **Gestion Erreurs**: Centralisée
- **Logging**: Winston
- **TypeScript**: Complet
- **Documentation**: Swagger/OpenAPI interactive
- **Tests**: Coverage 80%+

---

## Stack Technique

### Technologies

- **Runtime**: Node.js 18+
- **Langage**: TypeScript 5.3+
- **Framework**: Express 4.18
- **ORM**: Prisma 6.16
- **Base de données**: PostgreSQL 14+
- **Cache**: Redis 7+

### Sécurité

- **Auth**: JWT
- **Hachage**: bcrypt
- **Validation**: Zod
- **Sécurité**: Helmet, express-rate-limit, CORS

---

## Démarrage

### Prérequis

- Node.js 18+, npm
- PostgreSQL 14+
- Redis 7+
- Git

### Installation

1. **Cloner**

   ```bash
   git clone https://github.com/your-username/e-commerce-backend.git
   cd e-commerce-backend
   ```

2. **Installer**

   ```bash
   npm install
   ```

3. **Configuration**

   Créer `.env`:

   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/e_commerce_db"
   NODE_ENV=development
   PORT=3000
   JWT_SECRET="secret-32-chars-minimum"
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET="different-secret-32-chars"
   JWT_REFRESH_EXPIRES_IN=7d
   BCRYPT_ROUNDS=10
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Base de données**

   ```bash
   createdb e_commerce_db
   npx prisma migrate dev
   npx prisma generate
   npm run prisma:seed
   ```

5. **Démarrer**

   ```bash
   npm run dev
   ```

---

## Documentation API

### Documentation Interactive

**Swagger UI**: `http://localhost:3000/api-docs`

Documentation interactive avec fonction "Try it out" pour tous les endpoints.

### Identifiants de Test

**Compte ADMIN**:

```json
{
  "email": "admin_test@fakemail.com",
  "password": "P@ssword123."
}
```

### URL de Base

```
http://localhost:3000/api
```

### Endpoints Principaux

#### Authentification

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PATCH  /api/auth/profile
POST   /api/auth/refresh
```

#### Produits

```
GET    /api/products
POST   /api/products       (ADMIN)
PATCH  /api/products/:id   (ADMIN)
DELETE /api/products/:id   (ADMIN)
```

#### Commandes

```
POST   /api/orders
GET    /api/orders
PATCH  /api/orders/:id/status
```

#### Avis

```
POST   /api/reviews
GET    /api/products/:id/reviews
DELETE /api/reviews/:id
```

#### Panier

```
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:id
DELETE /api/cart/items/:id
```

---

## Sécurité

### Mesures Implémentées

- En-têtes HTTP sécurisés (Helmet)
- Rate limiting par endpoint
- CORS configuré
- Validation Zod complète
- Protection injection SQL (Prisma)
- Hachage bcrypt
- JWT avec rotation

### Tests Sécurité

```bash
./scripts/test-security.sh
```

---

## Feuille de Route

### Phase 1-3: Fondations & Features - TERMINÉ

- [x] Architecture MVC
- [x] Authentification JWT
- [x] Système commandes
- [x] Avis produits
- [x] Panier Redis
- [x] RBAC
- [x] Upload images

### Phase 4: Qualité - TERMINÉ

- [x] Tests unitaires (80%+)
- [x] Sécurité (Helmet, Rate limiting)
- [x] Documentation Swagger

### Phase 5: Production

- [x] Jobs arrière-plan
- [x] CI/CD
- [x] Déploiement
- [ ] Clean project
- [x] Docker

### Phase 6: Extras (version 1.5)

- [ ] Notifications email
- [ ] Paiements Stripe

**Progression**: 84% (21/25 sessions)

---

## Contact

- **Développeur**: GDevWeb
- **GitHub**: [Dépôt](https://github.com/your-username/e-commerce-backend)

---

## Licence

MIT License

---

**Construit avec TypeScript**
