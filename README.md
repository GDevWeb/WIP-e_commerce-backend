# 🛒 E-Commerce Backend API

> **[English Version](#english)** | **[Version Française](#français)**

---

<a name="english"></a>

# 🇬🇧 English Version

A robust, production-grade RESTful API for an e-commerce platform, engineered with **Node.js**, **Express**, **TypeScript**, and **Prisma**.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791.svg)

- **Live API**: [https://e-commerce-backend-nine-alpha.vercel.app/](https://e-commerce-backend-nine-alpha.vercel.app/)
- **Documentation**: Available via Insomnia collection

> ℹ️ **Note on Latency**: The API runs on Vercel's Free Tier. The first request may take a few seconds to process due to **Serverless Cold Starts**. Subsequent requests will be instant.

---

## 📋 Table of Contents

- [About](#about)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Deployment](#deployment)

---

## 📖 About

This project is a **Technical Showcase** designed to demonstrate advanced backend architecture patterns and adherence to modern development standards. It simulates a real-world e-commerce environment, focusing on scalability, security, and developer experience.

It serves as a reference implementation for:

- **Clean Architecture** & Separation of Concerns
- **Secure Authentication** flows (JWT/Refresh Tokens)
- **High-Performance Caching** strategies with Redis
- **Serverless Deployment** pipelines on Vercel

---

## 🏗️ Architecture

The API follows a modular **MVC (Model-View-Controller)** pattern, deployed as Serverless Functions.

```mermaid
graph TB
    Client[Client / Insomnia]
    Vercel[Vercel Serverless Function]
    Middleware[Middleware Layer<br/>Auth & Security]
    Controllers[Controllers<br/>REST API]
    Services[Services<br/>Business Logic]
    Prisma[Prisma Client<br/>ORM]
    Neon[(Neon PostgreSQL<br/>Database)]
    Redis[(Upstash Redis<br/>Cache & Cart)]
    Cloudinary[Cloudinary CDN<br/>Media Storage]

    Client -->|HTTPS Request| Vercel
    Vercel --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Prisma
    Services --> Redis
    Services --> Cloudinary
    Prisma --> Neon

    style Client fill:#e1f5ff
    style Vercel fill:#000000,color:#fff
    style Middleware fill:#ff6b6b,color:#fff
    style Controllers fill:#4ecdc4,color:#fff
    style Services fill:#95e1d3
    style Prisma fill:#2d3748,color:#fff
    style Neon fill:#336791,color:#fff
    style Redis fill:#dc2626,color:#fff
    style Cloudinary fill:#3448c5,color:#fff
```

---

## ✨ Features

### Core Functionality

- **Products**: Advanced CRUD, text search, filtering, and pagination
- **Authentication**: Secure JWT system with Access/Refresh token rotation
- **Orders**: Full order lifecycle management with stock validation
- **Shopping Cart**: High-performance session-based cart using Redis (TTL)
- **Reviews**: Product rating system with customer feedback
- **Images**: Seamless image upload and optimization via Cloudinary

### Authorization (RBAC)

- **USER**: Browse products, manage cart, place orders, write reviews
- **MANAGER**: Manage product catalog
- **ADMIN**: Full system access, customer management, status updates

---

## 🛠️ Tech Stack

### Backend Core

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.9
- **Framework**: Express 5.1
- **Database**: PostgreSQL (via Neon Serverless)
- **ORM**: Prisma 6.16
- **Cache**: Redis (via Upstash / ioredis)

### Infrastructure & Tools

- **Deployment**: Vercel (Serverless Functions)
- **Storage**: Cloudinary (Image CDN)
- **Validation**: Zod (Schema validation)
- **Security**: Helmet, Rate-Limit, Bcrypt, CORS
- **Logging**: Winston
- **Testing**: Jest, Supertest

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (Local or Neon)
- Redis (Local or Upstash)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/GDevWeb/WIP-e_commerce-backend.git
    cd e-commerce-backend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file based on `.env.example`:

    ```env
    # Database
    DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

    # Redis (Use standard connection string)
    REDIS_URL="rediss://default:pass@host:6379"

    # Security
    JWT_SECRET="complex_secret"
    JWT_REFRESH_SECRET="another_complex_secret"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME="xxx"
    CLOUDINARY_API_KEY="xxx"
    CLOUDINARY_API_SECRET="xxx"
    ```

4.  **Database Setup**

    ```bash
    npx prisma migrate deploy
    npx prisma generate
    npm run prisma:seed # (Optional) Populate with dummy data
    ```

5.  **Run Locally**

    ```bash
    npm run dev
    ```

---

## 📚 API Documentation

### 📥 Insomnia Collection

For security and performance reasons, Swagger UI is disabled in production.
The comprehensive documentation (with pre-configured environments) is available via **Insomnia**.

👉 **[Download Insomnia Collection](./documentation/api_collections/insomnia_collection.json)**

### Test Credentials

| Role      | Email                     | Password       |
| --------- | ------------------------- | -------------- |
| **ADMIN** | `admin_test@fakemail.com` | `P@ssword123.` |
| **USER**  | `user_test@fakemail.com`  | `P@ssword123.` |

---

## 🔒 Security

This API implements industry-standard security practices:

- **Helmet**: Sets secure HTTP headers (HSTS, No-Sniff, etc.)
- **Rate Limiting**: Protects against brute-force and DDoS (Login: 5 attempts/15min)
- **Input Sanitization**: All inputs validated via **Zod** schemas
- **CORS**: Strict origin whitelist for production
- **No Information Leakage**: Production errors are sanitized (no stack traces)

---

## 🚀 Deployment

The project is configured for **Zero-Config Deployment** on Vercel.

- **Serverless**: The Express app is wrapped and exported for Vercel Serverless environment
- **Zero-Downtime**: Database migrations are handled safely
- **Environment**: `vercel.json` handles routing and rewrites

---

<a name="français"></a>

# 🇫🇷 Version Française

Une API RESTful robuste pour une plateforme e-commerce, conçue avec **Node.js**, **Express**, **TypeScript** et **Prisma**.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791.svg)

---

## 📖 À Propos

Ce projet est une **Démonstration Technique** (Portfolio) conçue pour illustrer la maîtrise des architectures backend modernes et des standards de l'industrie. Il simule un environnement e-commerce réel en mettant l'accent sur la sécurité, la performance et la maintenabilité du code.

Il sert d'implémentation de référence pour :

- L'**Architecture MVC** et la séparation des responsabilités
- Les flux d'**Authentification Sécurisée** (JWT/Refresh Tokens)
- Les stratégies de **Cache Haute Performance** avec Redis
- Les pipelines de **Déploiement Serverless** (CI/CD) sur Vercel

- > **Live API**: [https://e-commerce-backend-nine-alpha.vercel.app/](https://e-commerce-backend-nine-alpha.vercel.app/)
- > **Documentation**: Disponible via la collection Insomnia

- > ℹ️ **Note sur la Performance** : L'API est hébergée sur le plan gratuit de Vercel. La première requête peut subir un délai (~3s) dû au **Cold Start** (réveil) des fonctions Serverless. Les requêtes suivantes sont instantanées.

---

## 🏗️ Architecture

L'API suit un pattern **MVC (Model-View-Controller)** modulaire, déployé en Fonctions Serverless.

```mermaid
graph TB
    Client[Client / Insomnia]
    Vercel[Fonction Serverless Vercel]
    Middleware[Couche Middleware<br/>Auth & Sécurité]
    Controllers[Contrôleurs<br/>API REST]
    Services[Services<br/>Logique Métier]
    Prisma[Client Prisma<br/>ORM]
    Neon[(PostgreSQL Neon<br/>Base de données)]
    Redis[(Redis Upstash<br/>Cache & Panier)]
    Cloudinary[CDN Cloudinary<br/>Stockage Média]

    Client -->|Requête HTTPS| Vercel
    Vercel --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Prisma
    Services --> Redis
    Services --> Cloudinary
    Prisma --> Neon

    style Client fill:#e1f5ff
    style Vercel fill:#000000,color:#fff
    style Middleware fill:#ff6b6b,color:#fff
    style Controllers fill:#4ecdc4,color:#fff
    style Services fill:#95e1d3
    style Prisma fill:#2d3748,color:#fff
    style Neon fill:#336791,color:#fff
    style Redis fill:#dc2626,color:#fff
    style Cloudinary fill:#3448c5,color:#fff
```

---

## ✨ Fonctionnalités

### Fonctionnalités Clés

- **Produits** : CRUD complet, recherche textuelle, filtres et pagination
- **Authentification** : Système JWT sécurisé avec rotation de tokens (Access/Refresh)
- **Commandes** : Gestion du cycle de vie des commandes et validation des stocks
- **Panier** : Panier haute performance basé sur les sessions Redis (TTL)
- **Avis** : Système de notation et commentaires clients
- **Images** : Upload et optimisation d'images via Cloudinary

### Rôles (RBAC)

- **USER** : Navigation, panier, commande, avis
- **MANAGER** : Gestion du catalogue produits
- **ADMIN** : Accès complet, gestion clients et statuts

---

## 🛠️ Stack Technique

### Cœur du Backend

- **Runtime** : Node.js 18+
- **Langage** : TypeScript 5.9
- **Framework** : Express 5.1
- **Base de données** : PostgreSQL (via Neon Serverless)
- **ORM** : Prisma 6.16
- **Cache** : Redis (via Upstash / ioredis)

### Infrastructure & Outils

- **Déploiement** : Vercel (Fonctions Serverless)
- **Stockage** : Cloudinary (CDN Images)
- **Validation** : Zod (Validation de schémas)
- **Sécurité** : Helmet, Rate-Limit, Bcrypt, CORS
- **Logging** : Winston
- **Tests** : Jest, Supertest

---

## 📚 Documentation API

### 📥 Collection Insomnia

Pour des raisons de sécurité et de performance, Swagger UI est désactivé en production.
La documentation complète (avec environnements pré-configurés) est disponible via **Insomnia**.

👉 **[Télécharger la Collection Insomnia](./documentation/api_collections/insomnia_collection.json)**

### Identifiants de Test

| Rôle      | Email                     | Mot de passe   |
| --------- | ------------------------- | -------------- |
| **ADMIN** | `admin_test@fakemail.com` | `P@ssword123.` |
| **USER**  | `user_test@fakemail.com`  | `P@ssword123.` |

---

## 🔒 Sécurité

Cette API implémente les standards de sécurité de l'industrie :

- **Helmet** : Configuration des headers HTTP sécurisés
- **Rate Limiting** : Protection contre brute-force (Login : 5 tentatives/15min)
- **Validation** : Toutes les entrées sont validées via **Zod**
- **CORS** : Liste blanche stricte pour la production
- **Logs** : Les erreurs de production sont sanitisées (pas de stack traces)

---

## 📄 Licence

Ce projet est sous licence MIT.

---

**Développé par Dammaretz Gaëtan**
