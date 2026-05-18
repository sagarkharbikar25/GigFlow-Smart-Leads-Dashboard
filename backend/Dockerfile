# ==========================================
# 🧱 Stage 1: Build & Compile TypeScript
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including typescript compilers)
RUN npm ci

# Copy source code files
COPY src/ ./src

# Transpile TypeScript to vanilla production JS inside /dist
RUN npm run build

# ==========================================
# 🔌 Stage 2: Production Lightweight Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy manifests
COPY package*.json ./

# Install ONLY production dependencies (reduces image sizes drastically!)
RUN npm ci --only=production

# Copy compiled JavaScript distribution folder from build stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose API PORT
EXPOSE 5000

# Enforce secure container isolation by running as non-root user
USER node

# Start the Express server
CMD ["node", "dist/app.js"]
