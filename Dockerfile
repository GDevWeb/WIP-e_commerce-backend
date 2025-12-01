# ========================================
# Build Stage
# ========================================
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install ALL dependencies (dev + prod for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy ONLY src folder
COPY src ./src

# Build TypeScript
RUN npm run build

# Verify build output
RUN ls -la dist/

# ========================================
# Production Stage
# ========================================
FROM node:18-alpine AS production

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Verify files copied
RUN ls -la dist/

# Create uploads folder
RUN mkdir -p uploads/products

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]