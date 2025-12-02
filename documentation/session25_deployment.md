# Session25 Deployment

❗Issue with railway, the free plan doesn't allow hosting the project and the basic plan is very restrictive.

## Deployment Strategy

Given the limitations with Railway's free tier, we will explore alternative deployment strategies for the e-commerce backend. The primary goal is to find a cost-effective and developer-friendly platform that supports Node.js applications and PostgreSQL databases.

### Potential Alternatives

#### IA suggestion

1.  **Render:**

    - **Pros:** Offers a generous free tier for web services and databases, supports automatic deployments from Git, and has a clear pricing model for scaling.
    - **Cons:** Free tier services might spin down after inactivity, leading to slower initial load times.

2.  **Vercel (for API) + ElephantSQL/Supabase (for DB):**

    - **Pros:** Vercel is excellent for serverless functions (which can host our API routes), offers a very generous free tier, and integrates well with Git. ElephantSQL and Supabase provide managed PostgreSQL databases with free tiers.
    - **Cons:** Might require restructuring the application slightly to fit a serverless function model, and managing two separate services (API and DB) adds a bit of complexity.

3.  **Fly.io:**

    - **Pros:** Offers a free tier for small applications, allows for full control over the environment (Docker-based), and supports PostgreSQL.
    - **Cons:** Can have a steeper learning curve compared to more managed services.

4.  **Heroku (if free tier was still available/for small projects):**
    - **Pros:** Historically very easy to deploy Node.js apps and PostgreSQL.
    - **Cons:** Free tier has been discontinued, making it less suitable for this project's initial phase.

### Chosen Approach (TBD - To be decided based on further research and ease of integration):

We will prioritize **Render** due to its integrated approach for both web services and databases, which simplifies deployment and management. If Render's free tier proves insufficient or too restrictive, we will then evaluate **Vercel + ElephantSQL/Supabase** as the next best option.

### Deployment Steps (General):

1.  **Containerization (Docker):** Ensure the application is Dockerized for consistent environments across development and deployment.
2.  **Database Provisioning:** Set up a PostgreSQL database instance on the chosen

---

### My choice

PARTIE 1 : Services Externes Setup
├─ 1.1: [X] Neon PostgreSQL
├─ 1.2: Upstash Redis
└─ 1.3: Cloudinary Images

PARTIE 2 : Adaptation du Code
├─ 2.1: Redis Upstash Integration
├─ 2.2: Cloudinary Upload
└─ 2.3: Environment Config

PARTIE 3 : Deploy Render
├─ 3.1: Render Service Setup
├─ 3.2: Variables d'environnement
├─ 3.3: Premier deploy & tests

PARTIE 4 : CI/CD GitHub Actions
├─ 4.1: Workflows CI/CD
└─ 4.2: Branch protection

PARTIE 5 : Polish & Documentation
├─ 5.1: README update
├─ 5.2: Keep-alive
└─ 5.3: Status badges

---
