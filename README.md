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
- [Testing](#-testing)
- [Contributing](#-contributing)

---

## ✨ Features

### Current Features (Phase 1 - Completed)

- ✅ **Product Management**: Full CRUD operations with advanced filtering
- ✅ **Brand Management**: Organize products by manufacturer
- ✅ **Category Management**: Hierarchical product categorization
- ✅ **Customer Management**: User profiles and preferences
- ✅ **Database Seeding**: Pre-populated test data
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Prisma ORM**: Type-safe database access

### Upcoming Features (Phases 2-5)

- 🔄 **Authentication & Authorization**: JWT-based auth with RBAC
- 🔄 **Order Management**: Complete order lifecycle
- 🔄 **Shopping Cart**: Session-based cart with Redis
- 🔄 **Product Reviews**: Customer feedback system
- 🔄 **Payment Integration**: Stripe payment processing
- 🔄 **Image Upload**: Product image management
- 🔄 **Email Notifications**: Transactional emails
- 🔄 **Advanced Search**: Full-text search with filters
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

### Development Tools

- **Linter**: ESLint
- **Formatter**: Prettier
- **Testing**: Jest + Supertest (planned for Phase 4)
- **API Testing**: Postman

---

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
│  (Postman)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│        Express API               │
│  ┌──────────────────────────┐   │
│  │   Routes Layer           │   │
│  │  /api/products           │   │
│  │  /api/customers          │   │
│  │  /api/brands             │   │
│  │  /api/categories         │   │
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
   DATABASE_URL="postgresql://user:password@localhost:5432/e_commerce_db?schema=public"
   NODE_ENV=development
   PORT=3000
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

- **Customer**: User accounts with preferences and purchase history
- **Product**: Items for sale with pricing and inventory
- **Brand**: Product manufacturers
- **Category**: Product classification (ELECTRONICS, CLOTHING, etc.)
- **Order**: Customer purchases
- **OrderItem**: Individual items within an order
- **Review**: Customer product reviews

For complete schema details, see [prisma/schema.prisma](prisma/schema.prisma)

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Current Endpoints (Phase 1)

#### Products

```http
GET    /api/products           # Get all products (with filters)
GET    /api/products/:id       # Get single product
POST   /api/products           # Create product
PATCH  /api/products/:id       # Update product
DELETE /api/products/:id       # Delete product
```

#### Customers

```http
GET    /api/customers          # Get all customers
GET    /api/customers/:id      # Get single customer
POST   /api/customers          # Create customer
PATCH  /api/customers/:id      # Update customer
DELETE /api/customers/:id      # Delete customer
```

#### Brands & Categories

```http
GET    /api/brands             # Get all brands
GET    /api/categories         # Get all categories
```

> 📖 Full interactive API documentation will be available at `/api-docs` in Phase 4 (Swagger UI)

---

## 📁 Project Structure

```
e-commerce-backend/
├── prisma/                  # Database configuration
│   ├── migrations/          # Migration files
│   ├── schema.prisma        # Database schema
│   └── seed*.ts            # Seed scripts
├── src/
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   ├── routes/              # API routes
│   ├── generated/prisma/    # Generated Prisma Client
│   └── server.ts            # App entry point
├── .env                     # Environment variables
├── tsconfig.json            # TypeScript config
└── package.json
```

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Foundations (Weeks 1-2) - **COMPLETED**

- [x] Project setup and configuration
- [x] Database schema design
- [x] Product, Brand, Category, Customer modules
- [x] Database seeding

### 🔄 Phase 2: Business Logic (Weeks 3-5) - **IN PROGRESS**

- [x] Advanced validation with Zod - TODO: OrderItem et Review
- [x] Centralized error handling
- [x] JWT Authentication
- [ ] Order management system

### 🚀 Phase 3: Advanced Features (Weeks 6-8)

- [ ] Product reviews
- [ ] Shopping cart with Redis
- [ ] Advanced search & filters
- [ ] Role-Based Access Control (RBAC)
- [ ] Image upload system

### ✅ Phase 4: Testing & Quality (Weeks 9-10)

- [ ] Unit tests
- [ ] Integration tests
- [ ] Security hardening
- [ ] Swagger documentation

### 🎁 Phase 5: Bonus Features (Weeks 11-12)

- [ ] Email notifications
- [ ] Stripe payment integration
- [ ] Background jobs with Bull
- [ ] Docker & Deployment

**Total Duration**: 12 weeks @ 4h/day (Mon-Fri) = ~96 hours

---

## 🧪 Testing

Testing infrastructure will be implemented in Phase 4 (Sessions 16-18)

```bash
npm test                # Run all tests (coming soon)
npm run test:coverage   # Generate coverage report (coming soon)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Architecture](#-architecture-1)
- [Démarrage](#-démarrage)
- [Schéma de Base de Données](#-schéma-de-base-de-données)
- [Documentation API](#-documentation-api)
- [Structure du Projet](#-structure-du-projet)
- [Feuille de Route](#-feuille-de-route)
- [Tests](#-tests)
- [Contribution](#-contribution)

---

## ✨ Fonctionnalités

### Fonctionnalités Actuelles (Phase 1 - Terminée)

- ✅ **Gestion des Produits** : CRUD complet avec filtrage avancé
- ✅ **Gestion des Marques** : Organisation des produits par fabricant
- ✅ **Gestion des Catégories** : Catégorisation hiérarchique des produits
- ✅ **Gestion des Clients** : Profils utilisateurs et préférences
- ✅ **Seeding de Base de Données** : Données de test pré-remplies
- ✅ **Sécurité des Types** : Implémentation complète TypeScript
- ✅ **Prisma ORM** : Accès à la base de données type-safe

### Fonctionnalités À Venir (Phases 2-5)

- 🔄 **Authentification & Autorisation** : Auth JWT avec RBAC
- 🔄 **Gestion des Commandes** : Cycle de vie complet des commandes
- 🔄 **Panier d'Achat** : Panier basé sur les sessions avec Redis
- 🔄 **Avis Produits** : Système de feedback client
- 🔄 **Intégration Paiement** : Traitement des paiements Stripe
- 🔄 **Upload d'Images** : Gestion des images produits
- 🔄 **Notifications Email** : Emails transactionnels
- 🔄 **Recherche Avancée** : Recherche full-text avec filtres
- 🔄 **Documentation API** : Documentation Swagger/OpenAPI
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
- **Cache** : Redis (prévu pour Phase 3)

### Outils de Développement

- **Linter** : ESLint
- **Formatter** : Prettier
- **Testing** : Jest + Supertest (prévu pour Phase 4)
- **Test API** : Postman

---

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
│  (Postman)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│        API Express               │
│  ┌──────────────────────────┐   │
│  │   Couche Routes          │   │
│  │  /api/products           │   │
│  │  /api/customers          │   │
│  │  /api/brands             │   │
│  │  /api/categories         │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   Couche Controllers     │   │
│  │  (Gestion Requêtes)      │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   Couche Services        │   │
│  │  (Logique Métier)        │   │
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

3. **Configuration de l'environnement**

   Créer un fichier `.env` à la racine :

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/e_commerce_db?schema=public"
   NODE_ENV=development
   PORT=3000
   ```

4. **Configuration de la base de données**

   ```bash
   # Créer la base de données
   createdb e_commerce_db

   # Exécuter les migrations
   npx prisma migrate dev --name init

   # Générer le Client Prisma
   npx prisma generate

   # Remplir la base avec des données de test
   npm run prisma:seed
   ```

5. **Démarrer le serveur de développement**

   ```bash
   npm run dev
   ```

   Le serveur sera accessible sur `http://localhost:3000`

### Scripts Disponibles

```bash
# Développement
npm run dev              # Démarre le serveur dev avec nodemon
npm run build            # Compile TypeScript vers JavaScript
npm start                # Exécute le build de production

# Base de données
npm run prisma:migrate   # Exécute les migrations
npm run prisma:generate  # Génère le Client Prisma
npm run prisma:studio    # Ouvre l'interface GUI Prisma Studio
npm run prisma:seed      # Remplit la base de données

# Tests (à venir en Phase 4)
npm test                 # Exécute les tests
npm run test:watch       # Exécute les tests en mode watch
npm run test:coverage    # Génère le rapport de couverture
```

---

## 🗄️ Schéma de Base de Données

### Modèles Principaux

- **Customer** : Comptes utilisateurs avec préférences et historique d'achats
- **Product** : Articles en vente avec prix et inventaire
- **Brand** : Fabricants de produits
- **Category** : Classification des produits (ELECTRONICS, CLOTHING, etc.)
- **Order** : Achats clients
- **OrderItem** : Articles individuels dans une commande
- **Review** : Avis clients sur les produits

Pour les détails complets du schéma, voir [prisma/schema.prisma](prisma/schema.prisma)

---

## 📚 Documentation API

### URL de Base

```
http://localhost:3000/api
```

### Endpoints Actuels (Phase 1)

#### Produits

```http
GET    /api/products           # Récupérer tous les produits (avec filtres)
GET    /api/products/:id       # Récupérer un produit
POST   /api/products           # Créer un produit
PATCH  /api/products/:id       # Modifier un produit
DELETE /api/products/:id       # Supprimer un produit
```

**Paramètres de requête pour GET /products :**

- `category` - Filtrer par nom de catégorie
- `brand` - Filtrer par nom de marque
- `minPrice` - Prix minimum
- `maxPrice` - Prix maximum
- `search` - Rechercher dans nom/description
- `page` - Numéro de page (défaut : 1)
- `limit` - Articles par page (défaut : 20)

#### Clients

```http
GET    /api/customers          # Récupérer tous les clients
GET    /api/customers/:id      # Récupérer un client
POST   /api/customers          # Créer un client
PATCH  /api/customers/:id      # Modifier un client
DELETE /api/customers/:id      # Supprimer un client
```

#### Marques & Catégories

```http
GET    /api/brands             # Récupérer toutes les marques
GET    /api/categories         # Récupérer toutes les catégories
```

### Exemples de Requêtes

**Créer un Client :**

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@example.com",
    "phone_number": "01-23-45-67-89",
    "address": "123 Rue Principale, Ville, Pays"
  }'
```

**Rechercher des Produits :**

```bash
curl "http://localhost:3000/api/products?category=ELECTRONICS&minPrice=100&maxPrice=1000"
```

> 📖 La documentation API interactive complète sera disponible sur `/api-docs` en Phase 4 (Swagger UI)

---

## 📁 Structure du Projet

```
e-commerce-backend/
├── prisma/                  # Configuration base de données
│   ├── migrations/          # Fichiers de migration
│   ├── schema.prisma        # Schéma de base de données
│   └── seed*.ts            # Scripts de seeding
├── src/
│   ├── controllers/         # Gestionnaires de requêtes
│   ├── services/            # Logique métier
│   ├── routes/              # Routes API
│   ├── generated/prisma/    # Client Prisma généré
│   └── server.ts            # Point d'entrée de l'app
├── .env                     # Variables d'environnement
├── tsconfig.json            # Config TypeScript
└── package.json
```

---

## 🗺️ Feuille de Route

### ✅ Phase 1 : Fondations (Semaines 1-2) - **TERMINÉE**

- [x] Configuration du projet
- [x] Conception du schéma de base de données
- [x] Modules Product, Brand, Category, Customer
- [x] Seeding de la base de données

### 🔄 Phase 2 : Logique Métier (Semaines 3-5) - **EN COURS**

- [x] Validation avancée avec Zod - TODO: OrderItem et Review
- [x] Gestion centralisée des erreurs
- [ ] Authentification JWT
- [ ] Système de gestion des commandes

### 🚀 Phase 3 : Fonctionnalités Avancées (Semaines 6-8)

- [ ] Avis produits
- [ ] Panier d'achat avec Redis
- [ ] Recherche et filtres avancés
- [ ] Contrôle d'accès basé sur les rôles (RBAC)
- [ ] Système d'upload d'images

### ✅ Phase 4 : Tests & Qualité (Semaines 9-10)

- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Renforcement de la sécurité
- [ ] Documentation Swagger

### 🎁 Phase 5 : Fonctionnalités Bonus (Semaines 11-12)

- [ ] Notifications email
- [ ] Intégration paiement Stripe
- [ ] Jobs en arrière-plan avec Bull
- [ ] Docker & Déploiement

**Durée Totale** : 12 semaines @ 4h/jour (Lun-Ven) = ~96 heures

---

## 🧪 Tests

L'infrastructure de tests sera implémentée en Phase 4 (Sessions 16-18)

```bash
npm test                # Exécuter tous les tests (à venir)
npm run test:coverage   # Générer le rapport de couverture (à venir)
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Forker le dépôt
2. Créer une branche de fonctionnalité (`git checkout -b feature/NouvelleFonctionnalite`)
3. Commiter vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/NouvelleFonctionnalite`)
5. Ouvrir une Pull Request

---

## 📞 Contact

- **Développeur** : GDevWeb
- **Lien du Projet** : [Dépôt GitHub](https://github.com/your-username/e-commerce-backend)
- **Issues** : [Signaler un bug](https://github.com/your-username/e-commerce-backend/issues)

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Construit avec ❤️ et TypeScript**
