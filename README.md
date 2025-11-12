# 🛒 E-Commerce Backend API

> **[English Version](#english)** | **[Version Française](#français)**

---

<a name="english"></a>

# 🇬🇧 English Version

A robust and scalable RESTful API for an e-commerce platform built with Node.js, Express, TypeScript, and Prisma.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791.svg)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development Roadmap](#-development-roadmap)
- [Security](#-security)
- [Contributing](#-contributing)

---

## ✨ Features

### Current Features (Phases 1-3 - In Progress)

#### 🏗️ Core System

- ✅ **Product Management**: Full CRUD with advanced filtering and pagination
- ✅ **Brand Management**: Organize products by manufacturer
- ✅ **Category Management**: Product categorization system
- ✅ **Customer Management**: User profiles with purchase history

#### 🔐 Authentication & Authorization

- ✅ **JWT Authentication**: Secure token-based auth with access/refresh tokens
- ✅ **Token Rotation**: Enhanced security with automatic token rotation
- ✅ **Password Hashing**: Bcrypt for secure password storage
- ✅ **Protected Routes**: Middleware-based route protection
- ✅ **Profile Management**: User can view and update their profile

#### 🛒 Order Management

- ✅ **Order Creation**: Create orders with automatic stock validation
- ✅ **Stock Management**: Automatic inventory updates
- ✅ **Order Tracking**: View order history with pagination and filters
- ✅ **Status Management**: Update order status with transition validation
- ✅ **Transaction Safety**: Prisma transactions for data consistency
- ✅ **Customer Stats**: Automatic update of purchase history

#### ⭐ Review System

- ✅ **Product Reviews**: Customers can review purchased products
- ✅ **Rating System**: 1-5 star ratings with comments
- ✅ **Purchase Verification**: Only customers who received the product can review
- ✅ **One Review Per Product**: Customers can only leave one review per product
- ✅ **Review Statistics**: Automatic calculation of average ratings and distribution
- ✅ **Review Management**: Delete your own reviews

#### 🛡️ Quality & Security

- ✅ **Input Validation**: Zod schemas for type-safe validation
- ✅ **Error Handling**: Centralized error management
- ✅ **Logging**: Winston for application logging
- ✅ **Security Headers**: Helmet for HTTP security
- ✅ **Type Safety**: Full TypeScript implementation

### Upcoming Features (Phases 3-5)

- 🔄 **Shopping Cart**: Session-based cart with Redis
- 🔄 **Advanced Search**: Full-text search with multiple filters
- 🔄 **RBAC**: Role-based access control (Admin/User/Manager)
- 🔄 **Image Upload**: Product image management with Multer/Sharp
- 🔄 **Payment Integration**: Stripe payment processing
- 🔄 **Email Notifications**: Transactional emails
- 🔄 **API Documentation**: Swagger/OpenAPI docs
- 🔄 **Testing Suite**: Unit and integration tests

---

## 🛠️ Tech Stack

### Core

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Framework**: Express 4.18
- **ORM**: Prisma 6.16

### Database

- **Primary**: PostgreSQL 14+
- **Cache**: Redis (planned for Phase 3)

### Security & Validation

- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Security Headers**: Helmet

### Development Tools

- **Linter**: ESLint
- **Formatter**: Prettier
- **Testing**: Jest + Supertest (planned for Phase 4)
- **API Testing**: Insomnia / Postman
- **Logging**: Winston

---

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
│  (Insomnia) │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│        Express API               │
│  ┌──────────────────────────┐   │
│  │   Middleware Layer       │   │
│  │  - Auth Middleware       │   │
│  │  - Validation (Zod)      │   │
│  │  - Error Handler         │   │
│  │  - Security (Helmet)     │   │
│  │  - Winston Logger        │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   Routes Layer           │   │
│  │  /api/auth               │   │
│  │  /api/products           │   │
│  │  /api/orders             │   │
│  │  /api/reviews            │   │
│  │  /api/customers          │   │
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
       └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
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

   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET="your-different-refresh-secret-min-32-characters"
   JWT_REFRESH_EXPIRES_IN=30d

   # Bcrypt
   BCRYPT_ROUNDS=10
   ```

   **⚠️ Important**: Generate secure secrets using:

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

# Testing (coming in Phase 4)
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

---

## 🗄️ Database Schema

### Core Models

- **Customer**: User accounts with authentication and purchase history
- **RefreshToken**: JWT refresh tokens for secure authentication
- **Product**: Items for sale with pricing and inventory
- **Brand**: Product manufacturers
- **Category**: Product classification
- **Order**: Customer purchases with order items
- **OrderItem**: Individual items within an order
- **Review**: Customer product reviews with ratings (1-5 stars)

For complete schema details, see [prisma/schema.prisma](prisma/schema.prisma)

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "1234567890",  // optional
  "address": "123 Main St"        // optional
}

Response: 201 Created
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": { ... }
}
```

#### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "1234567890",
    "address": "123 Main St"
  }
}
```

#### Update Profile

```http
PATCH /api/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "Johnny",
  "phone_number": "0987654321"
}

Response: 200 OK
{
  "message": "Profile updated successfully",
  "data": { ... }
}
```

#### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGci..."
}

Response: 200 OK
{
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "new_access_token...",
    "refreshToken": "new_refresh_token..."
  }
}
```

---

### Order Endpoints

#### Create Order

```http
POST /api/orders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}

Response: 201 Created
{
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "customer_id": 1,
      "order_date": "2025-10-20T10:00:00.000Z",
      "status": "PENDING",
      "total": 159.99
    },
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "price": 49.99
      }
    ]
  }
}
```

#### Get All Orders

```http
GET /api/orders?status=PENDING&page=1&limit=20
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Orders retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Query Parameters:**

- `status` - Filter by order status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### Get Order by ID

```http
GET /api/orders/:id
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Order retrieved successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "status": "PENDING",
    "total": 159.99,
    "orderItems": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "price": 49.99,
        "product": {
          "id": 1,
          "name": "Product Name",
          "imageUrl": "..."
        }
      }
    ]
  }
}
```

#### Update Order Status

```http
PATCH /api/orders/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "PROCESSING"
}

Response: 200 OK
{
  "message": "Order status updated successfully",
  "data": { ... }
}
```

**Valid Status Transitions:**

- PENDING → PROCESSING, CANCELLED
- PROCESSING → SHIPPED, CANCELLED
- SHIPPED → DELIVERED
- DELIVERED → REFUNDED

---

### Review Endpoints

#### Create Review

```http
POST /api/reviews
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": 1,
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}

Response: 201 Created
{
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "product_id": 1,
    "customer_id": 1,
    "rating": 5,
    "comment": "Excellent product! Highly recommended.",
    "createdAt": "2025-10-20T10:00:00.000Z",
    "customer": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

**Requirements:**

- Must have purchased and received the product (order status = DELIVERED)
- Only one review per customer per product
- Rating must be between 1 and 5
- Comment must be at least 10 characters (optional)

#### Get Product Reviews

```http
GET /api/products/:productId/reviews?page=1&limit=10

Response: 200 OK
{
  "message": "Reviews retrieved successfully",
  "data": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent product!",
      "createdAt": "2025-10-20T10:00:00.000Z",
      "customer": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  ],
  "stats": {
    "total": 15,
    "averageRating": 4.5,
    "distribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 5,
      "5": 7
    }
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Reviews per page (default: 10, max: 50)

#### Delete Review

```http
DELETE /api/reviews/:id
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Review deleted successfully"
}
```

**Requirements:**

- Only the author can delete their own review

---

### Product Endpoints

```http
GET    /api/products           # Get all products (with filters)
GET    /api/products/:id       # Get single product
POST   /api/products           # Create product
PATCH  /api/products/:id       # Update product
DELETE /api/products/:id       # Delete product
```

**Query Parameters for GET /products:**

- `category` - Filter by category name
- `brand` - Filter by brand name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search in name/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

---

### Customer Endpoints

```http
GET    /api/customers          # Get all customers
GET    /api/customers/:id      # Get single customer
POST   /api/customers          # Create customer
PATCH  /api/customers/:id      # Update customer
DELETE /api/customers/:id      # Delete customer
```

---

### Brand & Category Endpoints

```http
GET    /api/brands             # Get all brands
GET    /api/categories         # Get all categories
```

---

## 📁 Project Structure

```
e-commerce-backend/
├── prisma/
│   ├── migrations/              # Database migrations
│   ├── schema.prisma            # Database schema
│   └── seed*.ts                 # Seed scripts
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controller/      # Auth controllers
│   │   │   ├── service/         # Auth business logic
│   │   │   ├── schema/          # Zod validation schemas
│   │   │   └── routes/          # Auth routes
│   │   ├── order/
│   │   │   ├── controller/      # Order controllers
│   │   │   ├── service/         # Order business logic
│   │   │   ├── schema/          # Zod validation schemas
│   │   │   └── routes/          # Order routes
│   │   ├── review/
│   │   │   ├── controller/      # Review controllers
│   │   │   ├── service/         # Review business logic
│   │   │   ├── schema/          # Zod validation schemas
│   │   │   └── routes/          # Review routes
│   │   ├── product/             # Product module
│   │   ├── customer/            # Customer module
│   │   ├── brand/               # Brand module
│   │   └── category/            # Category module
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── errorHandler.ts      # Error handling
│   │   ├── validate.ts          # Zod validation
│   │   └── security.ts          # Helmet configuration
│   ├── utils/
│   │   ├── asyncHandler.ts      # Async error wrapper
│   │   ├── jwt.utils.ts         # JWT utilities
│   │   └── logger.ts            # Winston logger
│   ├── errors/                  # Custom error classes
│   ├── types/                   # TypeScript types
│   ├── generated/prisma/        # Generated Prisma Client
│   └── server.ts                # App entry point
├── docs/
│   └── api-collections/         # API collection exports
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── tsconfig.json                # TypeScript config
└── package.json
```

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Foundations (Weeks 1-2) - **COMPLETED**

- [x] Project setup and configuration
- [x] Database schema design
- [x] Product, Brand, Category, Customer modules
- [x] Database seeding

### ✅ Phase 2: Business Logic (Weeks 3-5) - **COMPLETED**

- [x] Advanced validation with Zod
- [x] Centralized error handling
- [x] Winston logging
- [x] Helmet security
- [x] JWT Authentication (register, login, profile)
- [x] Refresh token system with rotation
- [x] Order creation with stock validation
- [x] Order management (list, detail, status update)
- [x] Prisma transactions

### 🔄 Phase 3: Advanced Features (Weeks 6-8) - **IN PROGRESS**

- [x] **Session 11**: Product reviews with ratings ✅
- [x] **Session 12**: Shopping cart with Redis ✅
- [ ] **Session 13**: Advanced search & filters
- [ ] **Session 14**: Role-Based Access Control (RBAC)
- [ ] **Session 15**: Image upload system (Multer + Sharp)

### ⏳ Phase 4: Testing & Quality (Weeks 9-10)

- [ ] **Session 16**: Unit tests (Services)
- [ ] **Session 17**: Unit tests (Controllers)
- [ ] **Session 18**: Integration tests (E2E)
- [ ] **Session 19**: Security hardening
- [ ] **Session 20**: Swagger/OpenAPI documentation

### ⏳ Phase 5: Bonus Features (Weeks 11-12)

- [ ] **Session 21**: Email notifications (Nodemailer)
- [ ] **Session 22**: Stripe payment integration
- [ ] **Session 23**: Background jobs with Bull
- [ ] **Session 24**: Docker & Deployment

**Total Duration**: 12 weeks @ 4h/day (Mon-Fri) = ~96 hours  
**Current Progress**: 50% (12/24 sessions) 🎯

---

## 🛡️ Security

### Implemented Security Measures

- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Token Rotation**: Automatic refresh token rotation
- ✅ **Password Hashing**: bcrypt with configurable rounds
- ✅ **Input Validation**: Zod schemas for all inputs
- ✅ **SQL Injection Protection**: Prisma ORM parameterized queries
- ✅ **Security Headers**: Helmet for HTTP security (XSS, CSRF, etc.)
- ✅ **Error Sanitization**: No sensitive data in error responses
- ✅ **Route Protection**: Middleware-based authentication
- ✅ **Business Rules Enforcement**: Purchase verification for reviews
- ✅ **Resource Ownership**: Users can only access/modify their own resources

### Best Practices

- Environment variables for secrets
- Separate access and refresh tokens
- Token expiration management
- Database-stored refresh tokens (revocable)
- User-owned resource validation
- Status transition validation
- One review per customer per product
- Rating bounds enforcement (1-5)

---

## 🧪 Testing

### Manual Testing

Use Insomnia or Postman with the provided collection in `docs/api-collections/`

**Export your collection regularly** to avoid data loss!

### Automated Testing (Coming in Phase 4)

```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
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

## 📞 Contact

- **Developer**: GDevWeb
- **Project Link**: [GitHub Repository](https://github.com/your-username/e-commerce-backend)
- **Issues**: [Report a bug](https://github.com/your-username/e-commerce-backend/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ and TypeScript**

---

---

<a name="français"></a>

# 🇫🇷 Version Française

Une API RESTful robuste et évolutive pour une plateforme e-commerce construite avec Node.js, Express, TypeScript et Prisma.

---

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités-1)
- [Stack Technique](#-stack-technique-1)
- [Architecture](#-architecture-1)
- [Démarrage](#-démarrage-1)
- [Schéma de Base de Données](#-schéma-de-base-de-données-1)
- [Documentation API](#-documentation-api-1)
- [Structure du Projet](#-structure-du-projet-1)
- [Feuille de Route](#-feuille-de-route-1)
- [Sécurité](#-sécurité-1)
- [Contribution](#-contribution-1)

---

## ✨ Fonctionnalités

### Fonctionnalités Actuelles (Phases 1-3 - En Cours)

#### 🏗️ Système de Base

- ✅ **Gestion des Produits** : CRUD complet avec filtrage avancé et pagination
- ✅ **Gestion des Marques** : Organisation des produits par fabricant
- ✅ **Gestion des Catégories** : Système de catégorisation des produits
- ✅ **Gestion des Clients** : Profils utilisateurs avec historique d'achats

#### 🔐 Authentification & Autorisation

- ✅ **Authentification JWT** : Auth sécurisée par tokens avec access/refresh
- ✅ **Rotation des Tokens** : Sécurité renforcée avec rotation automatique
- ✅ **Hachage des Mots de Passe** : Bcrypt pour stockage sécurisé
- ✅ **Routes Protégées** : Protection par middleware
- ✅ **Gestion du Profil** : Consultation et modification du profil

#### 🛒 Gestion des Commandes

- ✅ **Création de Commandes** : Création avec validation automatique du stock
- ✅ **Gestion du Stock** : Mise à jour automatique de l'inventaire
- ✅ **Suivi des Commandes** : Historique avec pagination et filtres
- ✅ **Gestion des Statuts** : Mise à jour avec validation des transitions
- ✅ **Sécurité Transactionnelle** : Transactions Prisma pour cohérence
- ✅ **Stats Client** : Mise à jour automatique de l'historique d'achats

#### ⭐ Système d'Avis

- ✅ **Avis Produits** : Les clients peuvent évaluer les produits achetés
- ✅ **Système de Notes** : Notes de 1 à 5 étoiles avec commentaires
- ✅ **Vérification d'Achat** : Seuls les clients ayant reçu le produit peuvent donner un avis
- ✅ **Un Avis par Produit** : Un seul avis par client et par produit
- ✅ **Statistiques** : Calcul automatique des moyennes et distribution
- ✅ **Gestion des Avis** : Suppression de ses propres avis

#### 🛡️ Qualité & Sécurité

- ✅ **Validation des Entrées** : Schémas Zod pour validation type-safe
- ✅ **Gestion des Erreurs** : Gestion centralisée
- ✅ **Logging** : Winston pour logs applicatifs
- ✅ **En-têtes de Sécurité** : Helmet pour sécurité HTTP
- ✅ **Sécurité des Types** : TypeScript complet

### Fonctionnalités À Venir (Phases 3-5)

- 🔄 **Panier d'Achat** : Panier avec Redis
- 🔄 **Recherche Avancée** : Recherche full-text avec filtres
- 🔄 **RBAC** : Contrôle d'accès basé sur les rôles
- 🔄 **Upload d'Images** : Gestion des images produits
- 🔄 **Intégration Paiement** : Traitement Stripe
- 🔄 **Notifications Email** : Emails transactionnels
- 🔄 **Documentation API** : Swagger/OpenAPI
- 🔄 **Suite de Tests** : Tests unitaires et d'intégration

---

## 🛠️ Stack Technique

### Core

- **Runtime** : Node.js 18+
- **Langage** : TypeScript 5.3+
- **Framework** : Express 4.18
- **ORM** : Prisma 6.16

### Base de Données

- **Primaire** : PostgreSQL 14+
- **Cache** : Redis (prévu Phase 3)

### Sécurité & Validation

- **Authentification** : JWT
- **Hachage** : bcrypt
- **Validation** : Zod
- **Sécurité** : Helmet

### Outils

- **Linter** : ESLint
- **Formatter** : Prettier
- **Testing** : Jest + Supertest (Phase 4)
- **API Testing** : Insomnia / Postman
- **Logging** : Winston

---

## 🚀 Démarrage

### Prérequis

- Node.js 18+ et npm
- PostgreSQL 14+
- Git

### Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/your-username/e-commerce-backend.git
   cd e-commerce-backend
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configuration**

   Créer `.env` :

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/e_commerce_db"
   NODE_ENV=development
   PORT=3000
   JWT_SECRET="votre-secret-jwt-securise-32-chars-min"
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET="votre-secret-refresh-different-32-chars-min"
   JWT_REFRESH_EXPIRES_IN=30d
   BCRYPT_ROUNDS=10
   ```

4. **Base de données**

   ```bash
   createdb e_commerce_db
   npx prisma migrate dev --name init
   npx prisma generate
   npm run prisma:seed
   ```

5. **Démarrer**

   ```bash
   npm run dev
   ```

---

## 📚 Documentation API

### Endpoints Authentification

```http
POST /api/auth/register    # Inscription
POST /api/auth/login       # Connexion
GET  /api/auth/profile     # Voir profil
PATCH /api/auth/profile    # Modifier profil
POST /api/auth/refresh     # Rafraîchir token
```

### Endpoints Commandes

```http
POST  /api/orders           # Créer commande
GET   /api/orders           # Lister commandes
GET   /api/orders/:id       # Détail commande
PATCH /api/orders/:id/status # Modifier statut
```

### Endpoints Avis

```http
POST   /api/reviews                      # Créer avis
GET    /api/products/:productId/reviews  # Voir avis produit
DELETE /api/reviews/:id                  # Supprimer avis
```

**Règles des Avis** :

- ✅ Produit doit être acheté et reçu (DELIVERED)
- ✅ Un seul avis par client/produit
- ✅ Note de 1 à 5 étoiles
- ✅ Commentaire minimum 10 caractères (optionnel)

### Endpoints Produits

```http
GET    /api/products        # Lister produits
GET    /api/products/:id    # Détail produit
POST   /api/products        # Créer produit
PATCH  /api/products/:id    # Modifier produit
DELETE /api/products/:id    # Supprimer produit
```

---

## 🗺️ Feuille de Route

### ✅ Phase 1 : Fondations - **TERMINÉE**

- [x] Configuration projet
- [x] Schéma base de données
- [x] Modules de base

### ✅ Phase 2 : Logique Métier - **TERMINÉE**

- [x] Validation Zod
- [x] Gestion erreurs
- [x] Logging Winston
- [x] Sécurité Helmet
- [x] Authentification JWT complète
- [x] Système de refresh tokens
- [x] Gestion complète des commandes
- [x] Transactions Prisma

### 🔄 Phase 3 : Fonctionnalités Avancées - **EN COURS**

- [x] **Session 11** : Système d'avis produits ✅
- [x] **Session 12** : Panier avec Redis ✅
- [ ] **Session 13** : Recherche avancée
- [ ] **Session 14** : RBAC (Admin/User)
- [ ] **Session 15** : Upload d'images

### ⏳ Phase 4 : Tests & Qualité

- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Documentation Swagger

### ⏳ Phase 5 : Bonus

- [ ] Notifications email
- [ ] Paiement Stripe
- [ ] Jobs arrière-plan
- [ ] Docker & Déploiement

**Progression** : 50% (12/24 sessions) 🎯

---

## 🛡️ Sécurité

### Mesures Implémentées

- ✅ Authentification JWT sécurisée
- ✅ Rotation automatique des tokens
- ✅ Hachage bcrypt
- ✅ Validation Zod complète
- ✅ Protection injection SQL (Prisma)
- ✅ En-têtes sécurisés (Helmet)
- ✅ Sanitisation erreurs
- ✅ Protection routes par middleware
- ✅ Vérification d'achat pour avis
- ✅ Propriété des ressources

---

## 📞 Contact

- **Développeur** : GDevWeb
- **GitHub** : [Dépôt](https://github.com/your-username/e-commerce-backend)

---

## 📄 Licence

MIT License

---

**Construit avec ❤️ et TypeScript**
